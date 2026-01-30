import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        company: {
            type: String,
            trim: true
        },
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agency",
            required: true
        },
        status: {
            type: String,
            enum: ["Lead", "Active", "Past"],
            default: "Lead"
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// Performance Indexes
clientSchema.index({ agencyId: 1, status: 1 });
clientSchema.index({ email: 1 });

const Client = mongoose.model("Client", clientSchema);
export default Client;
