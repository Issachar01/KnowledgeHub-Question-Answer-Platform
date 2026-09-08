// src/services/voteService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { notifyVoteCast } = require('./notificationService');
const { updateReputation, REPUTATION_RULES } = require('./reputationService');

const castVote = async (userId, targetType, targetId, voteType) => {
  const parsedUserId = parseInt(userId, 10);
  const parsedTargetId = parseInt(targetId, 10);

  let targetAuthorId;
  let whereUnique;
  let dataFields;
  let upvotePoints;
  let downvotePoints;

  if (targetType === 'QUESTION') {
    const question = await prisma.question.findUnique({
      where: { id: parsedTargetId },
      select: { authorId: true }
    });
    if (!question) throw new Error('Question not found');
    targetAuthorId = question.authorId;
    whereUnique = { userId_questionId: { userId: parsedUserId, questionId: parsedTargetId } };
    dataFields = { questionId: parsedTargetId, answerId: null };
    upvotePoints = REPUTATION_RULES.QUESTION_UPVOTE;
    downvotePoints = REPUTATION_RULES.QUESTION_DOWNVOTE;
  } else if (targetType === 'ANSWER') {
    const answer = await prisma.answer.findUnique({
      where: { id: parsedTargetId },
      select: { authorId: true }
    });
    if (!answer) throw new Error('Answer not found');
    targetAuthorId = answer.authorId;
    whereUnique = { userId_answerId: { userId: parsedUserId, answerId: parsedTargetId } };
    dataFields = { questionId: null, answerId: parsedTargetId };
    upvotePoints = REPUTATION_RULES.ANSWER_UPVOTE;
    downvotePoints = REPUTATION_RULES.ANSWER_DOWNVOTE;
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
  const currentWeight = voteType === 'UPVOTE' ? upvotePoints : downvotePoints;

  if (existingVote) {
    if (existingVote.type === voteType) {
      // Toggle off (remove vote)
      await prisma.vote.delete({ where: { id: existingVote.id } });
      reputationChange = existingVote.type === 'UPVOTE' ? -upvotePoints : -downvotePoints;
      
      await updateReputation(targetAuthorId, reputationChange);

      return { message: 'Vote removed successfully', action: 'DELETED' };
    } else {
      // Switch vote type (e.g., UPVOTE to DOWNVOTE)
      const updated = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: voteType }
      });
      
      // Calculate net difference when swapping vote types
      const oldWeight = existingVote.type === 'UPVOTE' ? upvotePoints : downvotePoints;
      const newWeight = voteType === 'UPVOTE' ? upvotePoints : downvotePoints;
      reputationChange = newWeight - oldWeight;

      await updateReputation(targetAuthorId, reputationChange);

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

  await updateReputation(targetAuthorId, currentWeight);

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