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
const questionRoutes = require('./routes/questionRoutes')
const tagRoutes = require('./routes/tagRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const adminRoutes = require('./routes/adminRoutes')
const searchRoutes = require("./routes/searchRoutes");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const moderatorRoutes = require('./routes/moderatorRoutes');

const app = express();

app.set('trust proxy', 1);

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

app.use('/api', apiLimiter)

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
//notification routes
app.use('/api', notificationRoutes);
// Question routes
app.use("/api/questions", questionRoutes);
// admin routes
app.use('/api/admin', adminRoutes)
// search routes
app.use("/api/search", searchRoutes);
// Tag routes
app.use("/api/tags", tagRoutes);
// Moderator routes
app.use('/api/moderator', moderatorRoutes);


module.exports = app;