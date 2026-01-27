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

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem("token");
            const newSocket = io("http://localhost:5000", {
                auth: { token },
            });

            setSocket(newSocket);

            // Fetch initial notifications
            const fetchNotifications = async () => {
                try {
                    const { data } = await axios.get("http://localhost:5000/api/notifications");
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

            return () => {
                newSocket.disconnect();
            };
        } else {
            setSocket(null);
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, notifications, setNotifications, unreadCount, setUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
