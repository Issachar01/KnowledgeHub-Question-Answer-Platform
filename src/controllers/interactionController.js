// controllers/interactionController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendEmail } = require('../utils/sendEmail');

const voteItem = async (req, res, next) => {
  try {
    const { id } = req.params; // questionId or answerId
    const { type } = req.body; // UPVOTE or DOWNVOTE
    const userId = req.user.id;
    const isQuestion = req.baseUrl.includes('questions');

    const targetIdField = isQuestion ? 'questionId' : 'answerId';

    // Check existing vote
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        [targetIdField]: id
      }
    });

    let vote;
    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if clicked again
        await prisma.vote.delete({ where: { id: existingVote.id } });
        return res.status(200).json({ success: true, message: 'Vote removed' });
      } else {
        // Update vote type
        vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type }
        });
      }
    } else {
      vote = await prisma.vote.create({
        data: {
          type,
          userId,
          [targetIdField]: id
        }
      });
    }

    // Adjust reputation of content author
    const targetItem = isQuestion 
      ? await prisma.question.findUnique({ where: { id }, select: { authorId: true } })
      : await prisma.answer.findUnique({ where: { id }, select: { authorId: true } });

    if (targetItem) {
      const repChange = type === 'UPVOTE' ? 2 : -1;
      await prisma.user.update({
        where: { id: targetItem.authorId },
        data: { reputation: { increment: repChange } }
      });
    }

    res.status(200).json({ success: true, data: vote });
  } catch (error) {
    next(error);
  }
};

const acceptAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const userId = req.user.id;

    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true, author: true }
    });

    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    if (answer.question.authorId !== userId) {
      return res.status(403).json({ error: 'Only the question author can accept an answer' });
    }

    // Reset previous accepted answer for this question if any
    await prisma.answer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false }
    });

    // Set new accepted answer
    const updatedAnswer = await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true }
    });

    // Reward author with +15 reputation
    await prisma.user.update({
      where: { id: answer.authorId },
      data: { reputation: { increment: 15 } }
    });

    // Send notification email
    if (answer.author.email) {
      await sendEmail({
        email: answer.author.email,
        subject: 'Your Answer Was Accepted!',
        message: `Congratulations ${answer.author.name}, your answer for "${answer.question.title}" was marked as accepted.`
      });
    }

    res.status(200).json({ success: true, data: updatedAnswer });
  } catch (error) {
    next(error);
  }
};

module.exports = { voteItem, acceptAnswer };
