import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Get overview analytics
export const getOverview = async (req, res) => {
    try {
        const agencyId = new mongoose.Types.ObjectId(req.user.agencyId);
        const { startDate, endDate } = req.query;

        // Build date filter
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Total counts
        const [totalProjects, totalClients, totalTasks, totalInvoices] = await Promise.all([
            Project.countDocuments({ agencyId, ...dateFilter }),
            Client.countDocuments({ agencyId, ...dateFilter }),
            Task.countDocuments({ ...dateFilter }),
            Invoice.countDocuments({ agencyId, ...dateFilter })
        ]);

        // Revenue calculation
        const revenueData = await Invoice.aggregate([
            { $match: { agencyId, status: "paid", ...dateFilter } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
            { $project: { total: 1 } }
        ]).allowDiskUse(true);
        const totalRevenue = revenueData[0]?.total || 0;

        // Project status distribution
        const projectsByStatus = await Project.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Task completion rate
        const taskStats = await Task.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $project: { _id: 1, count: 1 } }
        ]).allowDiskUse(true);

        const completedTasks = taskStats.find(t => t._id === "done")?.count || 0;
        const totalTasksCount = taskStats.reduce((sum, t) => sum + t.count, 0);
        const taskCompletionRate = totalTasksCount > 0 ? ((completedTasks / totalTasksCount) * 100).toFixed(1) : 0;

        // Monthly revenue trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Invoice.aggregate([
            {
                $match: {
                    agencyId,
                    status: "paid",
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" }
                }
            },
            { $project: { _id: 1, revenue: 1 } },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).allowDiskUse(true);

        res.json({
            overview: {
                totalRevenue,
                totalProjects,
                totalClients,
                totalTasks,
                taskCompletionRate: parseFloat(taskCompletionRate)
            },
            projectsByStatus,
            taskStats,
            monthlyRevenue
        });
    } catch (error) {
        console.error("Error fetching overview analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const agencyId = new mongoose.Types.ObjectId(req.user.agencyId);
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Total revenue by status
        const revenueByStatus = await Invoice.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: "$status", total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        // Revenue by client
        const revenueByClient = await Invoice.aggregate([
            { $match: { agencyId, status: "paid", ...dateFilter } },
            { $group: { _id: "$clientId", total: { $sum: "$amount" } } },
            { $sort: { total: -1 } },
            { $limit: 10 },
            { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
            { $unwind: "$client" },
            { $project: { clientName: "$client.name", total: 1 } }
        ]);

        // Revenue by month
        const revenueByMonth = await Invoice.aggregate([
            { $match: { agencyId, status: "paid", ...dateFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Average invoice amount
        const avgInvoice = await Invoice.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: null, average: { $avg: "$amount" } } }
        ]);

        res.json({
            revenueByStatus,
            revenueByClient,
            revenueByMonth,
            averageInvoiceAmount: avgInvoice[0]?.average || 0
        });
    } catch (error) {
        console.error("Error fetching revenue analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get project analytics
export const getProjectAnalytics = async (req, res) => {
    try {
        const agencyId = new mongoose.Types.ObjectId(req.user.agencyId);
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Projects by status
        const projectsByStatus = await Project.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Projects by deadline status
        const now = new Date();
        const upcomingDeadline = new Date();
        upcomingDeadline.setDate(upcomingDeadline.getDate() + 7);

        const [overdueProjects, upcomingProjects] = await Promise.all([
            Project.countDocuments({ agencyId, deadline: { $lt: now }, status: { $ne: "completed" } }),
            Project.countDocuments({ agencyId, deadline: { $gte: now, $lte: upcomingDeadline }, status: { $ne: "completed" } })
        ]);

        // Budget utilization
        const budgetStats = await Project.aggregate([
            { $match: { agencyId, ...dateFilter } },
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: "$budget" },
                    avgBudget: { $avg: "$budget" }
                }
            }
        ]);

        // Projects by client
        const projectsByClient = await Project.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: "$clientId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
            { $unwind: "$client" },
            { $project: { clientName: "$client.name", count: 1 } }
        ]);

        res.json({
            projectsByStatus,
            deadlineStatus: {
                overdue: overdueProjects,
                upcoming: upcomingProjects
            },
            budgetStats: budgetStats[0] || { totalBudget: 0, avgBudget: 0 },
            projectsByClient
        });
    } catch (error) {
        console.error("Error fetching project analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get task analytics
export const getTaskAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Tasks by status
        const tasksByStatus = await Task.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Tasks by priority
        const tasksByPriority = await Task.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        // Overdue tasks
        const now = new Date();
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: now },
            status: { $ne: "done" },
            ...dateFilter
        });

        // Completion rate
        const completedTasks = tasksByStatus.find(t => t._id === "done")?.count || 0;
        const totalTasks = tasksByStatus.reduce((sum, t) => sum + t.count, 0);
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

        // Tasks by project
        const tasksByProject = await Task.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$projectId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" } },
            { $unwind: "$project" },
            { $project: { projectName: "$project.name", count: 1 } }
        ]);

        res.json({
            tasksByStatus,
            tasksByPriority,
            overdueTasks,
            completionRate: parseFloat(completionRate),
            tasksByProject
        });
    } catch (error) {
        console.error("Error fetching task analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get client analytics
export const getClientAnalytics = async (req, res) => {
    try {
        const agencyId = new mongoose.Types.ObjectId(req.user.agencyId);
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Clients by status
        const clientsByStatus = await Client.aggregate([
            { $match: { agencyId, ...dateFilter } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Top clients by revenue
        const topClientsByRevenue = await Invoice.aggregate([
            { $match: { agencyId, status: "paid", ...dateFilter } },
            { $group: { _id: "$clientId", totalRevenue: { $sum: "$amount" }, invoiceCount: { $sum: 1 } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            { $lookup: { from: "clients", localField: "_id", foreignField: "_id", as: "client" } },
            { $unwind: "$client" },
            { $project: { clientName: "$client.name", totalRevenue: 1, invoiceCount: 1 } }
        ]);

        // Client acquisition over time
        const clientAcquisition = await Client.aggregate([
            { $match: { agencyId, ...dateFilter } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            clientsByStatus,
            topClientsByRevenue,
            clientAcquisition
        });
    } catch (error) {
        console.error("Error fetching client analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get team performance analytics
export const getTeamAnalytics = async (req, res) => {
    try {
        const agencyId = new mongoose.Types.ObjectId(req.user.agencyId);
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
        }

        // Tasks by team member
        const tasksByMember = await Task.aggregate([
            { $match: dateFilter },
            { $unwind: "$assignedTo" },
            { $group: { _id: "$assignedTo", total: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { userName: "$user.name", email: "$user.email", total: 1 } },
            { $sort: { total: -1 } }
        ]);

        // Completed tasks by team member
        const completedTasksByMember = await Task.aggregate([
            { $match: { status: "done", ...dateFilter } },
            { $unwind: "$assignedTo" },
            { $group: { _id: "$assignedTo", completed: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { userName: "$user.name", completed: 1 } },
            { $sort: { completed: -1 } }
        ]);

        // Workload distribution
        const workloadDistribution = await Task.aggregate([
            { $match: { status: { $in: ["todo", "in-progress"] }, ...dateFilter } },
            { $unwind: "$assignedTo" },
            { $group: { _id: "$assignedTo", activeTasks: { $sum: 1 } } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { userName: "$user.name", activeTasks: 1 } },
            { $sort: { activeTasks: -1 } }
        ]);

        res.json({
            tasksByMember,
            completedTasksByMember,
            workloadDistribution
        });
    } catch (error) {
        console.error("Error fetching team analytics:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
