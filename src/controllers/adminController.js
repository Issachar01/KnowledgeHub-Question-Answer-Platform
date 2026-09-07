// controllers/adminController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, reputation: true, createdAt: true, isBlocked: true }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const toggleUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { isBlocked: !user.isBlocked }
    });

    res.status(200).json({ success: true, message: `User status updated to blocked: ${updated.isBlocked}` });
  } catch (error) {
    next(error);
  }
};

const deleteInappropriateContent = async (req, res, next) => {
  try {
    const { type, id } = req.params; // type: 'question' or 'answer'
    if (type === 'question') {
      await prisma.question.delete({ where: { id } });
    } else if (type === 'answer') {
      await prisma.answer.delete({ where: { id } });
    } else {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    res.status(200).json({ success: true, message: 'Content removed by admin' });
  } catch (error) {
    next(error);
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const [users, questions, answers, tags] = await Promise.all([
      prisma.user.count(),
      prisma.question.count(),
      prisma.answer.count(),
      prisma.tag.count()
    ]);

    res.status(200).json({
      success: true,
      stats: { users, questions, answers, tags }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, toggleUserBlock, deleteInappropriateContent, getPlatformStats };
