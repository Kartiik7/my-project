const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Meeting = require('../models/meetingModel'); // Import new model
const connectDB = require('../config/db');

// Load env vars
// FIX: Correct path to look one directory up (from /utils to /backend)
dotenv.config({ path: '../.env' }); 

const seedDatabase = async () => {
    if (process.env.NODE_ENV !== 'development') {
        console.log('Seeding is only for development environment.');
        return;
    }

    try {
        // Connect to DB (required if running as standalone script)
        // If called from server.js, connection might already exist, but this is safer.
        if (mongoose.connection.readyState === 0) {
            await connectDB();
        }

        // Check if users already exist
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded. Skipping.');
            return;
        }

        console.log('Database is empty. Seeding...');

        // Clear existing data (in case of partial seed)
        await User.deleteMany({});
        await Post.deleteMany({});
        await Meeting.deleteMany({});
        console.log('Database cleared.');

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'Admin'
        });

        // Create Editor
        const editor = await User.create({
            name: 'Editor User',
            email: 'editor@example.com',
            password: 'password123',
            role: 'Editor'
        });

        // Create Viewer
        await User.create({
            name: 'Viewer User',
            email: 'viewer@example.com',
            password: 'password123',
            role: 'Viewer'
        });

        // Create posts
        await Post.create({
            title: 'Admin\'s First Post',
            content: 'This post was created by the Admin.',
            author: admin._id
        });
        
        const editorPost = await Post.create({
            title: 'Editor\'s First Post',
            content: 'This post was created by the Editor.',
            author: editor._id
        });

        // Create meetings
        await Meeting.create({
            title: 'Weekly Sync',
            description: 'Team weekly sync meeting.',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            endTime: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000) + (60 * 60 * 1000)), // 1 hour long
            creator: admin._id
        });

        await Meeting.create({
            title: 'Project Kickoff',
            description: 'Kickoff for the new project.',
            startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            endTime: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000)), // 30 min long
            creator: editor._id
        });

        console.log('Database seeded with users, posts, and meetings.');

    } catch (err) {
        console.error('Seed error:', err.message);
    }
};

// This allows running 'node utils/seedDatabase.js' from the command line
if (require.main === module) {
    seedDatabase().then(() => {
        console.log('Seeding complete. Closing connection.');
        mongoose.connection.close();
        process.exit(0);
    });
}

// Export it for use in server.js
module.exports = { seedDatabase };

