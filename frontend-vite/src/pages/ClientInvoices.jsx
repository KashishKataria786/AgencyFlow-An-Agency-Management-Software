import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    Eye,
    TrendingUp,
    AlertCircle,
    Loader2,
    Search,
    Download
} from "lucide-react";

const ClientInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInvoices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/invoices`);
            setInvoices(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load your billing manifest");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Stats
    const totalPending = invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.amount, 0);
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Financial Ledger</h1>
                    <p className="text-slate-500 text-sm font-semibold tracking-tighter">Review your active balances and historical billing records.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 border border-slate-200 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Liabilities</p>
                    <p className="text-4xl font-black text-rose-600 italic tabular-nums">${totalPending.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-rose-500 text-[10px] font-bold uppercase">
                        <AlertCircle size={12} className="mr-1" />
                        <span>Payment Required</span>
                    </div>
                </div>
                <div className="bg-white p-8 border border-slate-200 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settled Capital</p>
                    <p className="text-4xl font-black text-primary italic tabular-nums">${totalPaid.toLocaleString()}</p>
                    <div className="mt-4 flex items-center text-primary text-[10px] font-bold uppercase">
                        <CheckCircle2 size={12} className="mr-1" />
                        <span>Account Verified</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm flex items-center space-x-3 text-rose-600 text-sm font-bold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Invoices Table */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-96">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by Manifest ID or Project..."
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100 italic text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-4">Manifest ID</th>
                                <th className="px-8 py-4">Project Initiative</th>
                                <th className="px-8 py-4">Capital Amount</th>
                                <th className="px-8 py-4">Current Status</th>
                                <th className="px-8 py-4">Hard Deadline</th>
                                <th className="px-8 py-4 text-right">Administrative</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" /></td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-black uppercase italic tracking-widest text-xs">No financial deployments found</td>
                                </tr>
                            ) : invoices.map((invoice) => (
                                <tr key={invoice._id} className="hover:bg-slate-50 transition-all group">
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-slate-900 uppercase italic">#{invoice.invoiceNumber}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black text-slate-600 uppercase italic tracking-tight">{invoice.projectId?.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-900 tabular-nums">${invoice.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`status-badge min-w-[80px] text-center ${invoice.status === 'paid' ? 'badge-primary' :
                                            invoice.status === 'overdue' ? 'badge-red' : 'badge-blue'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500 tabular-nums">
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            to={`/client/invoices/${invoice._id}`}
                                            className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover font-black uppercase italic text-[10px] border-2 border-primary px-4 py-2 rounded-sm hover:bg-primary-light transition-all"
                                        >
                                            <Eye size={14} />
                                            <span>View & Print</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Support Box */}
            <div className="bg-slate-900 p-8 rounded-sm shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Billing Inquiries?</h3>
                    <p className="text-slate-400 text-sm font-medium">Contact our financial department for account reconciliation or payment facility discussions.</p>
                </div>
                <button className="whitespace-nowrap bg-primary text-white px-8 py-4 rounded-sm font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all">
                    Initiate Discussion
                </button>
            </div>
        </div>
    );
};

export default ClientInvoices;
