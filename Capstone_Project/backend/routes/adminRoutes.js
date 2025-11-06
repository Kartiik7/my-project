const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and require 'Admin' role
router.use(protect, authorize('Admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
