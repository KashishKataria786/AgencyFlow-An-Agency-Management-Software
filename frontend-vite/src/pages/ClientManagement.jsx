import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    Building2,
    Mail,
    Trash2,
    Edit3,
    CheckCircle,
    ExternalLink,
    AlertCircle,
    X,
    Filter
} from "lucide-react";

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", company: "", status: "Active", notes: "" });
    const [error, setError] = useState("");

    const fetchClients = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/clients`);
            setClients(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load clients");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await axios.put(`${import.meta.env.VITE_API_URL}/clients/${editingClient._id}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/clients`, formData);
            }
            setShowModal(false);
            setEditingClient(null);
            setFormData({ name: "", email: "", company: "", status: "Active", notes: "" });
            fetchClients();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/clients/${id}`);
                fetchClients();
            } catch (err) {
                setError("Failed to delete client");
            }
        }
    };

    const openEditModal = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            email: client.email,
            company: client.company,
            status: client.status || "Active",
            notes: client.notes || ""
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Client Directory</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Manage your agency's key accounts and relationship status.</p>
                </div>
                <button
                    onClick={() => { setEditingClient(null); setFormData({ name: "", email: "", company: "", status: "Active", notes: "" }); setShowModal(true); }}
                    className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-sm text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all uppercase italic"
                >
                    <UserPlus size={18} />
                    <span>New Account</span>
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold animate-shake">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-96">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, company, or email..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg">
                            <Filter size={14} />
                            <span>Filter</span>
                        </button>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {clients.length} Accounts Found
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 italic text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-4">Client Detail</th>
                                <th className="px-8 py-4">Company Entity</th>
                                <th className="px-8 py-4">Account Status</th>
                                <th className="px-8 py-4">Last Activity</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic">Scanning Account Directory...</td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest">No clients discovered. Secure your first account.</td>
                                </tr>
                            ) : clients.map((client) => (
                                <tr key={client._id} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-primary-light text-primary rounded-sm flex items-center justify-center font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors uppercase italic">{client.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <Building2 size={14} className="text-slate-300" />
                                            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{client.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`status-badge min-w-[80px] text-center ${client.status === 'Active' ? 'badge-primary' :
                                            client.status === 'Lead' ? 'badge-blue' : 'badge-orange'
                                            }`}>
                                            {client.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-slate-400 tabular-nums">
                                        {new Date(client.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditModal(client); }}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary-light rounded-sm transition-all"
                                                title="Edit Account"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(client._id); }}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm transition-all"
                                                title="Delete Account"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/20 animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{editingClient ? "Modify Account" : "Add New Account"}</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Agency Client Management</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-sm transition-colors"><X /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-bold text-slate-700 uppercase"
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-bold text-slate-700 uppercase"
                                            placeholder="e.g. Acme Corp"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                                    <div className="relative group">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 font-bold text-slate-700"
                                            placeholder="client@company.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Relationship</label>
                                    <div className="flex space-x-3">
                                        {['Lead', 'Active', 'Past'].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status: s })}
                                                className={`flex-1 py-3.5 rounded-sm border-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.status === s
                                                    ? 'border-primary bg-primary-light text-primary'
                                                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-primary transition-all flex items-center justify-center space-x-2">
                                    <span>{editingClient ? "Overwrite Details" : "Launch Account"}</span>
                                    <ExternalLink size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagement;
