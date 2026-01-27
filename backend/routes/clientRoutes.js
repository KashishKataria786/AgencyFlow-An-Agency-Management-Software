import express from "express";
import { getClients, createClient, updateClient, deleteClient } from "../controllers/clientController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner } from "../middleware/roleMiddleware.js";

const clientRouter = express.Router();

clientRouter.use(authMiddleware);

clientRouter.get("/", isOwner, getClients);
clientRouter.post("/", isOwner, createClient);
clientRouter.put("/:id", isOwner, updateClient);
clientRouter.delete("/:id", isOwner, deleteClient);

export default clientRouter;
