import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FileText,
    MessageSquare,
    ExternalLink,
    Calendar,
    Loader2,
    Briefcase,
    CheckSquare,
    DollarSign,
    Clock,
    Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const ClientPortal = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const [projectsRes, tasksRes, invoicesRes] = await Promise.all([
                axios.get("http://localhost:5000/api/projects"),
                axios.get("http://localhost:5000/api/tasks"),
                axios.get("http://localhost:5000/api/invoices")
            ]);
            setProjects(projectsRes.data);
            setTasks(tasksRes.data);
            setInvoices(invoicesRes.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load portal data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-sm">
                <Briefcase size={48} className="mx-auto mb-4 text-slate-200" />
                <h2 className="text-xl font-black text-slate-900 uppercase italic">No Active Projects</h2>
                <p className="text-slate-500 font-medium">Your agency hasn't deployed any initiatives for your account yet.</p>
            </div>
        );
    }

    const mainProject = projects[0];
    const projectTasks = tasks.filter(t => t.projectId?._id === mainProject._id || t.projectId === mainProject._id);
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

    const pendingInvoices = invoices.filter(i => i.status === 'pending');
    const totalPendingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Project Hub</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Real-time tracking of every movement across your platform.</p>
                </div>
                <button className="flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2 rounded-sm text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all uppercase italic">
                    <MessageSquare size={16} />
                    <span>Request Sync</span>
                </button>
            </div>

            <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-sm -mr-16 -mt-16 blur-3xl opacity-50"></div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{mainProject.status}</span>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase italic">{mainProject.name}</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Progress</span>
                        <p className="text-3xl font-black text-emerald-600 italic">{progress}%</p>
                    </div>
                </div>

                <div className="w-full bg-slate-50 rounded-sm h-2 mb-10 border border-slate-100 p-0.5">
                    <div
                        className="bg-emerald-500 h-full rounded-sm shadow-sm transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-5 bg-slate-50/50 rounded-sm border border-slate-100 group hover:border-emerald-200 transition-all">
                        <div className="flex items-center space-x-3 mb-3 text-slate-900">
                            <div className="p-2 bg-emerald-50 rounded-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Calendar size={18} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Hard Deadline</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600 px-1 uppercase italic">
                            {mainProject.deadline ? new Date(mainProject.deadline).toLocaleDateString() : 'TBD'}
                        </p>
                    </div>
                    <div className="p-5 bg-slate-50/50 rounded-sm border border-slate-100 group hover:border-emerald-200 transition-all">
                        <div className="flex items-center space-x-3 mb-3 text-slate-900">
                            <div className="p-2 bg-emerald-50 rounded-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <DollarSign size={18} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Pending Billing</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600 px-1 italic">
                            {pendingInvoices.length} Manifests (${totalPendingAmount.toLocaleString()})
                        </p>
                    </div>
                    <div className="p-5 bg-slate-50/50 rounded-sm border border-slate-100 group hover:border-emerald-200 transition-all">
                        <div className="flex items-center space-x-3 mb-3 text-slate-900">
                            <div className="p-2 bg-emerald-50 rounded-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <CheckSquare size={18} />
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">Task Status</span>
                        </div>
                        <p className="text-sm font-bold text-slate-600 px-1 italic">
                            {completedTasks} of {projectTasks.length} Milestones Cleared
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Development */}
                <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-black text-slate-900 uppercase italic">Recent Development</h2>
                        <span className="w-10 h-1 bg-emerald-500 rounded-sm"></span>
                    </div>
                    <div className="space-y-10 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-50">
                        {projectTasks.slice(0, 4).map((task) => (
                            <div key={task._id} className="flex space-x-6 relative group">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-sm z-10 border-4 border-white shadow-sm ${task.status === 'done' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                                </div>
                                <div className="flex-1 -mt-1.5 p-5 bg-slate-50/30 border border-slate-100 rounded-sm group-hover:border-emerald-100 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-black text-slate-900 uppercase italic">{task.title}</p>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{task.status}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        {task.description || 'System-level update following project roadmap.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {projectTasks.length === 0 && (
                            <p className="text-center text-slate-400 font-bold italic uppercase tracking-widest py-10">No recent task activity discovered.</p>
                        )}
                    </div>
                </div>

                {/* Financial Ledger Summary */}
                <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-black text-slate-900 uppercase italic">Financial Ledger</h2>
                        <span className="w-10 h-1 bg-emerald-500 rounded-sm"></span>
                    </div>
                    <div className="flex-1 space-y-4">
                        {invoices.slice(0, 5).map((invoice) => (
                            <div key={invoice._id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-sm group hover:border-emerald-200 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-white rounded-sm border border-slate-100 text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-all">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase italic">#{invoice.invoiceNumber}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {new Date(invoice.createdAt).toLocaleDateString()} • {invoice.projectId?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center space-x-4">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 italic">${invoice.amount.toLocaleString()}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${invoice.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <Link to={`/client/invoices/${invoice._id}`} className="p-2 bg-white border border-slate-100 rounded-sm text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                                        <Eye size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {invoices.length === 0 && (
                            <p className="text-center text-slate-400 font-bold italic uppercase tracking-widest py-10">No financial deployments detected.</p>
                        )}
                    </div>
                    {invoices.length > 5 && (
                        <Link to="/client/invoices" className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">
                            View All Financial Records
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientPortal;
