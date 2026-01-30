import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    TrendingUp, DollarSign, Briefcase, Users, CheckCircle,
    Calendar, Download, Filter, RefreshCw
} from 'lucide-react';
import MetricCard from '../components/charts/MetricCard';
import RevenueChart from '../components/charts/RevenueChart';
import DonutChart from '../components/charts/DonutChart';
import CustomBarChart from '../components/charts/BarChart';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // Analytics data states
    const [overview, setOverview] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [taskData, setTaskData] = useState(null);
    const [clientData, setClientData] = useState(null);
    const [teamData, setTeamData] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Fetch all analytics data
    const fetchAnalytics = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: dateRange.startDate ? dateRange : {}
            };

            const [overviewRes, revenueRes, projectRes, taskRes, clientRes, teamRes] = await Promise.all([
                axios.get(`${API_URL}/analytics/overview`, config),
                axios.get(`${API_URL}/analytics/revenue`, config),
                axios.get(`${API_URL}/analytics/projects`, config),
                axios.get(`${API_URL}/analytics/tasks`, config),
                axios.get(`${API_URL}/analytics/clients`, config),
                axios.get(`${API_URL}/analytics/team`, config)
            ]);

            setOverview(overviewRes.data);
            setRevenueData(revenueRes.data);
            setProjectData(projectRes.data);
            setTaskData(taskRes.data);
            setClientData(clientRes.data);
            setTeamData(teamRes.data);

            // Debug logging
            console.log('Analytics Data Loaded:', {
                overview: overviewRes.data,
                revenue: revenueRes.data,
                projects: projectRes.data,
                tasks: taskRes.data,
                clients: clientRes.data,
                team: teamRes.data
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            console.error('Error details:', error.response?.data || error.message);
            alert(`Failed to load analytics: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [dateRange, API_URL]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);


    // Memoize chart data transformations
    const revenueChartData = useMemo(() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return overview?.monthlyRevenue?.map(item => ({
            month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            revenue: item.revenue
        })) || [];
    }, [overview?.monthlyRevenue]);

    const projectStatusData = useMemo(() => {
        return projectData?.projectsByStatus?.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        })) || [];
    }, [projectData?.projectsByStatus]);

    const taskStatusData = useMemo(() => {
        return taskData?.tasksByStatus?.map(item => ({
            name: item._id === 'in-progress' ? 'In Progress' : item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        })) || [];
    }, [taskData?.tasksByStatus]);

    const topClientsData = useMemo(() => {
        return revenueData?.revenueByClient?.map(item => ({
            name: item.clientName,
            revenue: item.total
        })) || [];
    }, [revenueData?.revenueByClient]);

    const teamPerformanceData = useMemo(() => {
        return teamData?.completedTasksByMember?.map(item => ({
            name: item.userName,
            tasks: item.completed
        })) || [];
    }, [teamData?.completedTasksByMember]);

    const handleDateFilter = useCallback(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const handleExport = useCallback(() => {
        // TODO: Implement export functionality
        alert('Export functionality coming soon!');
    }, []);

    const onRefresh = useCallback(() => {
        fetchAnalytics(true);
    }, [fetchAnalytics]);

    const onClearFilter = useCallback(() => {
        setDateRange({ startDate: '', endDate: '' });
        setTimeout(() => fetchAnalytics(), 100);
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-primary" size={40} />
                    <p className="text-slate-600 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                    <p className="text-slate-500 text-sm">Comprehensive insights into your agency performance</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-sm text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white p-4 rounded-sm border border-slate-200 flex items-center space-x-4">
                <Filter size={18} className="text-slate-400" />
                <div className="flex items-center space-x-3 flex-1">
                    <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">End Date</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            className="px-3 py-1.5 border border-slate-200 rounded-sm text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <button
                        onClick={handleDateFilter}
                        className="mt-5 px-4 py-1.5 bg-primary text-white rounded-sm text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Apply Filter
                    </button>
                    {(dateRange.startDate || dateRange.endDate) && (
                        <button
                            onClick={onClearFilter}
                            className="mt-5 px-4 py-1.5 bg-slate-100 text-slate-700 rounded-sm text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`$${overview?.overview?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    color="green"
                />
                <MetricCard
                    title="Active Projects"
                    value={overview?.overview?.totalProjects || 0}
                    icon={Briefcase}
                    color="blue"
                />
                <MetricCard
                    title="Total Clients"
                    value={overview?.overview?.totalClients || 0}
                    icon={Users}
                    color="purple"
                />
                <MetricCard
                    title="Task Completion"
                    value={`${overview?.overview?.taskCompletionRate || 0}%`}
                    icon={CheckCircle}
                    color="primary"
                />
            </div>

            {/* Revenue Trend */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-bold text-slate-900 text-lg">Revenue Trend</h2>
                        <p className="text-xs text-slate-500">Monthly revenue over time</p>
                    </div>
                    <TrendingUp className="text-emerald-600" size={20} />
                </div>
                {revenueChartData.length > 0 ? (
                    <RevenueChart data={revenueChartData} type="area" />
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                        No revenue data available
                    </div>
                )}
            </div>

            {/* Project & Task Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Status Distribution */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-900 text-lg mb-2">Project Status</h2>
                    <p className="text-xs text-slate-500 mb-4">Distribution by status</p>
                    {projectStatusData.length > 0 ? (
                        <DonutChart
                            data={projectStatusData}
                            colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b']}
                        />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            No project data available
                        </div>
                    )}
                </div>

                {/* Task Status Distribution */}
                <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-900 text-lg mb-2">Task Status</h2>
                    <p className="text-xs text-slate-500 mb-4">Distribution by status</p>
                    {taskStatusData.length > 0 ? (
                        <DonutChart
                            data={taskStatusData}
                            colors={['#10b981', '#6366f1', '#f59e0b', '#ef4444']}
                        />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            No task data available
                        </div>
                    )}
                </div>
            </div>

            {/* Top Clients by Revenue */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                <h2 className="font-bold text-slate-900 text-lg mb-2">Top Clients by Revenue</h2>
                <p className="text-xs text-slate-500 mb-4">Highest revenue-generating clients</p>
                {topClientsData.length > 0 ? (
                    <CustomBarChart
                        data={topClientsData}
                        dataKey="revenue"
                        xAxisKey="name"
                        color="#10b981"
                        horizontal={true}
                    />
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                        No client revenue data available
                    </div>
                )}
            </div>

            {/* Team Performance */}
            <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
                <h2 className="font-bold text-slate-900 text-lg mb-2">Team Performance</h2>
                <p className="text-xs text-slate-500 mb-4">Completed tasks by team member</p>
                {teamPerformanceData.length > 0 ? (
                    <CustomBarChart
                        data={teamPerformanceData}
                        dataKey="tasks"
                        xAxisKey="name"
                        color="#6366f1"
                    />
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                        No team performance data available
                    </div>
                )}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-sm border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">Overdue Tasks</span>
                        <Calendar className="text-primary" size={18} />
                    </div>
                    <p className="text-3xl font-black text-slate-900">{taskData?.overdueTasks || 0}</p>
                    <p className="text-xs text-slate-600 mt-1">Require immediate attention</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-6 rounded-sm border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Avg Invoice</span>
                        <DollarSign className="text-emerald-600" size={18} />
                    </div>
                    <p className="text-3xl font-black text-slate-900">
                        ${revenueData?.averageInvoiceAmount?.toFixed(0) || 0}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Average invoice amount</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 p-6 rounded-sm border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">Active Clients</span>
                        <Users className="text-purple-600" size={18} />
                    </div>
                    <p className="text-3xl font-black text-slate-900">
                        {clientData?.clientsByStatus?.find(c => c._id === 'Active')?.count || 0}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">Currently active clients</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
