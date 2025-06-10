"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = __importDefault(require("../models/user.model"));
const domain_model_1 = __importDefault(require("../models/domain.model"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET);
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }
        const user = await user_model_1.default.create({
            name,
            email,
            password,
        });
        const verificationToken = crypto_1.default.randomBytes(16).toString("hex");
        await domain_model_1.default.create({
            userId: user._id,
            name: process.env.DEFAULT_DOMAIN || "somn.in",
            isVerified: true,
            isDefault: true,
            verificationToken,
        });
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getMe = getMe;
const logout = async (req, res) => {
    res.json({
        success: true,
        message: "Logout successful",
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map