"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDomain = exports.setDefaultDomain = exports.verifyDomain = exports.getDomains = exports.createDomain = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dns_1 = __importDefault(require("dns"));
const util_1 = require("util");
const domain_model_1 = __importDefault(require("../models/domain.model"));
const resolveTxt = (0, util_1.promisify)(dns_1.default.resolveTxt);
const createDomain = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;
        const existingDomain = await domain_model_1.default.findOne({ name });
        if (existingDomain) {
            res.status(400).json({
                success: false,
                message: "Domain already exists",
            });
            return;
        }
        const verificationToken = crypto_1.default.randomBytes(16).toString("hex");
        const domain = await domain_model_1.default.create({
            userId,
            name,
            verificationToken,
        });
        res.status(201).json({
            success: true,
            message: "Domain created successfully",
            data: {
                domain: {
                    id: domain._id,
                    name: domain.name,
                    isVerified: domain.isVerified,
                    verificationToken: domain.verificationToken,
                    isDefault: domain.isDefault,
                    createdAt: domain.createdAt,
                },
            },
        });
    }
    catch (error) {
        console.error("Create domain error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.createDomain = createDomain;
const getDomains = async (req, res) => {
    try {
        const userId = req.user._id;
        const domains = await domain_model_1.default.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        res.json({
            success: true,
            data: {
                domains: domains.map((domain) => ({
                    id: domain._id,
                    name: domain.name,
                    isVerified: domain.isVerified,
                    verificationToken: domain.verificationToken,
                    isDefault: domain.isDefault,
                    createdAt: domain.createdAt,
                })),
            },
        });
    }
    catch (error) {
        console.error("Get domains error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getDomains = getDomains;
const verifyDomain = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const domain = await domain_model_1.default.findOne({ _id: id, userId });
        if (!domain) {
            res.status(404).json({
                success: false,
                message: "Domain not found",
            });
            return;
        }
        if (domain.isVerified) {
            res.status(400).json({
                success: false,
                message: "Domain is already verified",
            });
            return;
        }
        try {
            const records = await resolveTxt(domain.name);
            const flatRecords = records.flat();
            const expectedRecord = `shortener-verify=${domain.verificationToken}`;
            if (flatRecords.includes(expectedRecord)) {
                domain.isVerified = true;
                await domain.save();
                res.json({
                    success: true,
                    message: "Domain verified successfully",
                    data: {
                        domain: {
                            id: domain._id,
                            name: domain.name,
                            isVerified: domain.isVerified,
                            isDefault: domain.isDefault,
                        },
                    },
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Verification record not found. Please add the TXT record and try again.",
                });
            }
        }
        catch (dnsError) {
            res.status(400).json({
                success: false,
                message: "Unable to verify domain. Please check your DNS settings.",
            });
        }
    }
    catch (error) {
        console.error("Verify domain error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.verifyDomain = verifyDomain;
const setDefaultDomain = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const domain = await domain_model_1.default.findOne({ _id: id, userId });
        if (!domain) {
            res.status(404).json({
                success: false,
                message: "Domain not found",
            });
            return;
        }
        if (!domain.isVerified) {
            res.status(400).json({
                success: false,
                message: "Domain must be verified before setting as default",
            });
            return;
        }
        await domain_model_1.default.updateMany({ userId }, { isDefault: false });
        domain.isDefault = true;
        await domain.save();
        res.json({
            success: true,
            message: "Default domain updated successfully",
            data: {
                domain: {
                    id: domain._id,
                    name: domain.name,
                    isVerified: domain.isVerified,
                    isDefault: domain.isDefault,
                },
            },
        });
    }
    catch (error) {
        console.error("Set default domain error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.setDefaultDomain = setDefaultDomain;
const deleteDomain = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const domain = await domain_model_1.default.findOne({ _id: id, userId });
        if (!domain) {
            res.status(404).json({
                success: false,
                message: "Domain not found",
            });
            return;
        }
        if (domain.isDefault) {
            res.status(400).json({
                success: false,
                message: "Cannot delete default domain",
            });
            return;
        }
        await domain_model_1.default.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Domain deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete domain error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.deleteDomain = deleteDomain;
//# sourceMappingURL=domain.controller.js.map