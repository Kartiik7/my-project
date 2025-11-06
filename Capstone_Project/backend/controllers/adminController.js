const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a user's role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['Viewer', 'Editor', 'Admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, { role }, {
            new: true,
            runValidators: true
        });
        
        if (!user) {
            return res.status(4404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
