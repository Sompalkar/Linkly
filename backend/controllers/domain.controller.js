import Domain from "../models/domain.model.js"
import crypto from "crypto"
import dns from "dns"
import { promisify } from "util"

const resolveTxt = promisify(dns.resolveTxt)

// Create a new domain
export const createDomain = async (req, res) => {
  try {
    const { name } = req.body

    // Validate domain format
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/
    if (!domainRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Invalid domain format",
      })
    }

    // Check if domain already exists
    const existingDomain = await Domain.findOne({ name })
    if (existingDomain) {
      return res.status(400).json({
        success: false,
        message: "Domain already registered",
      })
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(16).toString("hex")

    // Create domain
    const domain = await Domain.create({
      userId: req.user.id,
      name,
      verificationToken,
      isVerified: false,
    })

    res.status(201).json({
      success: true,
      domain: {
        id: domain._id,
        name: domain.name,
        isVerified: domain.isVerified,
        verificationToken: domain.verificationToken,
        createdAt: domain.createdAt,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get all domains for a user
export const getDomains = async (req, res) => {
  try {
    const domains = await Domain.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      domains: domains.map((domain) => ({
        id: domain._id,
        name: domain.name,
        isVerified: domain.isVerified,
        verificationToken: domain.verificationToken,
        isDefault: domain.isDefault,
        createdAt: domain.createdAt,
      })),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Verify domain ownership
export const verifyDomain = async (req, res) => {
  try {
    const { id } = req.params

    // Find domain
    const domain = await Domain.findOne({
      _id: id,
      userId: req.user.id,
    })

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      })
    }

    if (domain.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Domain is already verified",
      })
    }

    try {
      // Check TXT record
      const records = await resolveTxt(domain.name)
      const verificationRecord = records
        .flat()
        .find((record) => record.includes(`shortener-verify=${domain.verificationToken}`))

      if (!verificationRecord) {
        return res.status(400).json({
          success: false,
          message: "TXT record not found or incorrect",
        })
      }

      // Update domain
      domain.isVerified = true
      await domain.save()

      res.status(200).json({
        success: true,
        message: "Domain verified successfully",
        domain: {
          id: domain._id,
          name: domain.name,
          isVerified: domain.isVerified,
          createdAt: domain.createdAt,
        },
      })
    } catch (dnsError) {
      res.status(400).json({
        success: false,
        message: "Failed to verify domain. Check DNS configuration.",
        error: dnsError.message,
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Delete a domain
export const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params

    // Find domain
    const domain = await Domain.findOne({
      _id: id,
      userId: req.user.id,
    })

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      })
    }

    if (domain.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete default domain",
      })
    }

    await domain.deleteOne()

    res.status(200).json({
      success: true,
      message: "Domain deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Set domain as default
export const setDefaultDomain = async (req, res) => {
  try {
    const { id } = req.params

    // Find domain
    const domain = await Domain.findOne({
      _id: id,
      userId: req.user.id,
      isVerified: true,
    })

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found or not verified",
      })
    }

    // Reset all domains to non-default
    await Domain.updateMany({ userId: req.user.id }, { isDefault: false })

    // Set this domain as default
    domain.isDefault = true
    await domain.save()

    res.status(200).json({
      success: true,
      message: "Default domain updated successfully",
      domain: {
        id: domain._id,
        name: domain.name,
        isDefault: domain.isDefault,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
