const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app'); // Our main app file
const { seedDatabase } = require('./utils/seedDatabase');
const logger = require('./config/logger'); // Import the logger

// Load env vars
dotenv.config({ path: '.env' }); // Use .env.txt, but ideally .env

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, async () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    // Connect to database
    await connectDB();
    // Seed the database
    await seedDatabase();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
    // Close server & exit process
    server.close(() => process.exit(1));
});
