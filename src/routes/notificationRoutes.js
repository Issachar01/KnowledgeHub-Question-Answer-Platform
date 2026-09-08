// src/routes/notificationRoutes.js
const express = require("express");
const {
  getNotifications,
  updateNotification
} = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieves all notifications for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/notifications", authMiddleware, getNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   patch:
 *     summary: Update notification status
 *     description: Marks a specific notification as read or updates its status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the notification
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.patch("/notifications/:id", authMiddleware, updateNotification);

module.exports = router;