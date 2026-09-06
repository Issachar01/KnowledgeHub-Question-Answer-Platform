// controllers/commentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const { questionId, answerId } = req.params;

    if (!questionId && !answerId) {
      return res.status(400).json({ error: 'Target entity ID missing' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        questionId: questionId || null,
        answerId: answerId || null
      },
      include: { author: { select: { id: true, name: true, profileImage: true } } }
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { questionId, answerId } = req.params;
    const whereClause = questionId ? { questionId } : { answerId };

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: { author: { select: { id: true, name: true, profileImage: true } } },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment, getComments };
