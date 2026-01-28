import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    Plus,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft,
    MessageSquare,
    User,
    MoreVertical,
    X,
    Send,
    Calendar,
    Layers,
    Flag
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");

    const [taskForm, setTaskForm] = useState({
        title: "",
        description: "",
        assignedTo: [],
        priority: "medium",
        dueDate: "",
        projectId: id
    });

    const fetchData = async () => {
        try {
            const [pRes, tRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`),
                axios.get(`${import.meta.env.VITE_API_URL}/tasks?projectId=${id}`)
            ]);

            if (user?.role === 'owner') {
                try {
                    const teamRes = await axios.get(`${import.meta.env.VITE_API_URL}/team`);
                    setTeam(teamRes.data);
                } catch (e) {
                    console.error("Failed to fetch team", e);
                }
            }

            setProject(pRes.data);
            setTasks(tRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to sync project data");
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setProject(null); // Triggers Access Terminated view
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, { ...taskForm, projectId: id });
            setShowTaskModal(false);
            setTaskForm({ title: "", description: "", assignedTo: [], priority: "medium", dueDate: "", projectId: id });
            fetchData();
        } catch (err) {
            setError("Failed to create task deployment");
        }
    };

    const handleUpdateStatus = async (taskId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, { status });
            fetchData();
            if (selectedTask?._id === taskId) {
                const updatedTask = tasks.find(t => t._id === taskId);
                setSelectedTask({ ...updatedTask, status });
            }
        } catch (err) {
            setError("Failed to update status codes");
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks/${selectedTask._id}/comments`, { content: newComment });
            setNewComment("");
            fetchData();
            // Refetch current task to show new comment
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks?projectId=${id}`);
            setSelectedTask(data.find(t => t._id === selectedTask._id));
        } catch (err) {
            setError("Communication link failed");
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm("CRITICAL: DATA REMOVAL. Are you sure?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`);
                navigate("/owner/projects");
            } catch (err) {
                setError("Deletion sequence interrupted");
            }
        }
    };

    if (loading) return <div className="p-20 text-center font-black italic uppercase tracking-widest text-slate-400">Initializing Mission Protocol...</div>;
    if (!project) return <div className="p-20 text-center font-black italic uppercase tracking-widest text-rose-500">Initiative 404: Access Terminated</div>;

    const columns = [
        { id: 'todo', label: 'Todo / Backlog' },
        { id: 'in-progress', label: 'In Execution' },
        { id: 'review', label: 'QA / Review' },
        { id: 'done', label: 'Deployment Complete' }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Project Header */}
            <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-all">
                            <ChevronLeft size={14} />
                            <span>Go back to directory</span>
                        </button>
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="badge-green uppercase text-[10px] font-black tracking-widest px-2 py-0.5 rounded-sm">{project.status}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {id.slice(-6)}</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">{project.name}</h1>
                            <p className="text-slate-500 font-semibold tracking-tighter max-w-2xl mt-2">{project.description}</p>
                        </div>
                    </div>
                    {user?.role === 'owner' && (
                        <button onClick={handleDeleteProject} className="p-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-sm hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-8 mt-10 pt-8 border-t border-slate-50">
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assigned Client</p>
                        <p className="text-xs font-black text-slate-900 uppercase italic flex items-center">
                            <User size={12} className="mr-1.5 text-emerald-500" />
                            {project.clientId?.company || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Budget</p>
                        <p className="text-xs font-black text-slate-900 uppercase italic flex items-center">
                            <CheckCircle2 size={12} className="mr-1.5 text-emerald-500" />
                            ${project.budget?.toLocaleString() || '0.00'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Timeline Hard Reset</p>
                        <p className="text-xs font-black text-slate-900 uppercase italic flex items-center">
                            <Calendar size={12} className="mr-1.5 text-emerald-500" />
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'NO LIMIT'}
                        </p>
                    </div>
                    {user?.role === 'owner' && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowTaskModal(true)}
                                className="bg-slate-900 text-white px-6 py-3 rounded-sm text-[10px] font-black uppercase italic tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                            >
                                Deploy New Task
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columns.map(col => (
                    <div key={col.id} className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-sm mr-2 ${col.id === 'done' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                {col.label}
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-sm">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        <div className="space-y-4 min-h-[500px]">
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <div
                                    key={task._id}
                                    onClick={() => setSelectedTask(task)}
                                    className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm hover:border-emerald-500 cursor-pointer group transition-all"
                                >
                                    <div className="flex justify-between mb-3">
                                        <div className={`status-badge text-[8px] ${task.priority === 'high' ? 'badge-red' : task.priority === 'medium' ? 'badge-orange' : 'badge-blue'}`}>
                                            {task.priority}
                                        </div>
                                        {task.comments?.length > 0 && (
                                            <div className="flex items-center text-[10px] font-bold text-slate-400">
                                                <MessageSquare size={10} className="mr-1" />
                                                {task.comments.length}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase italic group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                        <div className="flex -space-x-1.5">
                                            {(task.assignedTo || []).map(a => (
                                                <div key={a._id} className="w-6 h-6 bg-slate-100 rounded-sm border border-white text-[8px] font-black text-slate-500 flex items-center justify-center uppercase" title={a.name}>
                                                    {a.name.substring(0, 2)}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase italic">
                                            <Clock size={10} className="mr-1" />
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Task Details Drawer/Modal */}
            {selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white h-full w-full max-w-xl shadow-2xl relative border-l border-slate-100 animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`status-badge ${selectedTask.priority === 'high' ? 'badge-red' : 'badge-blue'}`}>{selectedTask.priority}</div>
                                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Task Execution Unit</span>
                            </div>
                            <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-4">{selectedTask.title}</h2>
                                <p className="text-slate-600 font-medium leading-relaxed">{selectedTask.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Layers size={14} className="mr-2" />
                                        Deployment Status
                                    </label>
                                    {user?.role === 'client' ? (
                                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm font-black text-xs uppercase text-slate-500">
                                            {columns.find(c => c.id === selectedTask.status)?.label}
                                        </div>
                                    ) : (
                                        <select
                                            className="w-full bg-slate-50 border border-slate-100 p-3 rounded-sm font-black text-xs uppercase"
                                            value={selectedTask.status}
                                            onChange={(e) => handleUpdateStatus(selectedTask._id, e.target.value)}
                                        >
                                            {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <Flag size={14} className="mr-2" />
                                        Assignee Matrix
                                    </label>
                                    <div className="flex -space-x-2">
                                        {(selectedTask.assignedTo || []).map(a => (
                                            <div key={a._id} className="w-8 h-8 bg-emerald-100 border-2 border-white rounded-sm text-xs font-black text-emerald-700 flex items-center justify-center uppercase">
                                                {a.name.substring(0, 2)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-50">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center italic">
                                    <MessageSquare size={16} className="mr-2 text-emerald-500" />
                                    Communication Logs
                                </h3>
                                <div className="space-y-4">
                                    {selectedTask.comments?.map((c, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-sm border border-slate-100 group">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-black text-slate-900 uppercase">{c.author?.name || 'Authorized Member'}</p>
                                                <p className="text-[8px] font-bold text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">{c.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {user?.role !== 'client' && (
                            <div className="p-8 bg-slate-50 border-t border-slate-100">
                                <form onSubmit={handleAddComment} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter encrypted transmission..."
                                        className="w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-xs"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-sm hover:bg-emerald-600 transition-all">
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Task Creation Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl relative border border-white/20 animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Deploy Task Unit</h2>
                                <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleCreateTask} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Specification</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 uppercase"
                                        placeholder="Enter Title"
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 font-bold text-slate-700 text-sm"
                                        placeholder="Detailed execution steps..."
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Combatants</label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-sm max-h-32 overflow-y-auto">
                                        {team.map(member => (
                                            <button
                                                key={member._id}
                                                type="button"
                                                onClick={() => {
                                                    const assigned = taskForm.assignedTo.includes(member._id);
                                                    setTaskForm({
                                                        ...taskForm,
                                                        assignedTo: assigned
                                                            ? taskForm.assignedTo.filter(id => id !== member._id)
                                                            : [...taskForm.assignedTo, member._id]
                                                    });
                                                }}
                                                className={`px-3 py-1.5 rounded-sm text-[10px] font-black uppercase transition-all border ${taskForm.assignedTo.includes(member._id)
                                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                                                    }`}
                                            >
                                                {member.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                        <select
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700 uppercase italic"
                                            value={taskForm.priority}
                                            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        >
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">Critical Level</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700 uppercase"
                                            value={taskForm.dueDate}
                                            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-emerald-600 transition-all">Deploy Task</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
