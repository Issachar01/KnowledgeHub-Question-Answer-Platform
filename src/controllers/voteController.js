// src/controllers/voteController.js

const voteService = require('../services/voteService');

const voteOnQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { type } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!type) {
      return res.status(400).json({ error: 'Vote type is required' });
    }

    const result = await voteService.castVote(userId, 'QUESTION', questionId, type);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Question not found' || error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'You cannot vote on your own content') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const voteOnAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { type } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!type) {
      return res.status(400).json({ error: 'Vote type is required' });
    }

    const result = await voteService.castVote(userId, 'ANSWER', answerId, type);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Answer not found' || error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'You cannot vote on your own content') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getReputation = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await voteService.getUserReputationProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  voteOnQuestion,
  voteOnAnswer,
  getReputation
};