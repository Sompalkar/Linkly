import mongoose from "mongoose"

const clickSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: String,
    os: String,
    country: String,
    city: String,
    region: String,
  },
  { timestamps: true },
)

// Index for faster analytics queries
clickSchema.index({ linkId: 1, timestamp: 1 })

const Click = mongoose.model("Click", clickSchema)

export default Click
