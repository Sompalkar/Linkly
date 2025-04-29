import Click from "../models/click.model.js"
import Link from "../models/link.model.js"

// Get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, endDate } = req.query

    // Verify link ownership
    const link = await Link.findOne({
      _id: id,
      userId: req.user.id,
    })

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Link not found",
      })
    }

    // Build date filter
    const dateFilter = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    const query = { linkId: id }
    if (Object.keys(dateFilter).length > 0) {
      query.timestamp = dateFilter
    }

    // Get total clicks
    const totalClicks = await Click.countDocuments(query)

    // Get clicks by date
    const clicksByDate = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get clicks by browser
    const clicksByBrowser = await Click.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    // Get clicks by device
    const clicksByDevice = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    // Get clicks by country
    const clicksByCountry = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    // Get clicks by referrer
    const clicksByReferrer = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    res.status(200).json({
      success: true,
      analytics: {
        totalClicks,
        clicksByDate,
        clicksByBrowser,
        clicksByDevice,
        clicksByCountry,
        clicksByReferrer,
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

// Get overall analytics for all user links
export const getOverallAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Get all user links
    const userLinks = await Link.find({ userId: req.user.id }).select("_id")
    const linkIds = userLinks.map((link) => link._id)

    if (linkIds.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalClicks: 0,
          clicksByDate: [],
          topLinks: [],
        },
      })
    }

    // Build date filter
    const dateFilter = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    const query = { linkId: { $in: linkIds } }
    if (Object.keys(dateFilter).length > 0) {
      query.timestamp = dateFilter
    }

    // Get total clicks
    const totalClicks = await Click.countDocuments(query)

    // Get clicks by date
    const clicksByDate = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get top performing links
    const topLinks = await Click.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$linkId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "links",
          localField: "_id",
          foreignField: "_id",
          as: "linkDetails",
        },
      },
      { $unwind: "$linkDetails" },
      {
        $lookup: {
          from: "domains",
          localField: "linkDetails.domainId",
          foreignField: "_id",
          as: "domainDetails",
        },
      },
      { $unwind: "$domainDetails" },
      {
        $project: {
          _id: 1,
          count: 1,
          originalUrl: "$linkDetails.originalUrl",
          slug: "$linkDetails.slug",
          title: "$linkDetails.title",
          domain: "$domainDetails.name",
        },
      },
    ])

    res.status(200).json({
      success: true,
      analytics: {
        totalClicks,
        clicksByDate,
        topLinks,
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
