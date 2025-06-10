import type { Request, Response } from "express"
import UAParser from "ua-parser-js"
import Link from "../models/link.model"
import Domain from "../models/domain.model"
import Click from "../models/click.model"
import bcrypt from "bcryptjs"

// Helper function to get client IP
const getClientIP = (req: Request): string => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown"
  )
}

// Helper function to get location data (mock implementation)
const getLocationData = async (ip: string) => {
  // In production, you would use a service like MaxMind GeoIP2 or ipapi.co
  // For now, return mock data
  return {
    country: "Unknown",
    city: "Unknown",
    region: "Unknown",
  }
}

// @desc    Handle redirect for short URLs
// @route   GET /:slug
// @access  Public
export const handleRedirect = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params
    const host = req.get("host") || "localhost:5000"
    const password = req.query.password as string

    // Find domain
    let domain = await Domain.findOne({ name: host })

    // For development, handle localhost
    if (!domain && (host.includes("localhost") || host.includes("127.0.0.1"))) {
      domain = await Domain.findOne({ name: process.env.DEFAULT_DOMAIN || "somn.in" })
    }

    if (!domain) {
      res.status(404).json({
        success: false,
        message: "Domain not found",
      })
      return
    }

    // Find link
    const link = await Link.findOne({
      domainId: domain._id,
      slug,
      isActive: true,
    })

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      res.status(410).json({
        success: false,
        message: "Link has expired",
      })
      return
    }

    // Check if link is password protected
    if (link.password) {
      if (!password) {
        res.status(401).json({
          success: false,
          message: "Password required",
          requiresPassword: true,
        })
        return
      }

      const isPasswordValid = await bcrypt.compare(password, link.password)
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid password",
          requiresPassword: true,
        })
        return
      }
    }

    // Parse user agent
    const parser = new UAParser(req.headers["user-agent"])
    const result = parser.getResult()

    // Get client IP and location
    const clientIP = getClientIP(req)
    const locationData = await getLocationData(clientIP)

    // Record click
    await Click.create({
      linkId: link._id,
      ipAddress: clientIP,
      userAgent: req.headers["user-agent"] || "unknown",
      referrer: req.headers.referer || "direct",
      browser: result.browser.name || "unknown",
      os: result.os.name || "unknown",
      device: result.device.type || "desktop",
      country: locationData.country,
      city: locationData.city,
      region: locationData.region,
    })

    // Increment click count
    await Link.findByIdAndUpdate(link._id, {
      $inc: { clickCount: 1 },
    })

    // Redirect to original URL
    res.redirect(301, link.originalUrl)
  } catch (error: any) {
    console.error("Redirect error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// @desc    Get link preview (for password-protected links)
// @route   GET /preview/:slug
// @access  Public
export const getLinkPreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params
    const host = req.get("host") || "localhost:5000"

    // Find domain
    let domain = await Domain.findOne({ name: host })

    // For development, handle localhost
    if (!domain && (host.includes("localhost") || host.includes("127.0.0.1"))) {
      domain = await Domain.findOne({ name: process.env.DEFAULT_DOMAIN || "somn.in" })
    }

    if (!domain) {
      res.status(404).json({
        success: false,
        message: "Domain not found",
      })
      return
    }

    // Find link
    const link = await Link.findOne({
      domainId: domain._id,
      slug,
      isActive: true,
    })

    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      res.status(410).json({
        success: false,
        message: "Link has expired",
      })
      return
    }

    res.status(200).json({
      success: true,
      link: {
        title: link.title,
        description: link.description,
        requiresPassword: !!link.password,
        expiresAt: link.expiresAt,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
