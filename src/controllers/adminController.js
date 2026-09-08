// src/controllers/adminController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reputation: true,
        createdAt: true,
        isVerified: true, // Replaced non-existent isBlocked with isVerified
        updatedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const toggleUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Toggle isVerified status as the block/active mechanism
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: !user.isVerified },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Toggle user block error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const deleteInappropriateContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const contentId = parseInt(id, 10);

    if (isNaN(contentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID format"
      });
    }

    const contentType = type.toLowerCase();

    if (contentType === "question" || contentType === "questions") {
      await prisma.question.delete({ where: { id: contentId } });
    } else if (contentType === "answer" || contentType === "answers") {
      await prisma.answer.delete({ where: { id: contentId } });
    } else if (contentType === "comment" || contentType === "comments") {
      await prisma.comment.delete({ where: { id: contentId } });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid content type. Must be question, answer, or comment."
      });
    }

    return res.status(200).json({
      success: true,
      message: `${contentType.toUpperCase()} deleted successfully by admin`
    });
  } catch (error) {
    console.error("Admin delete content error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalQuestions, totalAnswers, totalComments, totalVotes] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.answer.count(),
      prisma.comment.count(),
      prisma.vote.count()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalQuestions,
        totalAnswers,
        totalComments,
        totalVotes
      }
    });
  } catch (error) {
    console.error("Get platform stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
  getAllUsers,
  toggleUserBlock,
  deleteInappropriateContent,
  getPlatformStats
};