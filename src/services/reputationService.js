// src/services/reputationService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REPUTATION_RULES = {
  POST_QUESTION: 2,
  POST_ANSWER: 5,
  QUESTION_UPVOTE: 5,
  QUESTION_DOWNVOTE: -2,
  ANSWER_UPVOTE: 10,
  ANSWER_DOWNVOTE: -2,
  ACCEPTED_ANSWER: 15,
  ACCEPTANCE_REVOKED: -15
};

const updateReputation = async (userId, points) => {
  return await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: { reputation: { increment: points } }
  });
};

module.exports = {
  REPUTATION_RULES,
  updateReputation
};