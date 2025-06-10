import type { Response } from "express"
import crypto from "crypto"
import QRCode from "qrcode"
import Link from "../models/link.model"
import Domain from "../models/domain.model"
import type { AuthRequest } from "../types"

const generateSlug = (): string => {
  return crypto.randomBytes(4).toString("hex")
}

const generateQRCode = async (url: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(url)
  } catch (error) {
    console.error("QR code generation error:", error)
    return ""
  }
}

export const createLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { originalUrl, customSlug, title, description, tags, password, expiresAt, domainId } = req.body
    const userId = req.user!._id

    // Get domain
    let domain
    if (domainId) {
      domain = await Domain.findOne({ _id: domainId, userId })
    } else {
      domain = await Domain.findOne({ userId, isDefault: true })
    }

    if (!domain) {
      res.status(400).json({
        success: false,
        message: "No valid domain found",
      })
      return
    }

    // Generate or validate slug
    let slug = customSlug || generateSlug()

    // Check if slug already exists for this domain
    const existingLink = await Link.findOne({ domainId: domain._id, slug })
    if (existingLink) {
      if (customSlug) {
        res.status(400).json({
          success: false,
          message: "Custom slug already exists",
        })
        return
      }
      slug = generateSlug()
    }

    // Create short URL
    const shortUrl = `https://${domain.name}/${slug}`

    // Generate QR code
    const qrCode = await generateQRCode(shortUrl)

    // Create link
    const link = await Link.create({
      userId,
      originalUrl,
      slug,
      domainId: domain._id,
      title,
      description,
      tags: tags || [],
      qrCode,
      password,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    })

    await link.populate("domainId", "name")

    res.status(201).json({
      success: true,
      message: "Link created successfully",
      data: {
        link: {
          id: link._id,
          originalUrl: link.originalUrl,
          shortUrl,
          slug: link.slug,
          title: link.title,
          description: link.description,
          tags: link.tags,
          qrCode: link.qrCode,
          clickCount: link.clickCount,
          isActive: link.isActive,
          expiresAt: link.expiresAt,
          createdAt: link.createdAt,
        },
      },
    })
  } catch (error) {
    console.error("Create link error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const createBulkLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { urls } = req.body
    const userId = req.user!._id

    if (!Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({
        success: false,
        message: "URLs array is required",
      })
      return
    }

    if (urls.length > 100) {
      res.status(400).json({
        success: false,
        message: "Maximum 100 URLs allowed per batch",
      })
      return
    }

    // Get default domain
    const domain = await Domain.findOne({ userId, isDefault: true })
    if (!domain) {
      res.status(400).json({
        success: false,
        message: "No default domain found",
      })
      return
    }

    const results = {
      links: [] as any[],
      errors: [] as any[],
    }

    for (const urlData of urls) {
      try {
        const { originalUrl, title } = urlData
        const slug = generateSlug()
        const shortUrl = `https://${domain.name}/${slug}`
        const qrCode = await generateQRCode(shortUrl)

        const link = await Link.create({
          userId,
          originalUrl,
          slug,
          domainId: domain._id,
          title,
          qrCode,
        })

        results.links.push({
          id: link._id,
          originalUrl: link.originalUrl,
          shortUrl,
          title: link.title,
        })
      } catch (error) {
        results.errors.push({
          url: urlData.originalUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    res.json({
      success: true,
      message: `Bulk creation completed. ${results.links.length} links created, ${results.errors.length} errors`,
      data: results,
    })
  } catch (error) {
    console.error("Bulk create error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const search = req.query.search as string
    const tag = req.query.tag as string
    const sortBy = (req.query.sortBy as string) || "createdAt"
    const sortOrder = (req.query.sortOrder as string) || "desc"

    const skip = (page - 1) * limit

    // Build query
    const query: any = { userId }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { originalUrl: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ]
    }

    if (tag) {
      query.tags = tag
    }

    // Build sort
    const sort: any = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get links
    const links = await Link.find(query).populate("domainId", "name").sort(sort).skip(skip).limit(limit)

    const total = await Link.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Format response
    const formattedLinks = links.map((link: any) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: `https://${link.domainId.name}/${link.slug}`,
      slug: link.slug,
      title: link.title,
      description: link.description,
      tags: link.tags,
      qrCode: link.qrCode,
      clickCount: link.clickCount,
      isActive: link.isActive,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    }))

    res.json({
      success: true,
      data: {
        links: formattedLinks,
        pagination: {
          page,
          pages,
          total,
          limit,
        },
      },
    })
  } catch (error) {
    console.error("Get links error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getLinkById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id

    const link = await Link.findOne({ _id: id, userId }).populate("domainId", "name")

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    res.json({
      success: true,
      data: {
        link: {
          id: link._id,
          originalUrl: link.originalUrl,
          shortUrl: `https://${(link.domainId as any).name}/${link.slug}`,
          slug: link.slug,
          title: link.title,
          description: link.description,
          tags: link.tags,
          qrCode: link.qrCode,
          clickCount: link.clickCount,
          isActive: link.isActive,
          expiresAt: link.expiresAt,
          createdAt: link.createdAt,
        },
      },
    })
  } catch (error) {
    console.error("Get link error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const updateLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id
    const updates = req.body

    const link = await Link.findOneAndUpdate({ _id: id, userId }, updates, { new: true }).populate("domainId", "name")

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    res.json({
      success: true,
      message: "Link updated successfully",
      data: {
        link: {
          id: link._id,
          originalUrl: link.originalUrl,
          shortUrl: `https://${(link.domainId as any).name}/${link.slug}`,
          slug: link.slug,
          title: link.title,
          description: link.description,
          tags: link.tags,
          qrCode: link.qrCode,
          clickCount: link.clickCount,
          isActive: link.isActive,
          expiresAt: link.expiresAt,
          createdAt: link.createdAt,
        },
      },
    })
  } catch (error) {
    console.error("Update link error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!._id

    const link = await Link.findOneAndDelete({ _id: id, userId })

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    res.json({
      success: true,
      message: "Link deleted successfully",
    })
  } catch (error) {
    console.error("Delete link error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getTags = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id

    const tags = await Link.aggregate([
      { $match: { userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ])

    res.json({
      success: true,
      data: { tags },
    })
  } catch (error) {
    console.error("Get tags error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
