const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

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

module.exports = app;