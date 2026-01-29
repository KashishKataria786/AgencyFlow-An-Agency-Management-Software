import express from "express";
import { getTasks, createTask, updateTask, deleteTask, addComment, getCapacityStats } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner, isTeamMember } from "../middleware/roleMiddleware.js";

const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.get("/capacity", isOwner, getCapacityStats);
taskRouter.get("/", getTasks);
taskRouter.post("/", isOwner, createTask);
taskRouter.put("/:id", isTeamMember, updateTask);
taskRouter.delete("/:id", isOwner, deleteTask);
taskRouter.post("/:id/comments", isTeamMember, addComment);

export default taskRouter;
