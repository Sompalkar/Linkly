import express from "express"
import {
  createDomain,
  getDomains,
  verifyDomain,
  deleteDomain,
  setDefaultDomain,
} from "../controllers/domain.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.post("/", createDomain)
router.get("/", getDomains)
router.post("/:id/verify", verifyDomain)
router.delete("/:id", deleteDomain)
router.put("/:id/default", setDefaultDomain)

export default router
