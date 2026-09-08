// src/services/answerService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');

const createAnswer = async (questionId, content, authorId) => {
  const question = await prisma.question.findUnique({
    where: { id: parseInt(questionId) },
    select: { authorId: true, title: true }
  });

  if (!question) {
    throw new Error('Question not found');
  }

  const newAnswer = await prisma.answer.create({
    data: {
      content,
      questionId: parseInt(questionId),
      authorId
    }
  });

  // Notify question owner if the answerer is someone else
  if (question.authorId !== authorId) {
    await createNotification({
      userId: question.authorId,
      type: "ANSWER",
      message: `Someone answered your question: "${question.title.substring(0, 30)}..."`,
      referenceId: newAnswer.id
    });
  }

  return newAnswer;
};

const getAnswersByQuestion = async (questionId) => {
  return await prisma.answer.findMany({
    where: { questionId: parseInt(questionId) },
    include: { author: { select: { id: true, name: true, profileImage: true } } }
  });
};

const updateAnswer = async (id, content, userId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: parseInt(id) }
  });

  if (!answer) {
    throw new Error('Answer not found');
  }

  if (answer.authorId !== userId) {
    throw new Error('Unauthorized');
  }

  return await prisma.answer.update({
    where: { id: parseInt(id) },
    data: { content }
  });
};

const deleteAnswer = async (id, userId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: parseInt(id) }
  });

  if (!answer) {
    throw new Error('Answer not found');
  }

  if (answer.authorId !== userId) {
    throw new Error('Unauthorized');
  }

  await prisma.answer.delete({
    where: { id: parseInt(id) }
  });
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer
};