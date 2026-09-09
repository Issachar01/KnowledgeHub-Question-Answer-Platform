// src/controllers/adminController.js

const prisma = require("../config/prisma");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        reputation: true,
        createdAt: true,
        isVerified: true,
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
    next(error);
  }
};

const toggleUserBlock = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Using isVerified as the current block/active mechanism
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: !user.isVerified
      },
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
    next(error);
  }
};

const softDeleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.deletedAt) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "User account soft-deleted successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Soft delete user error:", error);
    next(error);
  }
};

const deleteInappropriateContent = async (req, res, next) => {
  try {
    const { type } = req.params;
    const contentId = Number(req.params.id);

    if (!Number.isInteger(contentId) || contentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid content ID"
      });
    }

    const contentType = type.toLowerCase();

    if (
      contentType === "question" ||
      contentType === "questions"
    ) {
      await prisma.question.delete({
        where: { id: contentId }
      });
    } else if (
      contentType === "answer" ||
      contentType === "answers"
    ) {
      await prisma.answer.delete({
        where: { id: contentId }
      });
    } else if (
      contentType === "comment" ||
      contentType === "comments"
    ) {
      await prisma.comment.delete({
        where: { id: contentId }
      });
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

    next(error);
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalQuestions,
      totalAnswers,
      totalComments,
      totalVotes
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
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
    next(error);
  }
};

module.exports = {
  getAllUsers,
  toggleUserBlock,
  softDeleteUser,
  deleteInappropriateContent,
  getPlatformStats
};