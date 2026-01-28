import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Filter,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle2,
    MoreVertical,
    X,
    AlertCircle,
    Eye,
    Trash2,
    DollarSign,
    Loader2
} from "lucide-react";

const Financials = () => {
    const [invoices, setInvoices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        projectId: "",
        amount: 0,
        dueDate: "",
        notes: "",
        items: [{ description: "", quantity: 1, price: 0 }]
    });

    const fetchInvoices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/invoices`);
            setInvoices(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load financial records");
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/projects`);
            setProjects(data);
        } catch (err) { }
    };

    useEffect(() => {
        fetchInvoices();
        fetchProjects();
    }, []);

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/invoices`, formData);
            setShowAddModal(false);
            setFormData({ projectId: "", amount: 0, dueDate: "", notes: "", items: [{ description: "", quantity: 1, price: 0 }] });
            fetchInvoices();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/invoices/${id}/status`, { status });
            fetchInvoices();
        } catch (err) {
            setError("Failed to update status");
        }
    };

    const deleteInvoice = async (id) => {
        if (window.confirm("Are you sure you want to remove this financial record?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/invoices/${id}`);
                fetchInvoices();
            } catch (err) {
                setError("Failed to delete invoice");
            }
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: "", quantity: 1, price: 0 }]
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Recalculate total amount
        const totalAmount = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        setFormData({
            ...formData,
            items: newItems,
            amount: totalAmount
        });
    };

    // Stats
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
    const totalInvoices = invoices.length;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Ledger Dashboard</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Real-time revenue tracking and project billing management.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2.5 rounded-sm text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all uppercase italic"
                >
                    <Plus size={18} />
                    <span>Generate Manifest</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settled Revenue</p>
                    <p className="text-3xl font-black text-slate-900 italic">${totalRevenue.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-emerald-500 text-[10px] font-bold uppercase">
                        <CheckCircle2 size={12} className="mr-1" />
                        <span>Verified Liquidity</span>
                    </div>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Outbound Capital</p>
                    <p className="text-3xl font-black text-slate-900 italic">${pendingAmount.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-amber-500 text-[10px] font-bold uppercase">
                        <Clock size={12} className="mr-1" />
                        <span>Sync Pending</span>
                    </div>
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileText size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Volume</p>
                    <p className="text-3xl font-black text-slate-900 italic">{totalInvoices}</p>
                    <div className="mt-4 flex items-center text-slate-400 text-[10px] font-bold uppercase">
                        <FileText size={12} className="mr-1" />
                        <span>Total Deployments</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto"><X size={14} /></button>
                </div>
            )}

            {/* Invoices Table */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-96">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by ID, Client or Project..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 italic text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-4">Manifest ID</th>
                                <th className="px-8 py-4">Associated Initiative</th>
                                <th className="px-8 py-4">Capital Amount</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Hard Date</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-black uppercase italic tracking-widest text-xs">No financial records detected</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-slate-50 transition-all group">
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-black text-slate-900 uppercase italic">#{invoice.invoiceNumber}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{invoice.clientId?.company}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            {/* <Briefcase size={14} className="text-slate-300" /> */}
                                            <span className="text-xs font-black text-slate-600 uppercase italic tracking-tight">{invoice.projectId?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-slate-900 tabular-nums">${invoice.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`status-badge min-w-[80px] text-center ${invoice.status === 'paid' ? 'badge-green' :
                                                invoice.status === 'overdue' ? 'badge-red' : 'badge-blue'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-bold text-slate-500">
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/owner/invoices/${invoice._id}`}
                                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-sm"
                                                title="View Manifest"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            {invoice.status !== 'paid' && (
                                                <button
                                                    onClick={() => updateStatus(invoice._id, 'paid')}
                                                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-sm"
                                                    title="Mark as Paid"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteInvoice(invoice._id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-sm"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Invoice Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-sm w-full max-w-2xl shadow-2xl relative border border-white/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Generate Billing Manifest</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X /></button>
                            </div>

                            <form onSubmit={handleCreateInvoice} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Project</label>
                                        <select
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 uppercase"
                                            value={formData.projectId}
                                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                        >
                                            <option value="">Select Project</option>
                                            {projects.map(p => <option key={p._id} value={p._id}>{p.name} ({p.clientId?.company})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hard Deadline</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-slate-700 uppercase"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Billing Line Items</label>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="text-[10px] font-black text-emerald-600 uppercase italic hover:underline"
                                        >
                                            + Add Item
                                        </button>
                                    </div>

                                    {formData.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 items-end animate-in fade-in duration-200">
                                            <div className="col-span-6 space-y-1">
                                                <input
                                                    type="text"
                                                    placeholder="Service description"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-sm"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-sm tabular-nums"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-sm outline-none font-bold text-sm tabular-nums"
                                                    value={item.price}
                                                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-1 py-3 text-rose-500 hover:text-rose-700 cursor-pointer flex justify-center">
                                                <X size={18} onClick={() => {
                                                    const newItems = formData.items.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, items: newItems });
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Administrative Notes</label>
                                    <textarea
                                        rows="2"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-700 text-sm"
                                        placeholder="Terms and conditions..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</p>
                                        <p className="text-2xl font-black text-slate-900">${formData.amount.toLocaleString()}</p>
                                    </div>
                                    <button type="submit" className="bg-slate-900 text-white font-black px-10 py-4 rounded-sm shadow-xl shadow-slate-200 uppercase italic tracking-widest hover:bg-emerald-600 transition-all">
                                        Deploy Invoice
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Financials;
