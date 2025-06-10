import express from "express"
import { handleRedirect,   } from "../controllers/redirect.controller"

const router = express.Router()

// Public route for redirects
router.get("/:slug", handleRedirect)

// Special route for development mode
router.get("/local-redirect/:slug",  )

export default router
