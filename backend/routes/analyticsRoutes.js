import express from "express";
import {
    getOverview,
    getRevenueAnalytics,
    getProjectAnalytics,
    getTaskAnalytics,
    getClientAnalytics,
    getTeamAnalytics
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Analytics endpoints
router.get("/overview", getOverview);
router.get("/revenue", getRevenueAnalytics);
router.get("/projects", getProjectAnalytics);
router.get("/tasks", getTaskAnalytics);
router.get("/clients", getClientAnalytics);
router.get("/team", getTeamAnalytics);

export default router;
