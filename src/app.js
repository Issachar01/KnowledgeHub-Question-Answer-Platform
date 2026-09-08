const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

dotenv.config();

const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const answerRoutes = require('./routes/answerRoutes');
const commentRoutes = require("./routes/commentRoutes");
const voteRoutes = require('./routes/voteRoutes')

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());
//swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

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

// User routes
app.use("/api/users", userRoutes);
//answer routes
app.use('/api', answerRoutes);
//comment routes
app.use('/api', commentRoutes);
//vote routes
app.use('/api', voteRoutes)

// Question routes
app.use("/api/questions", questionRoutes);

// Tag routes
app.use("/api/tags", tagRoutes);

module.exports = app;