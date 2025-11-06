const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../config/logger'); // Import the logger

// 1. Protect Routes (Check for valid token)
exports.protect = async (req, res, next) => {
    let token;

    // 1. Read the access token from the httpOnly cookie
    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        next();
    } catch (err) {
        logger.warn(`Token verification failed: ${err.message}`, { token });
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// 2. Authorize Routes (Check user role)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            // This is the required authorization denial log
            logger.warn(`Authorization Failed: User '${req.user?.email}' (Role: ${req.user?.role}) tried to access protected route: ${req.originalUrl}`, {
                userId: req.user?._id,
                role: req.user?.role,
                requiredRoles: roles,
                route: req.originalUrl
            });
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

