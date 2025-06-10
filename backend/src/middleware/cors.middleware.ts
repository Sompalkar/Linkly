import cors from "cors"

// Configure CORS with more options for better cross-origin handling
const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://linkly-app.vercel.app",
      /\.vercel\.app$/,
      /localhost:\d+$/,
    ]

    // Check if the origin is allowed
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin)
      }
      return false
    })

    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error("CORS not allowed"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Requested-With", "Authorization"],
  maxAge: 86400, // 24 hours
})

export default corsMiddleware
