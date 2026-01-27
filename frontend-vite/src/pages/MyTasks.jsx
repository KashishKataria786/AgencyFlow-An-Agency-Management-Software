import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    CheckCircle2,
    Clock,
    List,
    Search,
    MessageSquare,
    ExternalLink,
    Target,
    ChevronRight,
    Filter,
    X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MyTasks = () => {
    const { user } = useAuth();
    const role = user?.role;
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const fetchTasks = async () => {
        try {
            const [tRes, pRes] = await Promise.all([
                axios.get("http://localhost:5000/api/tasks"),
                axios.get("http://localhost:5000/api/projects")
            ]);
            setTasks(tRes.data);
            setProjects(pRes.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" ? true : t.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">{role === 'owner' ? 'Global Task Operations' : 'Task Command Center'}</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">{role === 'owner' ? 'Master view of all agency objectives and directives.' : 'Every objective assigned to your profile across all initiatives.'}</p>
                </div>
            </div>

            {/* Tactical Search & Filter */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search objectives..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-sm text-sm font-bold outline-none focus:border-emerald-500/50 transition-all uppercase italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['all', 'todo', 'in-progress', 'review', 'done'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filter === s
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="bg-white h-48 border border-slate-200 rounded-sm animate-pulse"></div>)
                ) : filteredTasks.length === 0 ? (
                    <div className="col-span-full py-40 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400">
                        <List size={40} className="mb-4 opacity-20" />
                        <p className="font-black uppercase italic tracking-widest text-xs">No active units discovered in this sector</p>
                    </div>
                ) : filteredTasks.map(task => (
                    <Link
                        key={task._id}
                        to={`/${role}/projects/${task.projectId?._id || task.projectId}`}
                        className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm hover:border-emerald-500 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Target size={24} className="text-slate-900" />
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <span className={`status-badge text-[8px] ${task.priority === 'high' ? 'badge-red' : task.priority === 'medium' ? 'badge-orange' : 'badge-blue'
                                }`}>
                                {task.priority}
                            </span>
                            <div className="flex items-center text-[10px] font-black text-slate-400 uppercase italic">
                                <Clock size={12} className="mr-1" />
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}
                            </div>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 uppercase italic group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2 leading-relaxed">
                            {task.title}
                        </h3>

                        <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {projects.find(p => p._id === (task.projectId?._id || task.projectId))?.name || 'EXTERNAL'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {task.comments?.length > 0 && (
                                    <div className="flex items-center text-[10px] font-black text-slate-400">
                                        <MessageSquare size={12} className="mr-1" />
                                        {task.comments.length}
                                    </div>
                                )}
                                <span className={`status-badge text-[8px] ${task.status === 'done' ? 'badge-green' : 'badge-blue'}`}>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MyTasks;
