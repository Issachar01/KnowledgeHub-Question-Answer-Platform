// utils/reputationHelper.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REPUTATION_POINTS = {
  ASK_QUESTION: 5,
  ANSWER_QUESTION: 10,
  UPVOTE_RECEIVED: 2,
  DOWNVOTE_RECEIVED: -1,
  ACCEPTED_ANSWER: 15
};

const updateReputation = async (userId, actionType) => {
  const points = REPUTATION_POINTS[actionType] || 0;
  return await prisma.user.update({
    where: { id: userId },
    data: { reputation: { increment: points } }
  });
};

module.exports = { updateReputation };
