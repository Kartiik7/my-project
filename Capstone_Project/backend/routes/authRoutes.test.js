const request = require('supertest');
const app = require('../app'); // Import your express app
const User = require('../models/userModel');

// We don't need to mock mongoose, 'setup.js' handles the in-memory DB

describe('Auth Routes - /api/auth', () => {

    describe('POST /api/auth/register', () => {
        
        it('should fail validation with a 400 if no data is sent', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors).toBeInstanceOf(Array);
            
            // Check that our validation middleware is working
            const errorMessages = res.body.errors.map(e => e.msg);
            expect(errorMessages).toContain('Name is required.');
            expect(errorMessages).toContain('Please provide a valid email address.');
            expect(errorMessages).toContain('Password must be at least 6 characters long.');
        });

        it('should fail with a 400 if email is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'not-an-email',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.errors[0].msg).toBe('Please provide a valid email address.');
        });

        it('should successfully register a new user with valid data', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            
            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user.name).toBe(userData.name);
            expect(res.body.user.email).toBe(userData.email);
            expect(res.body.user.role).toBe('Viewer');
            expect(res.body.firebaseToken).toBeDefined();

            // Check cookies were set
            expect(res.headers['set-cookie']).toEqual(
                expect.arrayContaining([
                    expect.stringMatching(/accessToken=.+/),
                    expect.stringMatching(/refreshToken=.+/)
                ])
            );

            // Check user was actually saved in the (in-memory) DB
            const userInDb = await User.findOne({ email: userData.email });
            expect(userInDb).toBeDefined();
            expect(userInDb.name).toBe(userData.name);
        });
    });

});
