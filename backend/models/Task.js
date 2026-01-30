import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        status: {
            type: String,
            enum: ["todo", "in-progress", "review", "done"],
            default: "todo"
        },
        dueDate: {
            type: Date
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        comments: [
            {
                author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                content: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

// Performance Indexes
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
