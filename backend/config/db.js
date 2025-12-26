import mongoose from "mongoose";
import colors from "colors";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL_CONNECTION_STRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen);
  } catch (error) {
    console.error("Database Connection Failed".bgRed, error.message);
    process.exit(1);
  }
};

export default connectDatabase;