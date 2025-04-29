import express from "express"
import { createLink, getLinks, getLinkById, updateLink, deleteLink } from "../controllers/link.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.post("/", createLink)
router.get("/", getLinks)
router.get("/:id", getLinkById)
router.put("/:id", updateLink)
router.delete("/:id", deleteLink)

export default router
