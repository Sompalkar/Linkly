import express from "express"
import { getOverallAnalytics, getLinkAnalytics } from "../controllers/analytics.controller"
import { protect } from "../middleware/auth.middleware"

const router = express.Router()

router.use(protect)

router.route("/overall").get(getOverallAnalytics)
router.route("/links/:id").get(getLinkAnalytics)

export default router
