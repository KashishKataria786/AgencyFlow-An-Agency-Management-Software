import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { Send, Search, User } from "lucide-react";
import { format } from "date-fns";

const Chat = () => {
    const { user } = useAuth();
    const { socket, setUnreadChatCount } = useSocket();

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [unreadContacts, setUnreadContacts] = useState({}); // { [userId]: count }

    const messagesEndRef = useRef(null);

    // Clear global unread count when chat is opened
    useEffect(() => {
        if (setUnreadChatCount) {
            setUnreadChatCount(0);
        }
    }, [setUnreadChatCount]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch Contacts and initial unread counts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/chat/users`, config);
                console.log("Fetched contacts:", data); // Debugging

                if (Array.isArray(data)) {
                    setContacts(data);

                    // Initialize unread map
                    const unreadMap = {};
                    data.forEach(c => {
                        if (c.unreadCount > 0) unreadMap[c._id] = c.unreadCount;
                    });
                    setUnreadContacts(unreadMap);
                } else {
                    console.error("API returned non-array data:", data);
                    setContacts([]);
                }

                setLoadingContacts(false);
            } catch (error) {
                console.error("Error fetching contacts", error);
                console.error("Error details:", error.response); // Debugging
                setContacts([]);
                setLoadingContacts(false);
            }
        };
        fetchContacts();
    }, []);

    // Fetch Messages when contact selected & Mark as Read
    useEffect(() => {
        if (!selectedContact) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // 1. Get Messages
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/chat/${selectedContact._id}`, config);
                setMessages(data);
                scrollToBottom();

                // 2. Mark as Read if we have unread
                if (unreadContacts[selectedContact._id]) {
                    await axios.put(`${import.meta.env.VITE_API_URL}/chat/read`, { senderId: selectedContact._id }, config);

                    // Clear local unread
                    setUnreadContacts(prev => {
                        const newMap = { ...prev };
                        delete newMap[selectedContact._id];
                        return newMap;
                    });
                }
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };
        fetchMessages();
    }, [selectedContact]);

    // Socket Listener for incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            // Determine sender ID (could be populated object or string)
            const senderId = message.sender._id || message.sender;

            // If chat is open with this person
            if (selectedContact && senderId === selectedContact._id) {
                setMessages((prev) => [...prev, message]);
                // Optionally mark as read immediately if window is focused, but easiest is just to let the user see it.
                // Ideally we'd ping the backend "read" again or just leave it since we are "watching".
                // For now, let's assume if it arrives while open, it's effectively read or will be read.
            } else {
                // Chat not open with this person -> Increment unread
                setUnreadContacts(prev => ({
                    ...prev,
                    [senderId]: (prev[senderId] || 0) + 1
                }));
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, selectedContact]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const messageData = {
            receiverId: selectedContact._id,
            content: newMessage
        };

        // Emit via socket
        socket.emit("send_message", messageData);

        // Optimistically update UI
        const optimisticMessage = {
            _id: Date.now().toString(), // Temp ID
            sender: user.id,
            receiver: selectedContact._id,
            content: newMessage,
            createdAt: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar / Contact List */}
            <div className="w-1/3 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingContacts ? (
                        <div className="p-4 text-center text-slate-500">Loading contacts...</div>
                    ) : contacts.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No contacts found</div>
                    ) : (
                        contacts.map((contact) => (
                            <div
                                key={contact._id}
                                onClick={() => setSelectedContact(contact)}
                                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-slate-50 transition-colors ${selectedContact?._id === contact._id ? 'bg-primary-light border-r-2 border-primary' : ''}`}
                            >
                                <div className="relative w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold shrink-0">
                                    {contact.name.charAt(0)}
                                    {/* Unread Dot */}
                                    {unreadContacts[contact._id] > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex justify-between items-center">
                                    <div className="min-w-0">
                                        <h3 className={`font-medium truncate ${unreadContacts[contact._id] ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>{contact.name}</h3>
                                        <p className="text-xs text-slate-500 capitalize">{contact.role}</p>
                                    </div>
                                    {unreadContacts[contact._id] > 0 && (
                                        <div className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                            {unreadContacts[contact._id]}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50">
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-slate-200 flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                                {selectedContact.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-800">{selectedContact.name}</h2>
                                <p className="text-xs text-primary flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-primary mr-1.5 inline-block"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => {
                                const isMyMessage = msg.sender === user.id || msg.sender?._id === user.id; // Handle populated or unpopulated sender
                                return (
                                    <div key={msg._id || index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMyMessage
                                                ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/10'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${isMyMessage ? 'text-primary-hover' : 'text-slate-400'}`}>
                                                {msg.createdAt && msg.createdAt !== new Date().toISOString()
                                                    ? format(new Date(msg.createdAt), 'p')
                                                    : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <User size={32} />
                        </div>
                        <p className="font-medium">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
