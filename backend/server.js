import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import colors from "colors";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDatabase from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(bodyParser.json());

// database connection
await connectDatabase();

app.get("/", (req, res) =>
  res.send("<h1>Agency & Client Management API</h1>")
);

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);

import jwt from "jsonwebtoken";

// Socket.io initialization
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  const { id: userId, agencyId, clientId, role } = socket.user;
  console.log(`User connected: ${socket.id} (User: ${userId})`.cyan);

  // Join private room
  socket.join(`user_${userId}`);

  // Join agency room
  if (agencyId) {
    socket.join(`agency_${agencyId}`);
  }

  // Join client room
  if (role === "client" && clientId) {
    socket.join(`client_${clientId}`);
  }

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`.red);
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  httpServer.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`.bgBlue);
  });
}

export { io };
export default app;
