const commentService = require('../services/commentService');

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId, answerId } = req.params;
    const authorId = req.user.id || req.user.userId;

    const comment = await commentService.createComment({
      content,
      authorId,
      questionId,
      answerId
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getQuestionComments = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTarget('question', req.params.questionId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnswerComments = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByTarget('answer', req.params.answerId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id || req.user.userId;
    const updatedComment = await commentService.updateComment(req.params.id, content, userId);
    res.json(updatedComment);
  } catch (error) {
    if (error.message === 'Comment not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized to edit this comment' });
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    await commentService.deleteComment(req.params.id, userId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error.message === 'Comment not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized') return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getQuestionComments,
  getAnswerComments,
  updateComment,
  deleteComment
};