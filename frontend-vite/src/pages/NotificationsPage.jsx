import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { Bell, Check, Trash2, Calendar, FileText, CheckSquare, Briefcase } from "lucide-react";

const NotificationsPage = () => {
    const { notifications, setNotifications, setUnreadCount } = useSocket();

    const markAsRead = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`);
            const updatedNotifications = notifications.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            );
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter((n) => !n.isRead).length);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/notifications/read-all`);
            const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }));
            setNotifications(updatedNotifications);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "task_assigned":
            case "task_updated":
                return <CheckSquare className="text-blue-500" size={20} />;
            case "project_updated":
                return <Briefcase className="text-purple-500" size={20} />;
            case "invoice_generated":
            case "invoice_paid":
                return <FileText className="text-green-500" size={20} />;
            default:
                return <Bell className="text-gray-500" size={20} />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500">Stay updated with your latest activities</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center space-x-2 text-sm text-primary hover:text-primary-hover font-medium bg-primary-light px-3 py-2 rounded-md transition-colors"
                    >
                        <Check size={16} />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Bell size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No notifications yet</h3>
                        <p className="text-slate-500 mt-1">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`relative flex items-start p-4 rounded-lg border transition-all ${notification.isRead
                                ? "bg-white border-slate-200"
                                : "bg-primary-light/50 border-primary/20 shadow-sm"
                                }`}
                        >
                            <div className={`p-2 rounded-full mr-4 ${notification.isRead ? "bg-slate-100" : "bg-white shadow-sm"}`}>
                                {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-semibold ${notification.isRead ? "text-slate-700" : "text-slate-900"}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2 flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                                <p className={`text-sm ${notification.isRead ? "text-slate-500" : "text-slate-700"} mb-2`}>
                                    {notification.message}
                                </p>

                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="text-xs font-medium text-primary hover:text-primary-hover flex items-center"
                                    >
                                        <Check size={12} className="mr-1" />
                                        Mark as read
                                    </button>
                                )}
                            </div>

                            {!notification.isRead && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
