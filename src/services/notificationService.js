// src/services/notificationService.js
const prisma = require("../config/prisma");

const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};

const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  });

  if (!notification || notification.userId !== userId) {
    throw new Error("Notification not found");
  }

  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};

const createNotification = async (data) => {
  return await prisma.notification.create({
    data
  });
};

// Automated triggers for answers and votes
const notifyAnswerCreated = async (questionId, answererId, newAnswerId) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { authorId: true, title: true }
    });

    if (question && question.authorId !== answererId) {
      await createNotification({
        userId: question.authorId,
        type: "ANSWER",
        message: `Someone answered your question: "${question.title.substring(0, 30)}..."`,
        referenceId: newAnswerId
      });
    }
  } catch (error) {
    console.error("Failed to create answer notification:", error);
  }
};

const notifyVoteCast = async ({ questionId, answerId, voterId, type }) => {
  if (type !== "UPVOTE") return;

  try {
    let targetUserId = null;
    let referenceId = null;

    if (questionId) {
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { authorId: true }
      });
      targetUserId = question?.authorId;
      referenceId = questionId;
    } else if (answerId) {
      const answer = await prisma.answer.findUnique({
        where: { id: answerId },
        select: { authorId: true }
      });
      targetUserId = answer?.authorId;
      referenceId = answerId;
    }

    if (targetUserId && targetUserId !== voterId) {
      await createNotification({
        userId: targetUserId,
        type: "UPVOTE",
        message: `Your ${questionId ? "question" : "answer"} received an upvote!`,
        referenceId: referenceId
      });
    }
  } catch (error) {
    console.error("Failed to create vote notification:", error);
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
  notifyAnswerCreated,
  notifyVoteCast
};