import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    CheckCircle2,
    Clock,
    List,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    Target,
    BarChart3,
    Calendar
} from "lucide-react";

const MemberDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const [tRes, pRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/tasks`),
                axios.get(`${import.meta.env.VITE_API_URL}/projects`)
            ]);
            setTasks(tRes.data);
            setProjects(pRes.data);
            setLoading(false);
        } catch (err) {
            setError("Synchronization failed");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = [
        { label: "Assigned Workload", value: tasks.filter(t => t.status !== 'done').length, icon: <List size={20} className="text-emerald-500" /> },
        { label: "Commitments Due", value: tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()).length, icon: <Clock size={20} className="text-rose-500" /> },
        { label: "Completed Units", value: tasks.filter(t => t.status === 'done').length, icon: <CheckCircle2 size={20} className="text-emerald-500" /> },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Operational Intel</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Your specialized task board and performance metrics.</p>
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BarChart3 size={40} className="text-slate-900" />
                        </div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="text-emerald-500">{stat.icon}</div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                        </div>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Task Queue */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">In-Flight Deliverables</h2>
                        <Link to="/member/tasks" className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center">
                            View Full Queue <ChevronRight size={12} className="ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 italic text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Task Spec</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Hard Date</th>
                                        <th className="px-6 py-4 text-right">Commit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan="4" className="py-20 text-center font-bold italic text-slate-400">Syncing...</td></tr>
                                    ) : tasks.filter(t => t.status !== 'done').length === 0 ? (
                                        <tr><td colSpan="4" className="py-20 text-center font-bold italic text-slate-400 uppercase text-[10px]">No assigned objectives discovered.</td></tr>
                                    ) : tasks.filter(t => t.status !== 'done').slice(0, 5).map((task) => (
                                        <tr key={task._id} className="hover:bg-slate-50 transition-all group">
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-emerald-600 transition-colors">{task.title}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Target size={10} className="text-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                        {projects.find(p => p._id === (task.projectId?._id || task.projectId))?.name || 'External'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`status-badge text-[8px] ${task.status === 'in-progress' ? 'badge-orange' :
                                                        task.status === 'review' ? 'badge-blue' : 'badge-green'}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-black text-slate-400 tabular-nums uppercase italic">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/member/projects/${task.projectId?._id || task.projectId}`} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors inline-block">
                                                    <ExternalLink size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Tactical Context */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest italic px-2 text-center">Engagement Scope</h2>
                    <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 divide-y divide-slate-50">
                        {loading ? (
                            <div className="py-20 text-center text-slate-400 font-bold italic">Scanning...</div>
                        ) : projects.slice(0, 5).map(project => (
                            <div key={project._id} className="py-4 first:pt-0 last:pb-0 group">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{project.clientId?.company || 'Internal'}</p>
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{project.status}</span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase italic group-hover:text-emerald-600 transition-colors mb-4">{project.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboard;
