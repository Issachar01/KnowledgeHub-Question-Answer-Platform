const {
  getAllTags,
  getTagById,
  getQuestionsByTagName
} = require("../services/tagService");

const getAll = async (req, res, next) => {
  try {
    const tags = await getAllTags();

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const tagId = Number(req.params.id);

    if (!Number.isInteger(tagId) || tagId <= 0) {
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
    if (error.message === "Tag not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const getByName = async (req, res, next) => {
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
    if (error.message === "Tag not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  getByName
};