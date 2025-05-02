import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import corsMiddleware from "./middleware/cors.middleware.js"
import developmentMiddleware from "./middleware/development.middleware.js"
import mongoose from "mongoose"

// Route imports
import authRoutes from "./routes/auth.routes.js"
import linkRoutes from "./routes/link.routes.js"
import domainRoutes from "./routes/domain.routes.js"
import redirectRoutes from "./routes/redirect.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"

// Initialize
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/url-shortener")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Use the enhanced CORS middleware
app.use(corsMiddleware)

// Development middleware for localhost handling
app.use(developmentMiddleware)

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting to API routes
app.use("/api", apiLimiter)

// Middleware
app.use(express.json())
app.use(cookieParser())

// Debug middleware to log requests
app.use((req, res, next) => {
  // console.log(`${req.method} ${req.url}`)
  // console.log("Headers:", req.headers)
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/links", linkRoutes)
app.use("/api/domains", domainRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/", redirectRoutes) // Handle redirects

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
