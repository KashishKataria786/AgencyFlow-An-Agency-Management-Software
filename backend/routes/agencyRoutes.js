import express from "express";
import { getAgencySettings, updateAgencySettings } from "../controllers/agencyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isOwner } from "../middleware/roleMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(authMiddleware);

// Only Owners should be able to update agency settings usually, 
// members might need to just READ them (which is handled by Layout/Auth context usually via User info, but direct fetch is good too)
router.get("/", getAgencySettings);
router.put("/", isOwner, upload.single('logo'), updateAgencySettings);

export default router;
