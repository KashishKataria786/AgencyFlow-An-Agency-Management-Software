import Agency from "../models/Agency.js";
import User from "../models/User.js";

/**
 * Get Agency Settings
 * Route: GET /api/agency
 */
export const getAgencySettings = async (req, res) => {
    console.log("GET /api/agency hit", req.user);
    try {
        const { agencyId } = req.user;

        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }

        res.status(200).json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update Agency Settings
 * Route: PUT /api/agency
 */
export const updateAgencySettings = async (req, res) => {
    console.log("PUT /api/agency hit", req.user, req.body);
    try {
        const { agencyId } = req.user;
        const { brandColor, secondaryColor, website, name, logoUrl } = req.body;

        const agency = await Agency.findById(agencyId);
        if (!agency) {
            return res.status(404).json({ message: "Agency not found" });
        }

        // Update basic fields
        if (name) agency.name = name;
        if (brandColor) agency.settings.brandColor = brandColor;
        if (secondaryColor) agency.settings.secondaryColor = secondaryColor;
        if (website) agency.settings.website = website;

        // Handle Logo Update
        // 1. File Upload (New)
        if (req.file) {
            agency.settings.logo = req.file.path; // Cloudinary URL
        }
        // 2. Manual URL (Backwards compatibility / Direct link)
        else if (logoUrl && logoUrl.trim() !== "") {
            agency.settings.logo = logoUrl;
        }

        await agency.save();
        res.status(200).json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Setup Agency (Initial)
 * Route: POST /api/agency/setup
 */
export const setupAgency = async (req, res) => {
    const { name, website, brandColor } = req.body;
    const userId = req.user.id; // From authMiddleware

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.agencyId) {
            return res.status(400).json({ message: "User already has an agency" });
        }

        const agency = await Agency.create({
            name,
            ownerId: userId,
            settings: {
                brandColor: brandColor || "#10b981",
                website: website || ""
            }
        });

        user.agencyId = agency._id;
        user.role = "owner";
        await user.save();

        res.status(201).json({
            message: "Agency setup successful",
            agencyId: agency._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
