import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getTeamMembers = async (req, res) => {
    try {
        const members = await User.find({
            agencyId: req.user.agencyId,
            _id: { $ne: req.user.id } // Don't list the owner themselves in team management
        }).select("-password").populate("clientId", "company name");
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTeamMember = async (req, res) => {
    const { name, email, password, role, clientId } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "member",
            agencyId: req.user.agencyId,
            clientId: role === "client" ? clientId : undefined
        });

        res.status(201).json({
            message: "Team member added successfully",
            user: { id: newUser._id, name, email, role: newUser.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMember = async (req, res) => {
    try {
        const { name, role, clientId } = req.body;
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            {
                name,
                role,
                clientId: role === "client" ? clientId : undefined
            },
            { new: true }
        ).select("-password").populate("clientId", "company name");

        if (!user) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMemberStatus = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            { isActive: req.body.isActive },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changeMemberPassword = async (req, res) => {
    const { newPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Member not found" });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user.agencyId
        });

        if (!user) return res.status(404).json({ message: "Member not found" });
        res.status(200).json({ message: "Member removed from team" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
