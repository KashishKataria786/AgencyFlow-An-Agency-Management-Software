import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAgency } from "../context/AgencyContext";
import axios from "axios";
import { Briefcase, ArrowRight, AlertCircle, Building2 } from "lucide-react";

const AgencySetupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        website: "",
        brandColor: "#10b981"
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, setUser } = useAuth();
    const { fetchAgencySettings } = useAgency();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/agency/setup`, {
                name: formData.name,
                website: formData.website,
                brandColor: formData.brandColor,
                email: user.email,
                userName: user.name
            });

            const updatedUser = { ...user, agencyId: data.agencyId, role: 'owner' };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            await fetchAgencySettings();

            navigate("/owner/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to setup agency");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-sm flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-200">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic text-center">Setup Your Agency</h1>
                    <p className="text-slate-500 font-semibold tracking-tighter text-sm text-center mt-2">
                        Welcome! Let's get your workspace ready.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-xl shadow-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agency Name</label>
                                <div className="relative group">
                                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-300 text-sm"
                                        placeholder="Acme Creative Agency"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website (Optional)</label>
                                <div className="relative group">
                                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-slate-700 placeholder:text-slate-300 text-sm"
                                        placeholder="https://acme.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Primary Color</label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="color"
                                    name="brandColor"
                                    value={formData.brandColor}
                                    onChange={handleChange}
                                    className="w-12 h-12 rounded-sm border-0 cursor-pointer p-0 bg-transparent"
                                />
                                <span className="text-sm font-bold text-slate-600 uppercase font-mono">{formData.brandColor}</span>
                                <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: formData.brandColor }}></div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-sm shadow-lg shadow-emerald-200 flex items-center justify-center space-x-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 uppercase italic tracking-widest"
                        >
                            {isSubmitting ? "Setting Up..." : (
                                <>
                                    <span>Launch Workspace</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgencySetupPage;
