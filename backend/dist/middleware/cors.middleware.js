"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsMiddleware = (0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            process.env.FRONTEND_URL || "http://localhost:3000",
            "https://linkly-app.vercel.app",
            /\.vercel\.app$/,
            /localhost:\d+$/,
        ];
        const isAllowed = allowedOrigins.some((allowedOrigin) => {
            if (typeof allowedOrigin === "string") {
                return allowedOrigin === origin;
            }
            else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "X-Requested-With", "Authorization"],
    maxAge: 86400,
});
exports.default = corsMiddleware;
//# sourceMappingURL=cors.middleware.js.map