import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { signOut } = useClerk();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const clerkSync = async (clerkUser) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/clerk-sync`, {
                clerkId: clerkUser.id,
                email: clerkUser.primaryEmailAddress.emailAddress,
                name: clerkUser.fullName || clerkUser.username || "Clerk User"
            });
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            return { success: true, user: data.user };
        } catch (error) {
            console.error("Clerk sync failed:", error);
            return { success: false, message: error.response?.data?.message || "Clerk sync failed" };
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            return { success: true, role: data.user.role };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (userData) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error("Clerk sign out error:", err);
        }
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, clerkSync }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
