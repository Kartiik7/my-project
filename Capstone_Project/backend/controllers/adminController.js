// kartiik7/my-project/my-project-main/Capstone_Project/backend/controllers/adminController.js

const User = require('../models/userModel');
// 1. Import the Firebase Admin SDK
const admin = require('../firebaseAdmin');

// Get the Firestore DB instance
const db = admin.firestore();

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
    // ... (no changes here)
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
        
        // 2. This updates MongoDB
        const user = await User.findByIdAndUpdate(req.params.id, { role }, {
            new: true,
            runValidators: true
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 3. ADD THIS: Update Firestore as well
        // The user ID in Mongo is the same as the user UID in Firebase/Firestore
        try {
            const userDocRef = db.collection('users').doc(user._id.toString());
            await userDocRef.update({ role: role });
        } catch (firestoreError) {
            // Log the error, but don't fail the whole request
            // You might want to handle this more robustly
            console.error("Failed to sync role to Firestore:", firestoreError);
        }
        
        res.json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};