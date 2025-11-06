const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- THIS IS THE FIX ---
// This route is now public and does not require a token.
router.get('/', getPosts);

// Editor & Admin routes
router.post('/', protect, authorize('Admin', 'Editor'), createPost);
router.put('/:id', protect, authorize('Admin', 'Editor'), updatePost);
router.delete('/:id', protect, authorize('Admin', 'Editor'), deletePost);

module.exports = router;

