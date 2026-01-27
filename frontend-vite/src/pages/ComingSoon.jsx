import React from "react";
import { useNavigate } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ComingSoon = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white rounded-sm border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

            <div className="w-20 h-20 bg-emerald-50 rounded-sm flex items-center justify-center text-emerald-500 mb-6 animate-pulse">
                <Construction size={40} />
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic mb-2">Build in Progress</h1>
            <p className="text-slate-500 font-semibold tracking-tighter max-w-md mb-8">
                We're currently architecting this module to meet our premium engineering standards. Check back soon for the full experience.
            </p>

            <button
                onClick={() => navigate(`/${user?.role || 'owner'}/dashboard`)}
                className="flex items-center space-x-3 bg-slate-900 text-white px-6 py-3 rounded-sm font-black uppercase italic tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                <ArrowLeft size={18} />
                <span>Back to Portal</span>
            </button>

            <div className="mt-12 flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-emerald-100 rounded-sm"></div>
            </div>
        </div>
    );
};

export default ComingSoon;
