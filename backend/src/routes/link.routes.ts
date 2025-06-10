import express from "express"
import {
  createLink,
  createBulkLinks,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  getTags,
} from "../controllers/link.controller"
import { protect } from "../middleware/auth.middleware"

const router = express.Router()

router.use(protect)

router.route("/").get(getLinks).post(createLink)
router.route("/bulk").post(createBulkLinks)
router.route("/tags").get(getTags)
router.route("/:id").get(getLinkById).put(updateLink).delete(deleteLink)

export default router
