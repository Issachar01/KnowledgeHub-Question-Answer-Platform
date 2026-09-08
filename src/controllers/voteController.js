const voteService = require('../services/voteService');

const castVote = async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;
    const userId = req.user.id || req.user.userId;

    if (!targetType || !targetId || !voteType) {
      return res.status(400).json({ error: 'Missing required vote fields' });
    }

    const result = await voteService.castVote(userId, targetType, targetId, voteType);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Question not found' || error.message === 'Answer not found' || error.message === 'User not found') {
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
  castVote,
  getReputation
};