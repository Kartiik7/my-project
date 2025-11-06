const express = require('express');
const router = express.Router();
// 1. Importer getMe, refreshToken, and logout
const { 
    register, 
    login, 
    getMe, 
    getFirebaseToken, 
    refreshToken, 
    logout 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// 2. Add new refresh route (does not need 'protect' middleware)
router.post('/refresh', refreshToken);

// 3. Add new logout route
router.post('/logout', logout);

router.get('/me', protect, getMe);
router.get('/me/token', protect, getFirebaseToken);

module.exports = router;
