const { body, validationResult } = require('express-validator');

// Helper to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Validation rules for user registration
exports.validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.'),
    
    body('email')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    
    handleValidationErrors
];

// Validation rules for user login
exports.validateLogin = [
    body('email')
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required.'),
    
    handleValidationErrors
];