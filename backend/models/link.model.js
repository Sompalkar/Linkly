import mongoose from "mongoose"
import shortid from "shortid"

const linkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default: () => shortid.generate(),
    },
    title: {
      type: String,
      default: "",
    },
    password: String,
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Compound index for faster lookups
linkSchema.index({ domainId: 1, slug: 1 }, { unique: true })

const Link = mongoose.model("Link", linkSchema)

export default Link
