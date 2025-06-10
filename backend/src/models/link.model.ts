import mongoose, { Schema } from "mongoose"
import type { ILink } from "../types"

const linkSchema = new Schema<ILink>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    domainId: {
      type: Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    clickCount: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String,
    },
    password: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for domain and slug uniqueness
linkSchema.index({ domainId: 1, slug: 1 }, { unique: true })

export default mongoose.model<ILink>("Link", linkSchema)
