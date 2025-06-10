import mongoose, { Schema } from "mongoose"
import type { IClick } from "../types"

const clickSchema = new Schema<IClick>(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    referer: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
)

// Index for efficient queries
clickSchema.index({ linkId: 1, timestamp: -1 })

export default mongoose.model<IClick>("Click", clickSchema)
