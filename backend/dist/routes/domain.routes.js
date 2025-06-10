"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const domain_controller_1 = require("../controllers/domain.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
router.post("/", domain_controller_1.createDomain);
router.get("/", domain_controller_1.getDomains);
router.post("/:id/verify", domain_controller_1.verifyDomain);
router.delete("/:id", domain_controller_1.deleteDomain);
router.put("/:id/default", domain_controller_1.setDefaultDomain);
exports.default = router;
//# sourceMappingURL=domain.routes.js.map