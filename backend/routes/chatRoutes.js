import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getChatUsers, getMessages, sendMessage, markMessagesAsRead } from "../controllers/chatController.js";

const router = express.Router();

router.use(authMiddleware);

// Routes
router.get("/users", getChatUsers);
router.get("/:userId", getMessages);
router.post("/", sendMessage);
router.put("/read", markMessagesAsRead);

export default router;
