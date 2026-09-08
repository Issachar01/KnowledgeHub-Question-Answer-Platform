// src/controllers/searchController.js
const { searchPlatform } = require("../services/searchService");

const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'q' is required"
      });
    }

    const results = await searchPlatform(q);

    return res.status(200).json({
      success: true,
      query: q,
      data: results
    });
  } catch (error) {
    console.error("Global search error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = { globalSearch };