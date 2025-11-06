const express = require('express');
const router = express.Router();
const {
    getMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting
} = require('../controllers/meetingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- THIS IS THE FIX ---
// This route is now public and does not require a token.
router.get('/', getMeetings);

// Editor & Admin routes
router.post('/', protect, authorize('Admin', 'Editor'), createMeeting);
router.put('/:id', protect, authorize('Admin', 'Editor'), updateMeeting);
router.delete('/:id', protect, authorize('Admin', 'Editor'), deleteMeeting);

module.exports = router;

