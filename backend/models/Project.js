import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },
        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agency",
            required: true
        },
        status: {
            type: String,
            enum: ["planning", "active", "completed", "on-hold"],
            default: "planning"
        },
        budget: {
            type: Number,
            default: 0
        },
        deadline: {
            type: Date
        }
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
