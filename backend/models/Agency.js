import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        settings: {
            currency: { type: String, default: "USD" },
            logo: { type: String },
            brandColor: { type: String, default: "#000000" }
        }
    },
    { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);
export default Agency;
