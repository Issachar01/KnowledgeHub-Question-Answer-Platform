// src/validators/notificationValidator.js
const { z } = require("zod");

const createNotificationSchema = z.object({
  userId: z.number().int().positive("User ID must be a positive integer"),
  type: z.enum(["UPVOTE", "ANSWER", "COMMENT", "ACCEPTED_ANSWER"], {
    errorMap: () => ({ message: "Invalid notification type" })
  }),
  message: z.string().min(1, "Message is required"),
  referenceId: z.number().int().positive("Reference ID must be a positive integer").optional()
});

const updateNotificationSchema = z.object({
  isRead: z.boolean()
});

module.exports = {
  createNotificationSchema,
  updateNotificationSchema
};