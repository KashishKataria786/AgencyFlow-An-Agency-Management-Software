import Project from "../models/Project.js";

export const getProjects = async (req, res) => {
    try {
        const filter = { agencyId: req.user.agencyId };

        // If client, only show their projects
        if (req.user.role === "client") {
            filter.clientId = req.user.clientId;
        }

        const projects = await Project.find(filter)
            .populate("clientId", "name company")
            .lean();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            agencyId: req.user.agencyId
        })
            .populate("clientId", "name company")
            .lean();

        if (!project) return res.status(404).json({ message: "Project not found" });

        // Extra check for client role
        if (req.user.role === "client" && project.clientId?._id.toString() !== req.user.clientId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const newProject = await Project.create({
            ...req.body,
            agencyId: req.user.agencyId
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            req.body,
            { new: true }
        );
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user.agencyId
        });
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
