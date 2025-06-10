import type { Response } from "express"
import crypto from "crypto"
import dns from "dns"
import { promisify } from "util"
import Domain from "../models/domain.model"
import type { AuthRequest } from "../types"

const resolveTxt = promisify(dns.resolveTxt)

export const createDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body
    const userId = req.user!._id

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ name })
    if (existingDomain) {
      res.status(400).json({
        success: false,
        message: "Domain already exists",
      })
      return
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(16).toString("hex")

    // Create domain
    const domain = await Domain.create({
      userId,
      name,
      verificationToken,
    })

    res.status(201).json({
      success: true,
      message: "Domain created successfully",
      data: {
        domain: {
          id: domain._id,
          name: domain.name,
          isVerified: domain.isVerified,
          verificationToken: domain.verificationToken,
          isDefault: domain.isDefault,
          createdAt: domain.createdAt,
        },
      },
    })
  } catch (error) {
    console.error("Create domain error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getDomains = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id

    const domains = await Domain.find({ userId }).sort({ isDefault: -1, createdAt: -1 })

    res.json({
      success: true,
      data: {
        domains: domains.map((domain) => ({
          id: domain._id,
          name: domain.name,
          isVerified: domain.isVerified,
          verificationToken: domain.verificationToken,
          isDefault: domain.isDefault,
          createdAt: domain.createdAt,
        })),
      },
    })
  } catch (error) {
    console.error("Get domains error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const verifyDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id

    const domain = await Domain.findOne({ _id: id, userId })
    if (!domain) {
      res.status(404).json({
        success: false,
        message: "Domain not found",
      })
      return
    }

    if (domain.isVerified) {
      res.status(400).json({
        success: false,
        message: "Domain is already verified",
      })
      return
    }

    try {
      // Check TXT record
      const records = await resolveTxt(domain.name)
      const flatRecords = records.flat()
      const expectedRecord = `shortener-verify=${domain.verificationToken}`

      if (flatRecords.includes(expectedRecord)) {
        domain.isVerified = true
        await domain.save()

        res.json({
          success: true,
          message: "Domain verified successfully",
          data: {
            domain: {
              id: domain._id,
              name: domain.name,
              isVerified: domain.isVerified,
              isDefault: domain.isDefault,
            },
          },
        })
      } else {
        res.status(400).json({
          success: false,
          message: "Verification record not found. Please add the TXT record and try again.",
        })
      }
    } catch (dnsError) {
      res.status(400).json({
        success: false,
        message: "Unable to verify domain. Please check your DNS settings.",
      })
    }
  } catch (error) {
    console.error("Verify domain error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const setDefaultDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id

    const domain = await Domain.findOne({ _id: id, userId })
    if (!domain) {
      res.status(404).json({
        success: false,
        message: "Domain not found",
      })
      return
    }

    if (!domain.isVerified) {
      res.status(400).json({
        success: false,
        message: "Domain must be verified before setting as default",
      })
      return
    }

    // Update all domains to not be default
    await Domain.updateMany({ userId }, { isDefault: false })

    // Set this domain as default
    domain.isDefault = true
    await domain.save()

    res.json({
      success: true,
      message: "Default domain updated successfully",
      data: {
        domain: {
          id: domain._id,
          name: domain.name,
          isVerified: domain.isVerified,
          isDefault: domain.isDefault,
        },
      },
    })
  } catch (error) {
    console.error("Set default domain error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteDomain = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id

    const domain = await Domain.findOne({ _id: id, userId })
    if (!domain) {
      res.status(404).json({
        success: false,
        message: "Domain not found",
      })
      return
    }

    if (domain.isDefault) {
      res.status(400).json({
        success: false,
        message: "Cannot delete default domain",
      })
      return
    }

    await Domain.findByIdAndDelete(id)

    res.json({
      success: true,
      message: "Domain deleted successfully",
    })
  } catch (error) {
    console.error("Delete domain error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
