const Meeting = require('../models/meetingModel');

// @desc    Get all meetings
// @route   GET /api/meetings
exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().populate('creator', 'name email');
        res.json({ success: true, count: meetings.length, data: meetings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a meeting
// @route   POST /api/meetings
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, startTime, endTime } = req.body;
        const meeting = await Meeting.create({
            title,
            description,
            startTime,
            endTime,
            creator: req.user.id
        });
        res.status(201).json({ success: true, data: meeting });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a meeting
// @route   PUT /api/meetings/:id
exports.updateMeeting = async (req, res) => {
    try {
        let meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }
        
        // --- OWNERSHIP CHECK ---
        if (req.user.role === 'Editor' && meeting.creator.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not authorized to update this meeting' 
            });
        }

        meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, data: meeting });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found' });
        }

        // --- OWNERSHIP CHECK ---
        if (req.user.role === 'Editor' && meeting.creator.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'User is not authorized to delete this meeting' 
            });
        }
        
        await meeting.deleteOne();
        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
