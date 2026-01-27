import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Briefcase,
    Plus,
    Search,
    Calendar,
    User,
    MoreVertical,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Target
} from "lucide-react";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ name: "", description: "", clientId: "", budget: 0, deadline: "", status: "planning" });

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/projects");
            setProjects(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load projects");
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/clients");
            setClients(data);
        } catch (err) { }
    };

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/projects", formData);
            setShowAddModal(false);
            setFormData({ name: "", description: "", clientId: "", budget: 0, deadline: "", status: "planning" });
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'badge-green';
            case 'planning': return 'badge-blue';
            case 'on-hold': return 'badge-orange';
            case 'completed': return 'bg-slate-100 text-slate-600 border border-slate-200';
            default: return 'bg-slate-50 text-slate-400';
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Project Directory</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Oversee every active engagement and agency initiative.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2.5 rounded-sm text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all uppercase italic"
                >
                    <Plus size={18} />
                    <span>Initialize Project</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-64 border border-slate-200 rounded-sm animate-pulse"></div>
                    ))
                ) : projects.length === 0 ? (
                    <div className="col-span-full py-20 bg-white border border-dashed border-slate-300 rounded-sm flex flex-col items-center text-slate-400">
                        <Briefcase size={40} className="mb-4 opacity-20" />
                        <p className="font-bold italic uppercase tracking-widest text-xs">No project deployments found</p>
                    </div>
                ) : projects.map((project) => (
                    <Link
                        key={project._id}
                        to={`/owner/projects/${project._id}`}
                        className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 hover:border-emerald-500 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`status-badge ${getStatusColor(project.status)}`}>
                                {project.status}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Target size={12} className="mr-1" />
                                {project.clientId?.company || 'Internal Project'}
                            </span>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 leading-tight uppercase italic mb-2 group-hover:text-emerald-600 transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 h-10">
                            {project.description || 'No specialized description provided for this initiative.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Allocated Budget</p>
                                <p className="text-xs font-black text-slate-900">${(project.budget || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Hard Deadline</p>
                                <p className="text-xs font-black text-slate-900 uppercase italic">
                                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-sm bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                                        +
                                    </div>
                                ))}
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Add Project Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl relative border border-white/20 animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Deploy New Initiative</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiative Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 uppercase"
                                        placeholder="Project Title"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 text-sm"
                                        placeholder="Strategic objectives..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Account</label>
                                        <select
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 uppercase"
                                            value={formData.clientId}
                                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                        >
                                            <option value="">Select Client</option>
                                            {clients.map(c => <option key={c._id} value={c._id}>{c.company}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Budget</label>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700"
                                            placeholder="0.00"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700 uppercase"
                                            value={formData.deadline}
                                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase Status</label>
                                        <select
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700 uppercase"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="planning">Planning</option>
                                            <option value="active">Active</option>
                                            <option value="on-hold">On Hold</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-emerald-600 transition-all">
                                    Onboard Project
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
