import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Agency from "./models/Agency.js";

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL_CONNECTION_STRING);
        console.log("Connected to DB");

        const users = await User.find({});
        console.log("Users found:", users.length);
        users.forEach(u => {
            console.log(`User: ${u.name} (${u.role}), ID: ${u._id}, AgencyID: ${u.agencyId}`);
        });

        const agencies = await Agency.find({});
        console.log("Agencies found:", agencies.length);
        agencies.forEach(a => {
            console.log(`Agency: ${a.name}, ID: ${a._id}`);
        });

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUsers();
