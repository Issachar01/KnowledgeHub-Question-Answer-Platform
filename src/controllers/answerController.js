// controllers/answerController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../utils/sendEmail');

const createAnswer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { author: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: userId
      }
    });

    // Update user reputation (+10 for answering)
    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: 10 } }
    });

    // Send email notification to question owner
    if (question.author.email && question.authorId !== userId) {
      await sendEmail({
        email: question.author.email,
        subject: 'New Answer on Your Question',
        message: `Hello ${question.author.name}, someone answered your question "${question.title}".`
      });
    }

    res.status(201).json({ success: true, data: answer });
  } catch (error) {
    next(error);
  }
};

const getAnswersByQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: { author: { select: { id: true, name: true, profileImage: true, reputation: true } } },
      orderBy: [{ isAccepted: 'desc' }, { createdAt: 'desc' }]
    });

    res.status(200).json({ success: true, count: answers.length, data: answers });
  } catch (error) {
    next(error);
  }
};

const updateAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    if (answer.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to edit this answer' });
    }

    const updated = await prisma.answer.update({
      where: { id },
      data: { content }
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    if (answer.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to delete this answer' });
    }

    await prisma.answer.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Answer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAnswer, getAnswersByQuestion, updateAnswer, deleteAnswer };
