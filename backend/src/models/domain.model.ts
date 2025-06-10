import mongoose, { Schema } from "mongoose"
import type { IDomain } from "../types"

const domainSchema = new Schema<IDomain>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure only one default domain per user
domainSchema.pre("save", async function (next) {
  if (this.isDefault && this.isModified("isDefault")) {
    await mongoose.model("Domain").updateMany({ userId: this.userId, _id: { $ne: this._id } }, { isDefault: false })
  }
  next()
})

export default mongoose.model<IDomain>("Domain", domainSchema)
