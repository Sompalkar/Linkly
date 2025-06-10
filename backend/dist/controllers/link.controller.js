"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = exports.deleteLink = exports.updateLink = exports.getLinkById = exports.getLinks = exports.createBulkLinks = exports.createLink = void 0;
const crypto_1 = __importDefault(require("crypto"));
const qrcode_1 = __importDefault(require("qrcode"));
const link_model_1 = __importDefault(require("../models/link.model"));
const domain_model_1 = __importDefault(require("../models/domain.model"));
const generateSlug = () => {
    return crypto_1.default.randomBytes(4).toString("hex");
};
const generateQRCode = async (url) => {
    try {
        return await qrcode_1.default.toDataURL(url);
    }
    catch (error) {
        console.error("QR code generation error:", error);
        return "";
    }
};
const createLink = async (req, res) => {
    try {
        const { originalUrl, customSlug, title, description, tags, password, expiresAt, domainId } = req.body;
        const userId = req.user._id;
        let domain;
        if (domainId) {
            domain = await domain_model_1.default.findOne({ _id: domainId, userId });
        }
        else {
            domain = await domain_model_1.default.findOne({ userId, isDefault: true });
        }
        if (!domain) {
            res.status(400).json({
                success: false,
                message: "No valid domain found",
            });
            return;
        }
        let slug = customSlug || generateSlug();
        const existingLink = await link_model_1.default.findOne({ domainId: domain._id, slug });
        if (existingLink) {
            if (customSlug) {
                res.status(400).json({
                    success: false,
                    message: "Custom slug already exists",
                });
                return;
            }
            slug = generateSlug();
        }
        const shortUrl = `https://${domain.name}/${slug}`;
        const qrCode = await generateQRCode(shortUrl);
        const link = await link_model_1.default.create({
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
        });
        await link.populate("domainId", "name");
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
        });
    }
    catch (error) {
        console.error("Create link error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createLink = createLink;
const createBulkLinks = async (req, res) => {
    try {
        const { urls } = req.body;
        const userId = req.user._id;
        if (!Array.isArray(urls) || urls.length === 0) {
            res.status(400).json({
                success: false,
                message: "URLs array is required",
            });
            return;
        }
        if (urls.length > 100) {
            res.status(400).json({
                success: false,
                message: "Maximum 100 URLs allowed per batch",
            });
            return;
        }
        const domain = await domain_model_1.default.findOne({ userId, isDefault: true });
        if (!domain) {
            res.status(400).json({
                success: false,
                message: "No default domain found",
            });
            return;
        }
        const results = {
            links: [],
            errors: [],
        };
        for (const urlData of urls) {
            try {
                const { originalUrl, title } = urlData;
                const slug = generateSlug();
                const shortUrl = `https://${domain.name}/${slug}`;
                const qrCode = await generateQRCode(shortUrl);
                const link = await link_model_1.default.create({
                    userId,
                    originalUrl,
                    slug,
                    domainId: domain._id,
                    title,
                    qrCode,
                });
                results.links.push({
                    id: link._id,
                    originalUrl: link.originalUrl,
                    shortUrl,
                    title: link.title,
                });
            }
            catch (error) {
                results.errors.push({
                    url: urlData.originalUrl,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            }
        }
        res.json({
            success: true,
            message: `Bulk creation completed. ${results.links.length} links created, ${results.errors.length} errors`,
            data: results,
        });
    }
    catch (error) {
        console.error("Bulk create error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createBulkLinks = createBulkLinks;
const getLinks = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const tag = req.query.tag;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        const skip = (page - 1) * limit;
        const query = { userId };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { originalUrl: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }
        if (tag) {
            query.tags = tag;
        }
        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;
        const links = await link_model_1.default.find(query).populate("domainId", "name").sort(sort).skip(skip).limit(limit);
        const total = await link_model_1.default.countDocuments(query);
        const pages = Math.ceil(total / limit);
        const formattedLinks = links.map((link) => ({
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
        }));
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
        });
    }
    catch (error) {
        console.error("Get links error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getLinks = getLinks;
const getLinkById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const link = await link_model_1.default.findOne({ _id: id, userId }).populate("domainId", "name");
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        res.json({
            success: true,
            data: {
                link: {
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
                },
            },
        });
    }
    catch (error) {
        console.error("Get link error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getLinkById = getLinkById;
const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updates = req.body;
        const link = await link_model_1.default.findOneAndUpdate({ _id: id, userId }, updates, { new: true }).populate("domainId", "name");
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Link updated successfully",
            data: {
                link: {
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
                },
            },
        });
    }
    catch (error) {
        console.error("Update link error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updateLink = updateLink;
const deleteLink = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const link = await link_model_1.default.findOneAndDelete({ _id: id, userId });
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        res.json({
            success: true,
            message: "Link deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete link error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.deleteLink = deleteLink;
const getTags = async (req, res) => {
    try {
        const userId = req.user._id;
        const tags = await link_model_1.default.aggregate([
            { $match: { userId } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { name: "$_id", count: 1, _id: 0 } },
        ]);
        res.json({
            success: true,
            data: { tags },
        });
    }
    catch (error) {
        console.error("Get tags error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getTags = getTags;
//# sourceMappingURL=link.controller.js.map