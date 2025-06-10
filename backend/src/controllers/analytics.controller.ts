import type { Response } from "express"
import Link from "../models/link.model"
import Click from "../models/click.model"
import type { AuthRequest } from "../types"

// @desc    Get overall analytics for user
// @route   GET /api/analytics/overall
// @access  Private
export const getOverallAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query

    // Build date filter
    const dateFilter: any = {}
    if (startDate) dateFilter.$gte = new Date(startDate as string)
    if (endDate) dateFilter.$lte = new Date(endDate as string)

    // Get user's links
    const userLinks = await Link.find({ userId: req.user!._id }).select("_id")
    const linkIds = userLinks.map((link) => link._id)

    // Build click filter
    const clickFilter: any = { linkId: { $in: linkIds } }
    if (Object.keys(dateFilter).length > 0) {
      clickFilter.createdAt = dateFilter
    }

    // Get analytics data
    const [totalLinks, totalClicks, clicksByDay, topCountries, topBrowsers] = await Promise.all([
      Link.countDocuments({ userId: req.user!._id }),
      Click.countDocuments(clickFilter),
      Click.aggregate([
        { $match: clickFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
      Click.aggregate([
        { $match: clickFilter },
        { $group: { _id: "$country", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: clickFilter },
        { $group: { _id: "$browser", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
    ])

    res.status(200).json({
      success: true,
      analytics: {
        totalLinks,
        totalClicks,
        clicksByDay,
        topCountries,
        topBrowsers,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// @desc    Get analytics for specific link
// @route   GET /api/analytics/links/:id
// @access  Private
export const getLinkAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query

    // Check if link belongs to user
    const link = await Link.findOne({ _id: id, userId: req.user!._id })
    if (!link) {
      res.status(404).json({
        success: false,
        message: "Link not found",
      })
      return
    }

    // Build date filter
    const dateFilter: any = {}
    if (startDate) dateFilter.$gte = new Date(startDate as string)
    if (endDate) dateFilter.$lte = new Date(endDate as string)

    // Build click filter
    const clickFilter: any = { linkId: id }
    if (Object.keys(dateFilter).length > 0) {
      clickFilter.createdAt = dateFilter
    }

    // Get analytics data
    const [totalClicks, clicksByDay, topCountries, topBrowsers, topReferrers] = await Promise.all([
      Click.countDocuments(clickFilter),
      Click.aggregate([
        { $match: clickFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            clicks: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
      Click.aggregate([
        { $match: clickFilter },
        { $group: { _id: "$country", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: clickFilter },
        { $group: { _id: "$browser", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
      Click.aggregate([
        { $match: clickFilter },
        { $group: { _id: "$referrer", clicks: { $sum: 1 } } },
        { $sort: { clicks: -1 } },
        { $limit: 10 },
      ]),
    ])

    res.status(200).json({
      success: true,
      analytics: {
        link: {
          id: link._id,
          originalUrl: link.originalUrl,
          slug: link.slug,
          title: link.title,
        },
        totalClicks,
        clicksByDay,
        topCountries,
        topBrowsers,
        topReferrers,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
