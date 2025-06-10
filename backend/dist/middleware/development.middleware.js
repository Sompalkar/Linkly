"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const developmentMiddleware = (req, res, next) => {
    req.originalHostname = req.hostname;
    if (process.env.NODE_ENV === "development" &&
        (req.hostname === "localhost" || req.hostname === "127.0.0.1")) {
        if (req.path.startsWith("/api")) {
            return next();
        }
        const slug = req.path.substring(1);
        if (!slug ||
            slug.includes("/") ||
            slug === "health" ||
            slug === "favicon.ico") {
            return next();
        }
        req.isLocalShortLink = true;
        req.shortLinkSlug = slug;
        if (process.env.DEFAULT_DOMAIN) {
            req.shortLinkDomain = process.env.DEFAULT_DOMAIN;
        }
    }
    next();
};
exports.default = developmentMiddleware;
//# sourceMappingURL=development.middleware.js.map