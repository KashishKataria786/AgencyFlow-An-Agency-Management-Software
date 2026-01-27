import Invoice from "../models/Invoice.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { createNotification, broadcastNotification } from "../config/notificationUtils.js";

export const getInvoices = async (req, res) => {
    try {
        const filter = { agencyId: req.user.agencyId };

        if (req.user.role === "client") {
            console.log(`[Diagnostic] Invoices fetch for client: ${req.user.id}, clientId: ${req.user.clientId}`);
            filter.clientId = req.user.clientId;
        }
        console.log(`[Diagnostic] Invoice filter applied:`, filter);

        const invoices = await Invoice.find(filter)
            .populate("projectId", "name")
            .populate("clientId", "name company email")
            .sort({ createdAt: -1 });

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            agencyId: req.user.agencyId
        })
            .populate("projectId", "name description")
            .populate("clientId", "name company email")
            .populate("agencyId", "name email");

        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        // Ensure client can only see their own invoices
        if (req.user.role === "client" && invoice.clientId._id.toString() !== req.user.clientId?.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createInvoice = async (req, res) => {
    try {
        const { projectId, amount, items, dueDate, notes } = req.body;

        const project = await Project.findById(projectId);
        if (!project || project.agencyId.toString() !== req.user.agencyId.toString()) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

        const newInvoice = await Invoice.create({
            invoiceNumber,
            projectId,
            clientId: project.clientId,
            agencyId: req.user.agencyId,
            amount,
            items,
            dueDate,
            notes
        });

        // Notify client user(s)
        const clientUsers = await User.find({ clientId: project.clientId, role: "client" });
        for (const user of clientUsers) {
            await createNotification({
                recipient: user._id,
                sender: req.user.id,
                type: "invoice_generated",
                title: "New Invoice Generated",
                message: `A new invoice ${invoiceNumber} has been generated for project ${project.name}.`,
                relatedEntity: { entityType: "Invoice", entityId: newInvoice._id }
            });
        }

        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            { status },
            { new: true }
        );

        if (!invoice) return res.status(404).json({ message: "Invoice not found" });

        // Notify client of status change
        const clientUsers = await User.find({ clientId: invoice.clientId, role: "client" });
        for (const user of clientUsers) {
            await createNotification({
                recipient: user._id,
                sender: req.user.id,
                type: "invoice_paid", // Adjust depending on status
                title: "Invoice Status Updated",
                message: `Your invoice ${invoice.invoiceNumber} status has been updated to ${status}.`,
                relatedEntity: { entityType: "Invoice", entityId: invoice._id }
            });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user.agencyId
        });

        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
