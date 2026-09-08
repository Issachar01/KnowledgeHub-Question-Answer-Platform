// src/services/answerService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationService');
const { updateReputation, REPUTATION_RULES } = require('./reputationService');

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

  // Award reputation for posting an answer
  await updateReputation(authorId, REPUTATION_RULES.POST_ANSWER);

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

const toggleAcceptAnswer = async (answerId, userId) => {
  const answer = await prisma.answer.findUnique({
    where: { id: parseInt(answerId) },
    include: { question: true }
  });

  if (!answer) {
    throw new Error('Answer not found');
  }

  if (answer.question.authorId !== userId) {
    throw new Error('Only the question author can accept an answer');
  }

  const newStatus = !answer.isAccepted;

  const updatedAnswer = await prisma.answer.update({
    where: { id: parseInt(answerId) },
    data: { isAccepted: newStatus }
  });

  const repChange = newStatus ? REPUTATION_RULES.ACCEPTED_ANSWER : REPUTATION_RULES.ACCEPTANCE_REVOKED;
  await updateReputation(answer.authorId, repChange);

  return updatedAnswer;
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  toggleAcceptAnswer
};