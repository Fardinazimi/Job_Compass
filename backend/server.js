import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import jobAppRoutes from "./routes/jobAppRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settings from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

connect();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://job-compass-frontend.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/jobapp", jobAppRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/settings", settings); // Prefixing the settings route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message,
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
