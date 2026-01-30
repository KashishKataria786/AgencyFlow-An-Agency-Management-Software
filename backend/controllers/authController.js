import User from "../models/User.js";
import Agency from "../models/Agency.js";
import Client from "../models/Client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * REGISTER USER
 */
export const registerUser = async (req, res) => {
  const { name, email, password, agencyName } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Public registration is for OWNERS only
    if (!agencyName) {
      return res.status(400).json({ message: "Agency Name is required for new workspace registration" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create User as OWNER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner",
    });

    // 2. Create Agency and link back
    if (user.role === "owner") {
      const agency = await Agency.create({
        name: agencyName,
        ownerId: user._id
      });

      user.agencyId = agency._id;
      await user.save();
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.isActive === false) {
      return res.status(401).json({ message: "Your account is inactive. Please contact your agency owner." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Self-healing: If owner lacks agencyId, try to find their agency
    if (user.role === "owner" && !user.agencyId) {
      const existingAgency = await Agency.findOne({ ownerId: user._id });
      if (existingAgency) {
        user.agencyId = existingAgency._id;
        await user.save();
      }
    }

    // Self-healing: If client lacks clientId, try to link by email
    if (user.role === "client" && !user.clientId) {
      const existingClient = await Client.findOne({
        email: { $regex: new RegExp(`^${user.email}$`, "i") },
        agencyId: user.agencyId
      });
      if (existingClient) {
        user.clientId = existingClient._id;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, agencyId: user.agencyId, clientId: user.clientId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        clientId: user.clientId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CLERK SYNC - Sync Clerk User with our DB
 */
export const clerkSync = async (req, res) => {
  const { clerkId, email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        clerkId, // We should add this field to User model
        role: "owner", // Default to owner for new Clerk signups
        password: Math.random().toString(36).slice(-8), // Dummy password
      });
    } else if (!user.clerkId) {
      // Link clerkId if user existed (email match) but no clerkId set
      user.clerkId = clerkId;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, agencyId: user.agencyId, clientId: user.clientId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        clientId: user.clientId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
