const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin'); // Import Firebase Admin

// Helper - Sign Access Token (Short-lived)
const signAccessToken = (id, role, userId) => {
    return jwt.sign({ id, role, userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' // Default 15 mins
    });
};

// Helper - Sign Refresh Token (Long-lived)
const signRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' // Default 7 days
    });
};

// Helper - Send tokens via httpOnly cookies
const sendTokenResponse = (user, statusCode, res, firebaseToken) => {
    const accessToken = signAccessToken(user._id, user.role, user._id);
    const refreshToken = signRefreshToken(user._id);

    const accessTokenOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };
    
    const refreshTokenOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Send tokens in cookies
    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    // Send user and firebase token in response body
    res.status(statusCode)
        .json({
            success: true,
            firebaseToken, // Send the Firebase token
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        // Validation is now handled by 'validateRegister' middleware
        const { name, email, password, role } = req.body;
        
        if (await User.findOne({ email })) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already in use' 
            });
        }
        
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Viewer'
        });
        const userResponse = await User.findById(user._id);

        // --- Create Firebase Token ---
        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());
        
        sendTokenResponse(userResponse, 201, res, firebaseToken);

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        // Validation is now handled by 'validateLogin' middleware
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
        
        const userResponse = await User.findById(user._id);

        // --- Create Firebase Token ---
        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());
        
        sendTokenResponse(userResponse, 200, res, firebaseToken);

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Not authorized, no refresh token' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        // Issue new access token
        const accessToken = signAccessToken(user._id, user.role, user._id);
        const accessTokenOptions = {
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };
        res.cookie('accessToken', accessToken, accessTokenOptions);

        // Also issue a new Firebase token for client-side use
        const firebaseToken = await admin.auth().createCustomToken(user._id.toString());

        res.status(200).json({ 
            success: true,
            firebaseToken // Send new Firebase token
        });

    } catch (err) {
        console.error('Refresh Token Error:', err);
        // Clear cookies if refresh token is invalid
        res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
        res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
    // Clear the httpOnly cookies
    res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};


// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    // req.user is set by the 'protect' middleware
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    
    res.status(200).json({
        success: true,
        data: {
            id: req.user._id, 
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};

// @desc    Get a new Firebase custom token for an already logged-in user
// @route   GET /api/auth/me/token
exports.getFirebaseToken = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        const firebaseToken = await admin.auth().createCustomToken(req.user._id.toString());
        res.status(200).json({ success: true, firebaseToken });
    } catch (firebaseError) {
        console.error('Firebase custom token re-creation failed:', firebaseError);
        res.status(500).json({ success: false, message: 'Token generation failed' });
    }
};

