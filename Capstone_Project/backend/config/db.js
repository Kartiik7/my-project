const mongoose = require('mongoose');
const logger = require('./logger'); // Import the logger

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (err) {
        logger.error('MongoDB Connection Error:', { message: err.message, stack: err.stack });
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
