import Link from "../models/link.model.js"
import Domain from "../models/domain.model.js"
import shortid from "shortid"
import bcrypt from "bcryptjs"

// Create a new link
export const createLink = async (req, res) => {
  try {
    const { originalUrl, slug, title, domainId, password, expiresAt, utmSource, utmMedium, utmCampaign } = req.body

    // Validate URL
    try {
      new URL(originalUrl)
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      })
    }

    // Check if domain exists and belongs to user
    const domain = await Domain.findOne({
      _id: domainId,
      userId: req.user.id,
    })

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found or not owned by user",
      })
    }

    // Generate or validate slug
    let finalSlug = slug || shortid.generate()

    // Check if slug is already in use for this domain
    const existingLink = await Link.findOne({
      domainId,
      slug: finalSlug,
    })

    if (existingLink) {
      if (slug) {
        // If user specified a custom slug that's taken
        return res.status(400).json({
          success: false,
          message: "Custom slug already in use",
        })
      } else {
        // If generated slug is taken, generate a new one
        finalSlug = shortid.generate()
      }
    }

    // Hash password if provided
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // Create link
    const link = await Link.create({
      userId: req.user.id,
      domainId,
      originalUrl,
      slug: finalSlug,
      title: title || originalUrl,
      password: hashedPassword,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      utmSource,
      utmMedium,
      utmCampaign,
    })

    res.status(201).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: `${domain.name}/${link.slug}`,
        slug: link.slug,
        title: link.title,
        clickCount: link.clickCount,
        createdAt: link.createdAt,
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

// Get all links for a user
export const getLinks = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const links = await Link.find({ userId: req.user.id })
      .populate("domainId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Link.countDocuments({ userId: req.user.id })

    const formattedLinks = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: `${link.domainId.name}/${link.slug}`,
      slug: link.slug,
      title: link.title,
      clickCount: link.clickCount,
      createdAt: link.createdAt,
      isActive: link.isActive,
      expiresAt: link.expiresAt,
    }))

    res.status(200).json({
      success: true,
      links: formattedLinks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
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

// Get a single link by ID
export const getLinkById = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("domainId", "name")

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      })
    }

    res.status(200).json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: `${link.domainId.name}/${link.slug}`,
        slug: link.slug,
        title: link.title,
        clickCount: link.clickCount,
        createdAt: link.createdAt,
        isActive: link.isActive,
        expiresAt: link.expiresAt,
        utmSource: link.utmSource,
        utmMedium: link.utmMedium,
        utmCampaign: link.utmCampaign,
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

// Update a link
export const updateLink = async (req, res) => {
  try {
    const { title, isActive, password } = req.body

    // Find link
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      })
    }

    // Update fields
    if (title !== undefined) link.title = title
    if (isActive !== undefined) link.isActive = isActive

    // Hash password if provided
    if (password) {
      link.password = await bcrypt.hash(password, 10)
    }

    await link.save()

    res.status(200).json({
      success: true,
      message: "Link updated successfully",
      link: {
        id: link._id,
        title: link.title,
        isActive: link.isActive,
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

// Delete a link
export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Link deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
