import express from "express"
import { handleRedirect, handleLocalRedirect } from "../controllers/redirect.controller.js"

const router = express.Router()

// Public route for redirects
router.get("/:slug", handleRedirect)

// Special route for development mode
router.get("/local-redirect/:slug", handleLocalRedirect)

export default router
