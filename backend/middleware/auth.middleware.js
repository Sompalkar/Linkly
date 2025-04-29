import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protect = async (req, res, next) => {
  let token

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from token
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }
}

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized as an admin",
    })
  }
}
