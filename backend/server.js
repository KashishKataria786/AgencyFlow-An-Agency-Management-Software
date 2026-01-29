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
import agencyRoutes from "./routes/agencyRoutes.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

// Middlewares
app.use((req, res, next) => {
  console.log(`Trace: ${req.method} ${req.url}`);
  next();
});
app.use(morgan("combined"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(bodyParser.json());

// database connection
await connectDatabase();

app.get("/", (req, res) =>
  res.send("<h1>Agency & Client Management API</h1>")
);

import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";

// ... existing code ...

app.use("/api/agency", agencyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// Catch-all for debugging 404s
app.use((req, res, next) => {
  console.log(`404 at ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

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

  // Chat Message Handler
  socket.on("send_message", async (data) => {
    try {
      const { receiverId, content } = data;

      // Save to database
      const newMessage = new Message({
        sender: userId,
        receiver: receiverId,
        content,
        agencyId
      });
      await newMessage.save();

      // Populate sender details for the notification
      await newMessage.populate("sender", "name");

      // Emit to receiver
      io.to(`user_${receiverId}`).emit("receive_message", newMessage);

      // Emit back to sender (for optimistic update confirmation or just syncing other tabs)
      // socket.emit("message_sent", newMessage); // Optional, client usually handles this optimistically

    } catch (error) {
      console.error("Error sending message via socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`.red);
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  httpServer.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`.bgBlue);
    console.log("Registered Routes:");
    app._router.stack.filter(r => r.route).map(r => console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`));
  });
}

export { io };
export default app;
