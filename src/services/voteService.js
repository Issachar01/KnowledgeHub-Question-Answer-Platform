// src/services/voteService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { notifyVoteCast } = require('./notificationService');

const castVote = async (userId, targetType, targetId, voteType) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedTargetId = parseInt(targetId, 10);

  let targetAuthorId;
  let whereUnique;
  let dataFields;

  if (targetType === 'QUESTION') {
    const question = await prisma.question.findUnique({
      where: { id: parsedTargetId },
      select: { authorId: true }
    });
    if (!question) throw new Error('Question not found');
    targetAuthorId = question.authorId;
    whereUnique = { userId_questionId: { userId: parsedUserId, questionId: parsedTargetId } };
    dataFields = { questionId: parsedTargetId, answerId: null };
  } else if (targetType === 'ANSWER') {
    const answer = await prisma.answer.findUnique({
      where: { id: parsedTargetId },
      select: { authorId: true }
    });
    if (!answer) throw new Error('Answer not found');
    targetAuthorId = answer.authorId;
    whereUnique = { userId_answerId: { userId: parsedUserId, answerId: parsedTargetId } };
    dataFields = { questionId: null, answerId: parsedTargetId };
  } else {
    throw new Error('Invalid target type');
  }

  // Prevent users from voting on their own content
  if (targetAuthorId === parsedUserId) {
    throw new Error('You cannot vote on your own content');
  }

  // Check for existing vote
  const existingVote = await prisma.vote.findFirst({
    where: {
      userId: parsedUserId,
      ...dataFields
    }
  });

  let reputationChange = 0;
  const repWeight = voteType === 'UPVOTE' ? 10 : -2;

  if (existingVote) {
    if (existingVote.type === voteType) {
      // Toggle off (remove vote)
      await prisma.vote.delete({ where: { id: existingVote.id } });
      reputationChange = existingVote.type === 'UPVOTE' ? -10 : 2;
      
      // Update author reputation
      await prisma.user.update({
        where: { id: targetAuthorId },
        data: { reputation: { increment: reputationChange } }
      });

      return { message: 'Vote removed successfully', action: 'DELETED' };
    } else {
      // Switch vote type (e.g., UPVOTE to DOWNVOTE)
      const updated = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType }
      });
      
      // Swapping from up to down is a swing of -12, down to up is +12
      reputationChange = voteType === 'UPVOTE' ? 12 : -12;
      await prisma.user.update({
        where: { id: targetAuthorId },
        data: { reputation: { increment: reputationChange } }
      });

      if (voteType === 'UPVOTE') {
        await notifyVoteCast({
          questionId: targetType === 'QUESTION' ? parsedTargetId : null,
          answerId: targetType === 'ANSWER' ? parsedTargetId : null,
          voterId: parsedUserId,
          type: voteType
        });
      }

      return { message: 'Vote updated successfully', action: 'UPDATED', vote: updated };
    }
  }

  // Create new vote
  const newVote = await prisma.vote.create({
    data: {
      type: voteType,
      userId: parsedUserId,
      ...dataFields
    }
  });

  await prisma.user.update({
    where: { id: targetAuthorId },
    data: { reputation: { increment: repWeight } }
  });

  if (voteType === 'UPVOTE') {
    await notifyVoteCast({
      questionId: targetType === 'QUESTION' ? parsedTargetId : null,
      answerId: targetType === 'ANSWER' ? parsedTargetId : null,
      voterId: parsedUserId,
      type: voteType
    });
  }

  return { message: 'Vote recorded successfully', action: 'CREATED', vote: newVote };
};

const getUserReputationProfile = async (userId) => {
  const parsedUserId = parseInt(userId, 10);
  const user = await prisma.user.findUnique({
    where: { id: parsedUserId },
    select: {
      id: true,
      name: true,
      email: true,
      reputation: true,
      createdAt: true
    }
  });

  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  castVote,
  getUserReputationProfile
};