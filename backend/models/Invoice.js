import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
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
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "USD"
        },
        status: {
            type: String,
            enum: ["pending", "paid", "overdue", "cancelled"],
            default: "pending"
        },
        dueDate: {
            type: Date,
            required: true
        },
        items: [
            {
                description: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true }
            }
        ],
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// Performance Indexes
invoiceSchema.index({ agencyId: 1, status: 1 });
invoiceSchema.index({ clientId: 1, status: 1 });
invoiceSchema.index({ agencyId: 1, createdAt: -1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
