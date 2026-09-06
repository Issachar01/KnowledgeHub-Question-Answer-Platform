// routes/questionQueryRoutes.js (Branch: feature/search-pagination-sorting)
const express = require('express');
const router = express.Router();
const { getFilteredQuestions } = require('../controllers/questionQueryController');

router.get('/questions', getFilteredQuestions);

module.exports = router;
