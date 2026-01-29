import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AgencyContext = createContext();

export const AgencyProvider = ({ children }) => {
    const { user } = useAuth();
    const [agency, setAgency] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAgencySettings = async () => {
        if (!user || !user.agencyId) {
            setLoading(false);
            return;
        }
        try {
            console.log("Fetching agency settings from:", `${import.meta.env.VITE_API_URL}/agency`);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/agency`);
            console.log("Agency settings received:", data);
            setAgency(data);
            applyBranding(data.settings);
        } catch (error) {
            console.error("Error fetching agency settings:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    const applyBranding = (settings) => {
        if (!settings) return;
        const root = document.documentElement;
        if (settings.brandColor) {
            root.style.setProperty('--primary', settings.brandColor);
            // Generate a slightly darker/lighter version or secondary if needed
            // For now, let's just stick to what the user provides
            root.style.setProperty('--primary-hover', settings.brandColor + 'EE');
        }
        if (settings.secondaryColor) {
            root.style.setProperty('--secondary', settings.secondaryColor);
        }
        // Update favicon dynamically
        if (settings.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.favicon;
        }
    };

    useEffect(() => {
        fetchAgencySettings();
    }, [user]);

    const updateAgency = async (formData) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/agency`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAgency(data);
            applyBranding(data.settings);
            return { success: true };
        } catch (error) {
            console.error("Error updating agency settings:", error);
            return { success: false, message: error.response?.data?.message || "Update failed" };
        }
    };

    return (
        <AgencyContext.Provider value={{ agency, loading, updateAgency, fetchAgencySettings }}>
            {children}
        </AgencyContext.Provider>
    );
};

export const useAgency = () => useContext(AgencyContext);
