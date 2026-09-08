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

const create = async (req, res) => {
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
    console.error("Create question error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getAll = async (req, res) => {
  try {
    const questions = await getAllQuestions();

    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error("Get all questions error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getOne = async (req, res) => {
  try {
    const questionId = Number(req.params.id);

    if (Number.isNaN(questionId)) {
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
    console.error("Get question error:", error);

    if (error.message === "Question not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const update = async (req, res) => {
  try {
    const questionId = Number(req.params.id);

    if (Number.isNaN(questionId)) {
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
    console.error("Update question error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (
      error.message === "Question not found" ||
      error.message ===
        "You are not authorized to update this question"
    ) {
      return res.status(
        error.message === "Question not found" ? 404 : 403
      ).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const remove = async (req, res) => {
  try {
    const questionId = Number(req.params.id);

    if (Number.isNaN(questionId)) {
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
    console.error("Delete question error:", error);

    if (
      error.message === "Question not found" ||
      error.message ===
        "You are not authorized to delete this question"
    ) {
      return res.status(
        error.message === "Question not found" ? 404 : 403
      ).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
};