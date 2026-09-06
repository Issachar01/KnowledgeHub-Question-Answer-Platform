// routes/adminRoutes.js (Branch: feature/admin-management)
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  toggleUserBlock, 
  deleteInappropriateContent, 
  getPlatformStats 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.patch('/users/:id/block', toggleUserBlock);
router.delete('/content/:type/:id', deleteInappropriateContent);
router.get('/stats', getPlatformStats);

module.exports = router;
