const {
  getAllTags,
  getTagById,
  getQuestionsByTagName
} = require("../services/tagService");

// Get all tags
const getAll = async (req, res) => {
  try {
    const tags = await getAllTags();

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error("Get all tags error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get one tag by ID
const getOne = async (req, res) => {
  try {
    const tagId = Number(req.params.id);

    if (Number.isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tag ID"
      });
    }

    const tag = await getTagById(tagId);

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error("Get tag error:", error);

    if (error.message === "Tag not found") {
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

// Get questions by tag name
const getByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required"
      });
    }

    const tag = await getQuestionsByTagName(name);

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error("Get questions by tag error:", error);

    if (error.message === "Tag not found") {
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

module.exports = {
  getAll,
  getOne,
  getByName
};