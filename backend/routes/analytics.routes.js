import express from "express"
import { getLinkAnalytics, getOverallAnalytics } from "../controllers/analytics.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.get("/links/:id", getLinkAnalytics)
router.get("/overall", getOverallAnalytics)

export default router
