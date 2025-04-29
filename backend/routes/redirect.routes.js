import express from "express"
import { handleRedirect } from "../controllers/redirect.controller.js"

const router = express.Router()

// Public route
router.get("/:slug", handleRedirect)

export default router
