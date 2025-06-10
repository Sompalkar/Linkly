import type { Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";
import Domain from "../models/domain.model";
import type { AuthRequest } from "../types";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string);
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists with this email" });
      return;
    }

    const user = await User.create({ name, email, password });

    await Domain.create({
      userId: user._id,
      name: process.env.DEFAULT_DOMAIN || "somn.in",
      isVerified: true,
      isDefault: true,
      verificationToken: crypto.randomBytes(16).toString("hex"),
    });

    const token = generateToken(user._id.toString());

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user._id.toString());

    // Set JWT as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    success: true,
    message: "Logout successful",
  });
};

