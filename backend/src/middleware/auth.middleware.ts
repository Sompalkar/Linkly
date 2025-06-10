import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import type { AuthRequest } from "../types";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   if (req.user && req.user.role === "admin") {
//     next()
//   } else {
//     res.status(403).json({
//       success: false,
//       message: "Not authorized as an admin",
//     })
//   }
// }
