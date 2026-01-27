import express from "express";
import {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice
} from "../controllers/invoiceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner } from "../middleware/roleMiddleware.js";

const invoiceRouter = express.Router();

invoiceRouter.use(authMiddleware);

invoiceRouter.get("/", getInvoices);
invoiceRouter.get("/:id", getInvoiceById);
invoiceRouter.post("/", isOwner, createInvoice);
invoiceRouter.put("/:id/status", isOwner, updateInvoiceStatus);
invoiceRouter.delete("/:id", isOwner, deleteInvoice);

export default invoiceRouter;
