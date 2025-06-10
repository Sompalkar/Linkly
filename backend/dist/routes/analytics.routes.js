"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route("/overall").get(analytics_controller_1.getOverallAnalytics);
router.route("/links/:id").get(analytics_controller_1.getLinkAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map