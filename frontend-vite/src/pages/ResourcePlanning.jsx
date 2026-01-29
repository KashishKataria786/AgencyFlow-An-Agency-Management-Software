import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, TrendingUp, AlertCircle, Calendar, Loader2 } from "lucide-react";

const ResourcePlanning = () => {
    const [capacityData, setCapacityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCapacityData();
    }, []);

    const fetchCapacityData = async () => {
        try {
            console.log("Fetching capacity data from:", `${import.meta.env.VITE_API_URL}/tasks/capacity`);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/capacity`);
            console.log("Capacity data received:", data);
            console.log("Number of team members:", data.length);
            setCapacityData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching capacity data:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);
            setError(err.response?.data?.message || "Failed to load capacity data");
            setLoading(false);
        }
    };

    const getCapacityColor = (percentage) => {
        if (percentage >= 80) return "bg-red-500";
        if (percentage >= 60) return "bg-amber-500";
        return "bg-primary";
    };

    const getCapacityStatus = (percentage) => {
        if (percentage >= 80) return "Overloaded";
        if (percentage >= 60) return "Busy";
        if (percentage >= 40) return "Moderate";
        return "Available";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Resource Capacity</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Monitor team workload and optimize task distribution.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-sm">
                    <Users size={18} className="text-slate-400" />
                    <span className="text-sm font-black text-slate-900">{capacityData.length} Team Members</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Capacity Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capacityData.map((member) => (
                    <div key={member.user._id} className="bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <div className="p-6 space-y-4">
                            {/* Member Header */}
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary-light text-primary rounded-sm flex items-center justify-center font-black text-sm uppercase shrink-0">
                                    {member.user.name.substring(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-slate-900 uppercase italic truncate">{member.user.name}</h3>
                                    <p className="text-xs text-slate-500 truncate">{member.user.email}</p>
                                </div>
                            </div>

                            {/* Capacity Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                                    <span className={`text-xs font-black ${member.capacityPercentage >= 80 ? 'text-red-600' : member.capacityPercentage >= 60 ? 'text-amber-600' : 'text-primary'}`}>
                                        {Math.round(member.capacityPercentage)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full ${getCapacityColor(member.capacityPercentage)} transition-all duration-500`}
                                        style={{ width: `${member.capacityPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                    {getCapacityStatus(member.capacityPercentage)}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="text-lg font-black text-slate-900">{member.activeTasks}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-primary">{member.completedTasks}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Done</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-red-600">{member.highPriorityTasks}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">High</p>
                                </div>
                            </div>

                            {/* Upcoming Deadlines */}
                            {member.upcomingDeadlines.length > 0 && (
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next 14 Days</span>
                                    </div>
                                    <div className="space-y-1.5 max-h-24 overflow-y-auto">
                                        {member.upcomingDeadlines.slice(0, 3).map((deadline, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-sm">
                                                <span className="font-bold text-slate-700 truncate flex-1">{deadline.title}</span>
                                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm ${deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    deadline.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {new Date(deadline.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {capacityData.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-sm border border-slate-200">
                    <Users size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-black text-slate-900 uppercase italic">No Team Data</h3>
                    <p className="text-slate-500 mt-2">Assign tasks to team members to see capacity metrics.</p>
                </div>
            )}
        </div>
    );
};

export default ResourcePlanning;
