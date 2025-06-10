"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const link_controller_1 = require("../controllers/link.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.route("/").get(link_controller_1.getLinks).post(link_controller_1.createLink);
router.route("/bulk").post(link_controller_1.createBulkLinks);
router.route("/tags").get(link_controller_1.getTags);
router.route("/:id").get(link_controller_1.getLinkById).put(link_controller_1.updateLink).delete(link_controller_1.deleteLink);
exports.default = router;
//# sourceMappingURL=link.routes.js.map