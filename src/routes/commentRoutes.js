// routes/commentRoutes.js (Branch: feature/comments)
const express = require('express');
const router = express.Router({ mergeParams: true });
const { createComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getComments)
  .post(protect, createComment);

// Mount appropriately:
// app.use('/api/v1/questions/:questionId/comments', commentRouter);
// app.use('/api/v1/answers/:answerId/comments', commentRouter);

module.exports = router;
