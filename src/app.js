const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");


dotenv.config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to KnowledgeHub API"
  });
});

// Database test route
app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connection successful"
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Authentication routes
app.use("/api/auth", authRoutes);
//user routes
app.use("/api/users", userRoutes);

module.exports = app;