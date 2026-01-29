import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import axios from 'axios'

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            const newSocket = io(`${import.meta.env.VITE_SOCKET}`, {
                auth: { token },
            });

            setSocket(newSocket);

            // Fetch initial notifications
            const fetchNotifications = async () => {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`);
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.isRead).length);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };
            fetchNotifications();

            newSocket.on("notification", (notification) => {
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);
                toast.info(notification.message || "New notification received", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });

            // Chat Message Listener
            newSocket.on("receive_message", (message) => {
                // If not currently on the chat page or specific chat (simplified for now as global)
                // We could rely on URL check but context doesn't know router easily without hooks outside.
                // For now, simply increment global unread.
                // Note: If user IS on Chat page, Chat.jsx receives this too. 
                // We might want to clear this if the user is active, but for "Real time notification" requirement: always notify.

                setUnreadChatCount((prev) => prev + 1);

                const senderName = message.sender?.name || "Someone";
                toast.info(`New message from ${senderName}`, {
                    position: "bottom-right", // Different position to distinguish
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "💬"
                });
            });

            return () => {
                newSocket.disconnect();
            };
        } else {
            setSocket(null);
            setNotifications([]);
            setUnreadCount(0);
            setUnreadChatCount(0);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, notifications, setNotifications, unreadCount, setUnreadCount, unreadChatCount, setUnreadChatCount }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
