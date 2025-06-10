"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkAnalytics = exports.getOverallAnalytics = void 0;
const link_model_1 = __importDefault(require("../models/link.model"));
const click_model_1 = __importDefault(require("../models/click.model"));
const getOverallAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate)
            dateFilter.$gte = new Date(startDate);
        if (endDate)
            dateFilter.$lte = new Date(endDate);
        const userLinks = await link_model_1.default.find({ userId: req.user._id }).select("_id");
        const linkIds = userLinks.map((link) => link._id);
        const clickFilter = { linkId: { $in: linkIds } };
        if (Object.keys(dateFilter).length > 0) {
            clickFilter.createdAt = dateFilter;
        }
        const [totalLinks, totalClicks, clicksByDay, topCountries, topBrowsers] = await Promise.all([
            link_model_1.default.countDocuments({ userId: req.user._id }),
            click_model_1.default.countDocuments(clickFilter),
            click_model_1.default.aggregate([
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
            click_model_1.default.aggregate([
                { $match: clickFilter },
                { $group: { _id: "$country", clicks: { $sum: 1 } } },
                { $sort: { clicks: -1 } },
                { $limit: 10 },
            ]),
            click_model_1.default.aggregate([
                { $match: clickFilter },
                { $group: { _id: "$browser", clicks: { $sum: 1 } } },
                { $sort: { clicks: -1 } },
                { $limit: 10 },
            ]),
        ]);
        res.status(200).json({
            success: true,
            analytics: {
                totalLinks,
                totalClicks,
                clicksByDay,
                topCountries,
                topBrowsers,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.getOverallAnalytics = getOverallAnalytics;
const getLinkAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;
        const link = await link_model_1.default.findOne({ _id: id, userId: req.user._id });
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        const dateFilter = {};
        if (startDate)
            dateFilter.$gte = new Date(startDate);
        if (endDate)
            dateFilter.$lte = new Date(endDate);
        const clickFilter = { linkId: id };
        if (Object.keys(dateFilter).length > 0) {
            clickFilter.createdAt = dateFilter;
        }
        const [totalClicks, clicksByDay, topCountries, topBrowsers, topReferrers] = await Promise.all([
            click_model_1.default.countDocuments(clickFilter),
            click_model_1.default.aggregate([
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
            click_model_1.default.aggregate([
                { $match: clickFilter },
                { $group: { _id: "$country", clicks: { $sum: 1 } } },
                { $sort: { clicks: -1 } },
                { $limit: 10 },
            ]),
            click_model_1.default.aggregate([
                { $match: clickFilter },
                { $group: { _id: "$browser", clicks: { $sum: 1 } } },
                { $sort: { clicks: -1 } },
                { $limit: 10 },
            ]),
            click_model_1.default.aggregate([
                { $match: clickFilter },
                { $group: { _id: "$referrer", clicks: { $sum: 1 } } },
                { $sort: { clicks: -1 } },
                { $limit: 10 },
            ]),
        ]);
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
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.getLinkAnalytics = getLinkAnalytics;
//# sourceMappingURL=analytics.controller.js.map