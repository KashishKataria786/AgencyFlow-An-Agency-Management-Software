import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { createNotification } from "../config/notificationUtils.js";

export const getTasks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.projectId) filter.projectId = req.query.projectId;

        // If member, only show assigned tasks
        if (req.user.role === "member") {
            filter.assignedTo = req.user.id;
        }

        // If client, only show tasks for their projects
        if (req.user.role === "client") {
            const clientProjects = await Project.find({ clientId: req.user.clientId })
                .select("_id")
                .lean();
            const projectIds = clientProjects.map(p => p._id);
            filter.projectId = { $in: projectIds };
        }

        const tasks = await Task.find(filter)
            .populate("assignedTo", "name")
            .populate("projectId", "name agencyId")
            .lean();

        // Filter out tasks where project might have been hard-deleted (orphans)
        // or where agencyId doesn't match (security)
        const validTasks = tasks.filter(task =>
            task.projectId && task.projectId.agencyId.toString() === req.user.agencyId.toString()
        );

        res.status(200).json(validTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        // Ensure project belongs to agency
        const project = await Project.findOne({ _id: req.body.projectId, agencyId: req.user.agencyId })
            .select("_id clientId")
            .lean();
        if (!project) return res.status(403).json({ message: "Unauthorized project access" });

        const newTask = await Task.create(req.body);

        // Notify assigned user
        if (newTask.assignedTo) {
            await createNotification({
                recipient: newTask.assignedTo,
                sender: req.user.id,
                type: "task_assigned",
                title: "New Task Assigned",
                message: `You have been assigned a new task: ${newTask.title}`,
                relatedEntity: { entityType: "Task", entityId: newTask._id }
            });
        }

        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("projectId");
        if (!task || task.projectId.agencyId.toString() !== req.user.agencyId.toString()) {
            return res.status(404).json({ message: "Task not found" });
        }

        // If client, no access to update
        if (req.user.role === "client") {
            return res.status(403).json({ message: "Clients have read-only access to tasks" });
        }

        // If member, only allow status update
        if (req.user.role === "member") {
            const { status } = req.body;
            task.status = status || task.status;
            await task.save();
        } else {
            // Owner can update anything
            Object.assign(task, req.body);
            await task.save();
        }

        // Notify assigned member of the update
        if (task.assignedTo && task.assignedTo.toString() !== req.user.id.toString()) {
            await createNotification({
                recipient: task.assignedTo,
                sender: req.user.id,
                type: "task_updated",
                title: "Task Updated",
                message: `Task "${task.title}" has been updated.`,
                relatedEntity: { entityType: "Task", entityId: task._id }
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("projectId");
        if (!task || task.projectId.agencyId.toString() !== req.user.agencyId.toString()) {
            return res.status(404).json({ message: "Task not found" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("projectId");
        if (!task || task.projectId.agencyId.toString() !== req.user.agencyId.toString()) {
            return res.status(404).json({ message: "Task not found" });
        }

        const comment = {
            author: req.user.id,
            content: req.body.content,
            createdAt: new Date()
        };

        task.comments.push(comment);
        await task.save();

        // Notify assigned user if someone else commented
        if (task.assignedTo && task.assignedTo.toString() !== req.user.id.toString()) {
            await createNotification({
                recipient: task.assignedTo,
                sender: req.user.id,
                type: "task_updated", // Or a new type if preferred
                title: "New Comment on Task",
                message: `${req.user.name} commented on task: ${task.title}`,
                relatedEntity: { entityType: "Task", entityId: task._id }
            });
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCapacityStats = async (req, res) => {
    try {
        // Only owners can view capacity stats
        if (req.user.role !== "owner") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        console.log("Fetching capacity stats for agency:", req.user.agencyId);

        // First, get all projects for this agency
        const projects = await Project.find({ agencyId: req.user.agencyId })
            .select("_id")
            .lean();
        const projectIds = projects.map(p => p._id);

        console.log(`Found ${projects.length} projects for agency`);

        // Then get all tasks for those projects
        const tasks = await Task.find({ projectId: { $in: projectIds } })
            .populate("assignedTo", "name email")
            .populate("projectId", "name")
            .lean();

        console.log(`Found ${tasks.length} tasks for agency`);

        // Group tasks by team member
        const capacityMap = {};

        tasks.forEach(task => {
            // assignedTo is an array, so iterate over it
            if (!task.assignedTo || task.assignedTo.length === 0) return;

            task.assignedTo.forEach(assignee => {
                if (!assignee) return;

                const userId = assignee._id.toString();
                if (!capacityMap[userId]) {
                    capacityMap[userId] = {
                        user: {
                            _id: assignee._id,
                            name: assignee.name,
                            email: assignee.email
                        },
                        totalTasks: 0,
                        activeTasks: 0,
                        completedTasks: 0,
                        highPriorityTasks: 0,
                        upcomingDeadlines: []
                    };
                }

                capacityMap[userId].totalTasks++;

                if (task.status === "done") {
                    capacityMap[userId].completedTasks++;
                } else {
                    capacityMap[userId].activeTasks++;
                }

                if (task.priority === "high") {
                    capacityMap[userId].highPriorityTasks++;
                }

                // Track upcoming deadlines (next 14 days)
                if (task.dueDate && task.status !== "done") {
                    const dueDate = new Date(task.dueDate);
                    const now = new Date();
                    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

                    if (diffDays >= 0 && diffDays <= 14) {
                        // Check if this deadline is already added for this user
                        const existingDeadline = capacityMap[userId].upcomingDeadlines.find(
                            d => d.taskId.toString() === task._id.toString()
                        );

                        if (!existingDeadline) {
                            capacityMap[userId].upcomingDeadlines.push({
                                taskId: task._id,
                                title: task.title,
                                dueDate: task.dueDate,
                                priority: task.priority,
                                projectName: task.projectId?.name
                            });
                        }
                    }
                }
            });
        });

        console.log("Capacity map keys:", Object.keys(capacityMap));
        console.log("Number of unique team members:", Object.keys(capacityMap).length);

        // Convert to array and calculate capacity percentage
        const capacityStats = Object.values(capacityMap).map(member => ({
            ...member,
            capacityPercentage: Math.min(100, (member.activeTasks / 5) * 100), // 5 tasks = 100%
            upcomingDeadlines: member.upcomingDeadlines.sort((a, b) =>
                new Date(a.dueDate) - new Date(b.dueDate)
            )
        }));

        console.log("Sending capacity stats:", capacityStats.length, "members");
        res.status(200).json(capacityStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
