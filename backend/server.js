import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import corsMiddleware from "./middleware/cors.middleware.js"

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

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

// Use the enhanced CORS middleware
app.use(corsMiddleware)

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

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/links", linkRoutes)
app.use("/api/domains", domainRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/", redirectRoutes) // Handle redirects

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Database connection with retry logic
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB")
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err)
      console.log("Retrying connection in 5 seconds...")
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})

export default app
