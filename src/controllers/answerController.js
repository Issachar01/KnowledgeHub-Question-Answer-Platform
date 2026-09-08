// src/controllers/answerController.js

const answerService = require("../services/answerService");

const createAnswer = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id || req.user.userId;

    const answer = await answerService.createAnswer(
      questionId,
      content,
      authorId
    );

    res.status(201).json(answer);
  } catch (error) {
    if (error.message === "Question not found") {
      return res.status(404).json({
        error: error.message
      });
    }

    next(error);
  }
};

const getAnswersByQuestion = async (req, res, next) => {
  try {
    const answers = await answerService.getAnswersByQuestion(
      req.params.questionId
    );

    res.json(answers);
  } catch (error) {
    next(error);
  }
};

const updateAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id || req.user.userId;

    const updatedAnswer = await answerService.updateAnswer(
      id,
      content,
      userId
    );

    res.json(updatedAnswer);
  } catch (error) {
    if (error.message === "Answer not found") {
      return res.status(404).json({
        error: error.message
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        error: "Unauthorized to edit this answer"
      });
    }

    next(error);
  }
};

const deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    await answerService.deleteAnswer(id, userId);

    res.json({
      message: "Answer deleted successfully"
    });
  } catch (error) {
    if (error.message === "Answer not found") {
      return res.status(404).json({
        error: error.message
      });
    }

    if (error.message === "Unauthorized") {
      return res.status(403).json({
        error: "Unauthorized to delete this answer"
      });
    }

    next(error);
  }
};

const toggleAcceptAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.user.userId;

    const updatedAnswer = await answerService.toggleAcceptAnswer(id, userId);

    res.json(updatedAnswer);
  } catch (error) {
    if (error.message === "Answer not found") {
      return res.status(404).json({
        error: error.message
      });
    }

    if (error.message.includes("Only the question author") || error.message === "Unauthorized") {
      return res.status(403).json({
        error: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  toggleAcceptAnswer
};