import type { Request } from "express";
import type { Document, Types } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IDomain extends Document {
    userId: Types.ObjectId;
    name: string;
    isVerified: boolean;
    verificationToken: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILink extends Document {
    userId: Types.ObjectId;
    originalUrl: string;
    slug: string;
    domainId: Types.ObjectId;
    title?: string;
    description?: string;
    tags: string[];
    clickCount: number;
    qrCode?: string;
    password?: string;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IClick extends Document {
    linkId: Types.ObjectId;
    ipAddress: string;
    userAgent: string;
    referer?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
    timestamp: Date;
}
export interface AuthRequest extends Request {
    user?: IUser;
    originalHostname?: string;
    isLocalShortLink?: boolean;
    shortLinkSlug?: string;
    shortLinkDomain?: string;
}
export interface PaginationResult {
    page: number;
    pages: number;
    total: number;
    limit: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: PaginationResult;
}
//# sourceMappingURL=index.d.ts.map