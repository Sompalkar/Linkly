"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_middleware_1 = __importDefault(require("./middleware/cors.middleware"));
const development_middleware_1 = __importDefault(require("./middleware/development.middleware"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const link_routes_1 = __importDefault(require("./routes/link.routes"));
const domain_routes_1 = __importDefault(require("./routes/domain.routes"));
const redirect_routes_1 = __importDefault(require("./routes/redirect.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors_middleware_1.default);
app.use(development_middleware_1.default);
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/links", link_routes_1.default);
app.use("/api/domains", domain_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/", redirect_routes_1.default);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map