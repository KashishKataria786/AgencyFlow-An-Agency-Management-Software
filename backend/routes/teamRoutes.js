import express from "express";
import {
    getTeamMembers,
    addTeamMember,
    updateMemberStatus,
    updateMember,
    changeMemberPassword,
    deleteMember
} from "../controllers/teamController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner } from "../middleware/roleMiddleware.js";

const teamRouter = express.Router();

teamRouter.use(authMiddleware);
teamRouter.use(isOwner);

teamRouter.get("/", getTeamMembers);
teamRouter.post("/", addTeamMember);
teamRouter.put("/:id/status", updateMemberStatus);
teamRouter.put("/:id", updateMember);
teamRouter.put("/:id/password", changeMemberPassword);
teamRouter.delete("/:id", deleteMember);

export default teamRouter;
