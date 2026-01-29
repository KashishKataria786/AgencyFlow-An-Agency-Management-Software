import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const debugQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL_CONNECTION_STRING);
        console.log("Connected to DB");

        // Simulate Owner query (kashish)
        const ownerId = "69778fc418a1c053d2f9ede8";
        const ownerAgencyId = "69778fc418a1c053d2f9edea";
        const ownerRole = "owner";

        console.log(`\n--- Simulating Query for ${ownerRole} ---`);
        let query = { agencyId: ownerAgencyId, _id: { $ne: ownerId } };
        query.role = { $in: ["member", "client"] };

        console.log("Query:", JSON.stringify(query));
        const users = await User.find(query).select("name email role");
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.name} (${u.role})`));

        // Simulate Member query (Kashish)
        const memberId = "69778fe518a1c053d2f9edf1";
        const memberAgencyId = "69778fc418a1c053d2f9edea";
        const memberRole = "member";

        console.log(`\n--- Simulating Query for ${memberRole} ---`);
        let mQuery = { agencyId: memberAgencyId, _id: { $ne: memberId } };
        mQuery.role = { $in: ["owner", "member"] };

        console.log("Query:", JSON.stringify(mQuery));
        const mUsers = await User.find(mQuery).select("name email role");
        console.log(`Found ${mUsers.length} users:`);
        mUsers.forEach(u => console.log(`- ${u.name} (${u.role})`));

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

debugQuery();
