import express from "express";
import { registerUser, loginUser, clerkSync } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/clerk-sync", clerkSync);

export default authRouter;
