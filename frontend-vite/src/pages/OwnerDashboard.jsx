import React from "react";
import { TrendingUp, Users, Briefcase, DollarSign, Search, FileText } from "lucide-react";

const OwnerDashboard = () => {
    const stats = [
        { label: "Total Revenue", value: "$124,500.50", icon: <TrendingUp size={20} />, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Net Earnings", value: "$76,234.90", icon: <DollarSign size={20} />, trend: "-3.2%", color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Total Profit", value: "$48,265.60", icon: <Briefcase size={20} />, trend: "+8.1%", color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 text-sm">Track and manage every financial movement across your agency.</p>
                </div>
                <div className="flex bg-emerald-50 border border-emerald-100 p-1 rounded-sm">
                    <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-bold text-emerald-600">Overview</button>
                    <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600">Analytics</button>
                </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-100 p-4 rounded-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 bg-emerald-500 rounded-sm"></div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Profitability set your custom</p>
                        <div className="w-96 bg-emerald-200 h-1.5 rounded-sm mt-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[75%]"></div>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">75% Completed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <div className={`${stat.bg} ${stat.color} p-1.5 rounded-sm`}>{stat.icon}</div>
                        </div>
                        <div className="flex items-end space-x-3">
                            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                            <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Recent Transactions</h2>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" />
                        </div>
                        <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-sm text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                            <FileText size={16} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3].map((item) => (
                                <tr key={item} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 uppercase">INV-01293_{item}</p>
                                        <p className="text-[10px] text-slate-400 tracking-tighter">PROJECT_ALPHA_DEVELOPMENT</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-emerald-100 rounded-sm flex items-center justify-center text-[10px] font-bold text-emerald-700">CL</div>
                                            <span className="text-xs font-medium text-slate-600">Client Name {item}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">Jan {12 + item}, 2026</td>
                                    <td className="px-6 py-4">
                                        <span className={`status-badge ${item === 2 ? 'badge-orange' : 'badge-green'}`}>
                                            {item === 2 ? 'Pending' : 'Completed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-sm font-black text-slate-900">$2,450.00</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
