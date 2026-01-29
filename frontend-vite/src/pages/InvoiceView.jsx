import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Printer,
    Download,
    ArrowLeft,
    Loader2,
    CheckCircle,
    AlertCircle,
    Hash,
    Calendar,
    User,
    Building2,
    Briefcase
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const InvoiceView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const role = user?.role;
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInvoice = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/invoices/${id}`);
            setInvoice(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load invoice details");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="max-w-7xl mx-auto p-8 text-center">
                <AlertCircle className="mx-auto mb-4 text-rose-500" size={48} />
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">Error Loading Invoice</h2>
                <p className="text-slate-500 mb-8">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-sm font-black uppercase italic tracking-widest"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
            {/* Action Bar - Hidden during print */}
            <div className="flex items-center justify-between print:hidden">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-tight"
                >
                    <ArrowLeft size={18} />
                    <span>Return</span>
                </button>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-sm text-sm font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all uppercase italic"
                    >
                        <Printer size={18} />
                        <span>Print Invoice</span>
                    </button>
                </div>
            </div>

            {/* Invoice Template */}
            <div className="bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden print:border-none print:shadow-none">
                {/* Header */}
                <div className="p-8 md:p-12 border-b-8 border-primary bg-slate-50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-white font-black text-xl">A</div>
                                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">AgencyFlow</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Issuer Entity</p>
                                <p className="text-lg font-black text-slate-900 uppercase italic">{invoice.agencyId?.name}</p>
                                <p className="text-sm font-bold text-slate-500">{invoice.agencyId?.email}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-4">
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter opacity-10 leading-none">Invoice</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Manifest Reference</p>
                                <p className="text-xl font-black text-slate-900 uppercase italic tabular-nums">#{invoice.invoiceNumber}</p>
                            </div>
                            <div className={`inline-flex px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest ${invoice.status === 'paid' ? 'bg-primary-light text-primary' : 'bg-amber-100 text-amber-700'
                                }`}>
                                Payment Status: {invoice.status}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-12 border-b border-slate-100">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bill To Client</p>
                            <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 space-y-1">
                                <p className="font-black text-slate-900 uppercase italic">{invoice.clientId?.name}</p>
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">{invoice.clientId?.company}</p>
                                <p className="text-sm font-medium text-slate-500">{invoice.clientId?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Initiative</p>
                            <p className="font-black text-slate-900 uppercase italic flex items-center">
                                <Briefcase size={16} className="mr-2 text-primary" />
                                {invoice.projectId?.name}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6 md:text-right">
                        <div className="grid grid-cols-2 gap-8 justify-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Date</p>
                                <p className="text-sm font-black text-slate-900 uppercase italic">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Deadline</p>
                                <p className="text-sm font-black text-rose-600 uppercase italic">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-8 md:p-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="pb-4">Line Item Description</th>
                                <th className="pb-4 text-center">Qty</th>
                                <th className="pb-4 text-right">Unit Price</th>
                                <th className="pb-4 text-right">Extended Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="text-sm font-bold">
                                    <td className="py-6 text-slate-900">{item.description}</td>
                                    <td className="py-6 text-center text-slate-500 tabular-nums">{item.quantity}</td>
                                    <td className="py-6 text-right text-slate-500 tabular-nums">${item.price.toLocaleString()}</td>
                                    <td className="py-6 text-right text-slate-900 font-black tabular-nums">${(item.quantity * item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Notes</p>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                    {invoice.notes || "No additional specialized instructions provided for this transaction."}
                                </p>
                            </div>
                            <div className="p-4 bg-primary-light rounded-sm border border-primary/20">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Payment Instruction</p>
                                <p className="text-sm font-bold text-primary tracking-tight">Please settle this balance via wire transfer or credit facility within the specified deadline.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span className="uppercase tracking-widest text-[10px]">Subtotal Aggregate</span>
                                <span className="tabular-nums">${invoice.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-50">
                                <span className="uppercase tracking-widest text-[10px]">VAT / Tax (0%)</span>
                                <span className="tabular-nums">$0.00</span>
                            </div>
                            <div className="h-0.5 bg-slate-900 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-900 uppercase italic tracking-widest">Total Liability</span>
                                <span className="text-3xl font-black text-slate-900 tabular-nums">${invoice.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block text-center pt-8 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certified Digital Invoice • Generated via AgencyFlow Enterprise</p>
            </div>
        </div>
    );
};

export default InvoiceView;
