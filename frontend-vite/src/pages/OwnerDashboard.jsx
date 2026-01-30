import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
    TrendingUp, Users, Briefcase, DollarSign, Search,
    FileText, RefreshCw, Calendar, ArrowRight, Download
} from "lucide-react";
import MetricCard from "../components/charts/MetricCard";
import RevenueChart from "../components/charts/RevenueChart";
import DonutChart from "../components/charts/DonutChart";

const OwnerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [overview, setOverview] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [projectAnalytics, setProjectAnalytics] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [overviewRes, projectRes, invoiceRes] = await Promise.all([
                axios.get(`${API_URL}/analytics/overview`, config),
                axios.get(`${API_URL}/analytics/projects`, config),
                axios.get(`${API_URL}/invoices`, config)
            ]);

            setOverview(overviewRes.data);
            setProjectAnalytics(projectRes.data);
            setInvoices(invoiceRes.data.slice(0, 5)); // Only show last 5
        } catch (error) {
            console.error('Dashboard Data Fetch Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const revenueChartData = useMemo(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return overview?.monthlyRevenue?.map(item => ({
            month: `${monthNames[item._id.month - 1]}`,
            revenue: item.revenue
        })) || [];
    }, [overview?.monthlyRevenue]);

    const projectStatusData = useMemo(() => {
        return projectAnalytics?.projectsByStatus?.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        })) || [];
    }, [projectAnalytics?.projectsByStatus]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={40} />
                    <p className="text-slate-600 font-medium tracking-tight">Synchronizing Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Executive Overview</h1>
                    <p className="text-slate-500 text-sm">Real-time performance metrics for your agency.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-bold hover:bg-primary/90 transition-all shadow-sm">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Gross Revenue"
                    value={`$${overview?.overview?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="+12.5%"
                />
                <MetricCard
                    title="Active Projects"
                    value={overview?.overview?.totalProjects || 0}
                    icon={Briefcase}
                    color="blue"
                    trend="up"
                    trendValue="+3.2%"
                />
                <MetricCard
                    title="Active Clients"
                    value={overview?.overview?.totalClients || 0}
                    icon={Users}
                    color="purple"
                    trend="up"
                    trendValue="+5.1%"
                />
                <MetricCard
                    title="Success Rate"
                    value={`${overview?.overview?.taskCompletionRate || 0}%`}
                    icon={TrendingUp}
                    color="primary"
                    trend="up"
                    trendValue="+8.4%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Revenue Trajectory</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly Growth Performance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <span className="w-3 h-3 bg-primary rounded-full"></span>
                                <span className="text-[10px] font-bold text-slate-500">Revenue</span>
                            </div>
                        </div>
                    </div>
                    {revenueChartData.length > 0 ? (
                        <RevenueChart data={revenueChartData} type="area" />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-sm">
                            <p className="text-slate-400 text-sm font-medium">Insufficient Data for Projection</p>
                        </div>
                    )}
                </div>

                {/* Project Status Donut */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm group">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-black text-slate-900 text-lg uppercase tracking-tight">Portfolio Health</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Project Distribution</p>
                        </div>
                        <Briefcase size={20} className="text-slate-300" />
                    </div>
                    {projectStatusData.length > 0 ? (
                        <div className="h-[300px]">
                            <DonutChart
                                data={projectStatusData}
                                colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']}
                            />
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-sm">
                            <p className="text-slate-400 text-sm font-medium">No Portfolio Data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Financial Transactions */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-1000">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tight">Recent Financial Activity</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Latest Invoices & Payments</p>
                    </div>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center space-x-1 hover:space-x-2 transition-all">
                        <span>View All Transactions</span>
                        <ArrowRight size={12} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Counterparty</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Magnitude</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors underline decoration-primary/0 group-hover:decoration-primary/100">
                                                    {invoice.invoiceNumber || 'N/A'}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                                    {invoice.project?.title || 'GENERAL_SERVICE'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center text-[10px] font-black text-white">
                                                    {(invoice.client?.name || 'C').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                                                    {invoice.client?.name || 'Unknown Client'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600">
                                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                                                    <Calendar size={8} />
                                                    <span>Created</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`status-badge px-3 py-1 text-[9px] font-black uppercase tracking-widest ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    invoice.status === 'Sent' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <p className="text-sm font-black text-slate-900">
                                                ${invoice.totalAmount?.toLocaleString() || '0.00'}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <FileText className="text-slate-200 mb-2" size={40} />
                                            <p className="text-slate-400 text-xs font-medium">No Recent Financial Activity Detected</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
