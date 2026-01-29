import Message from "../models/Message.js";
import User from "../models/User.js";

// Get chat users based on role permissions
// Get chat users based on role permissions
export const getChatUsers = async (req, res) => {
    try {
        const { id, role, agencyId } = req.user;

        let query = { agencyId, _id: { $ne: id } }; // Same agency, not self

        if (role === "owner") {
            // Owner can see everyone (clients and members)
            query.role = { $in: ["member", "client"] };
        } else if (role === "member") {
            // Member can see Owner and other Members
            query.role = { $in: ["owner", "member"] };
        } else if (role === "client") {
            // Client can ONLY see Owner
            query.role = "owner";
        } else {
            return res.status(403).json({ message: "Invalid role" });
        }

        const users = await User.find(query).select("name email role");

        // Get unread counts for each user
        const usersWithUnread = await Promise.all(users.map(async (user) => {
            const unreadCount = await Message.countDocuments({
                sender: user._id,
                receiver: id,
                isRead: false
            });
            return { ...user.toObject(), unreadCount };
        }));

        res.status(200).json(usersWithUnread);
    } catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ... existing getMessages and sendMessage ...

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        const { senderId } = req.body;
        const myId = req.user.id;

        await Message.updateMany(
            { sender: senderId, receiver: myId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // The other user's ID
        const myId = req.user.id; // Using id from token

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Send a message (HTTP fallback or useful for other clients)
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;
        const agencyId = req.user.agencyId;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content,
            agencyId
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
