import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import colors from "colors";
import connectDatabase from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
dotenv.config();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(bodyParser.json());

// database connection
await connectDatabase();

app.get("/", (req, res) =>
  res.send("<h1>Hello from  Backend</h1>")
);


app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`.bgBlue);
  });
}

export default app;