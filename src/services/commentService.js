const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async ({ content, authorId, questionId, answerId }) => {
  if (questionId) {
    const question = await prisma.question.findUnique({ where: { id: parseInt(questionId) } });
    if (!question) throw new Error('Question not found');
  }

  if (answerId) {
    const answer = await prisma.answer.findUnique({ where: { id: parseInt(answerId) } });
    if (!answer) throw new Error('Answer not found');
  }

  return await prisma.comment.create({
    data: {
      content,
      authorId,
      questionId: questionId ? parseInt(questionId) : null,
      answerId: answerId ? parseInt(answerId) : null
    },
    include: { author: { select: { id: true, name: true, profileImage: true } } }
  });
};

const getCommentsByTarget = async (type, targetId) => {
  const whereClause = type === 'question' 
    ? { questionId: parseInt(targetId) } 
    : { answerId: parseInt(targetId) };

  return await prisma.comment.findMany({
    where: whereClause,
    include: { author: { select: { id: true, name: true, profileImage: true } } },
    orderBy: { createdAt: 'asc' }
  });
};

const updateComment = async (id, content, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
  if (!comment) throw new Error('Comment not found');
  if (comment.authorId !== userId) throw new Error('Unauthorized');

  return await prisma.comment.update({
    where: { id: parseInt(id) },
    data: { content },
    include: { author: { select: { id: true, name: true, profileImage: true } } }
  });
};

const deleteComment = async (id, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });
  if (!comment) throw new Error('Comment not found');
  if (comment.authorId !== userId) throw new Error('Unauthorized');

  await prisma.comment.delete({ where: { id: parseInt(id) } });
};

module.exports = {
  createComment,
  getCommentsByTarget,
  updateComment,
  deleteComment
};