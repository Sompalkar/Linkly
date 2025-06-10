"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkPreview = exports.handleRedirect = void 0;
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const link_model_1 = __importDefault(require("../models/link.model"));
const domain_model_1 = __importDefault(require("../models/domain.model"));
const click_model_1 = __importDefault(require("../models/click.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getClientIP = (req) => {
    return (req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        "unknown");
};
const getLocationData = async (ip) => {
    return {
        country: "Unknown",
        city: "Unknown",
        region: "Unknown",
    };
};
const handleRedirect = async (req, res) => {
    try {
        const { slug } = req.params;
        const host = req.get("host") || "localhost:5000";
        const password = req.query.password;
        let domain = await domain_model_1.default.findOne({ name: host });
        if (!domain && (host.includes("localhost") || host.includes("127.0.0.1"))) {
            domain = await domain_model_1.default.findOne({ name: process.env.DEFAULT_DOMAIN || "somn.in" });
        }
        if (!domain) {
            res.status(404).json({
                success: false,
                message: "Domain not found",
            });
            return;
        }
        const link = await link_model_1.default.findOne({
            domainId: domain._id,
            slug,
            isActive: true,
        });
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        if (link.expiresAt && new Date() > link.expiresAt) {
            res.status(410).json({
                success: false,
                message: "Link has expired",
            });
            return;
        }
        if (link.password) {
            if (!password) {
                res.status(401).json({
                    success: false,
                    message: "Password required",
                    requiresPassword: true,
                });
                return;
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, link.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    message: "Invalid password",
                    requiresPassword: true,
                });
                return;
            }
        }
        const parser = new ua_parser_js_1.default(req.headers["user-agent"]);
        const result = parser.getResult();
        const clientIP = getClientIP(req);
        const locationData = await getLocationData(clientIP);
        await click_model_1.default.create({
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
        });
        await link_model_1.default.findByIdAndUpdate(link._id, {
            $inc: { clickCount: 1 },
        });
        res.redirect(301, link.originalUrl);
    }
    catch (error) {
        console.error("Redirect error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.handleRedirect = handleRedirect;
const getLinkPreview = async (req, res) => {
    try {
        const { slug } = req.params;
        const host = req.get("host") || "localhost:5000";
        let domain = await domain_model_1.default.findOne({ name: host });
        if (!domain && (host.includes("localhost") || host.includes("127.0.0.1"))) {
            domain = await domain_model_1.default.findOne({ name: process.env.DEFAULT_DOMAIN || "somn.in" });
        }
        if (!domain) {
            res.status(404).json({
                success: false,
                message: "Domain not found",
            });
            return;
        }
        const link = await link_model_1.default.findOne({
            domainId: domain._id,
            slug,
            isActive: true,
        });
        if (!link) {
            res.status(404).json({
                success: false,
                message: "Link not found",
            });
            return;
        }
        if (link.expiresAt && new Date() > link.expiresAt) {
            res.status(410).json({
                success: false,
                message: "Link has expired",
            });
            return;
        }
        res.status(200).json({
            success: true,
            link: {
                title: link.title,
                description: link.description,
                requiresPassword: !!link.password,
                expiresAt: link.expiresAt,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getLinkPreview = getLinkPreview;
//# sourceMappingURL=redirect.controller.js.map