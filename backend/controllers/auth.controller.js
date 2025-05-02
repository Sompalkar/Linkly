import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Domain from "../models/domain.model.js"
import crypto from "crypto"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    // console.log(req.body);

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString("hex")

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    })

    // Create default domain for the user (using the system's default domain)
    await Domain.create({
      userId: user._id,
      name: process.env.DEFAULT_DOMAIN || "http://localhost:3000",
      isVerified: true,
      verificationToken: "system-default",
      isDefault: true,
    })

    // Generate token
    const token = generateToken(user._id)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send response
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Generate token
    const token = generateToken(user._id)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send response
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Logout user
export const logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
}

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, { name }, { new: true }).select("-password")

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id)

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
