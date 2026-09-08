// src/routes/notificationRoutes.js
const express = require("express");
const {
  getNotifications,
  updateNotification
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/notifications", authMiddleware, getNotifications);
router.patch("/notifications/:id", authMiddleware, updateNotification);

module.exports = router;