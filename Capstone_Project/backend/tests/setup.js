const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');

// 1. Load environment variables from .env file for tests
dotenv.config({ path: '.env' });

let mongoServer;

// Before all tests, create a new in-memory server
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

// After all tests, stop the server and close the connection
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

// Optional: Clear all data between each test
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

