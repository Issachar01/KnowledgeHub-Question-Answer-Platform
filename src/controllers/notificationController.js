// src/controllers/notificationController.js
const {
  getUserNotifications,
  markNotificationAsRead
} = require("../services/notificationService");
const { updateNotificationSchema } = require("../validators/notificationValidator");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await getUserNotifications(userId);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateNotification = async (req, res) => {
  try {
    const notificationId = Number(req.params.id);
    const userId = req.user.userId;
    const { isRead } = updateNotificationSchema.parse(req.body);

    const updated = await markNotificationAsRead(notificationId, userId);

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Update notification error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (error.message === "Notification not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getNotifications,
  updateNotification
};