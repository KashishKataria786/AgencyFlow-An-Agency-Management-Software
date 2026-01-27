import express from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner } from "../middleware/roleMiddleware.js";

const projectRouter = express.Router();

projectRouter.use(authMiddleware);

projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.post("/", isOwner, createProject);
projectRouter.put("/:id", isOwner, updateProject);
projectRouter.delete("/:id", isOwner, deleteProject);

export default projectRouter;
