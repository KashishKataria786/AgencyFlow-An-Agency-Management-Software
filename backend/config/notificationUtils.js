import Notification from "../models/Notification.js";
import { io } from "../server.js";

/**
 * Create and emit a notification
 * @param {Object} data - Notification data
 * @param {string} data.recipient - User ID of the recipient
 * @param {string} data.sender - User ID of the sender
 * @param {string} data.type - Type of notification
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {Object} data.relatedEntity - Optional related entity info { entityType, entityId }
 */
export const createNotification = async ({ recipient, sender, type, title, message, relatedEntity }) => {
    try {
        const notification = await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            relatedEntity,
        });

        // Emit to recipient's private room
        io.to(`user_${recipient}`).emit("notification", notification);

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

/**
 * Broadcast a notification to a specific room (agency or client)
 * @param {string} room - Room name (e.g., agency_ID or client_ID)
 * @param {Object} data - Notification data (same as above but recipient is not required for broadcast logic, though we might want to store multiple)
 */
export const broadcastNotification = async (room, { sender, type, title, message, relatedEntity }) => {
    try {
        // For broadcast, we might not want to save a single notification object unless we have a different schema for "Global Notification"
        // But for now, we'll just emit it to the room.
        io.to(room).emit("notification", {
            sender,
            type,
            title,
            message,
            relatedEntity,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error broadcasting notification:", error);
    }
}
