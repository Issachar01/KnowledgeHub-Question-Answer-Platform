const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} = require("../services/questionService");

const {
  createQuestionSchema,
  updateQuestionSchema
} = require("../validators/questionValidator");

const create = async (req, res, next) => {
  try {
    const validatedData = createQuestionSchema.parse(req.body);

    const userId = req.user.userId;

    const question = await createQuestion(
      userId,
      validatedData
    );

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await getAllQuestions(req.query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const questionId = Number(req.params.id);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const question = await getQuestionById(questionId);

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    if (error.message === "Question not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const questionId = Number(req.params.id);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const validatedData = updateQuestionSchema.parse(req.body);

    const userId = req.user.userId;

    const question = await updateQuestion(
      questionId,
      userId,
      validatedData
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (error.message === "Question not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message ===
      "You are not authorized to update this question"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const questionId = Number(req.params.id);

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const userId = req.user.userId;

    await deleteQuestion(
      questionId,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Question deleted successfully"
    });
  } catch (error) {
    if (error.message === "Question not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message ===
      "You are not authorized to delete this question"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};