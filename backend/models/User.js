import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["owner", "member", "client"],
      default: "owner"
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency"
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Performance Indexes
userSchema.index({ agencyId: 1, role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
