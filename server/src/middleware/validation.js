// ============================================
// INPUT VALIDATION MIDDLEWARE
// Validates and sanitizes user input data
// ============================================

const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Format error messages
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    
    next();
};

// Validation rules for student registration
const validateRegistration = [
    // Personal Information
    body('full_name')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    
    body('date_of_birth')
        .notEmpty().withMessage('Date of birth is required')
        .isDate().withMessage('Invalid date format'),
    
    body('gender')
        .notEmpty().withMessage('Gender is required')
        .isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),
    
    body('nic_number')
        .trim()
        .notEmpty().withMessage('NIC number is required')
        .matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/).withMessage('Invalid NIC format'),
    
    // Contact Information
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    
    body('phone_mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
    
    body('address_line1')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ max: 255 }).withMessage('Address too long'),
    
    body('city')
        .trim()
        .notEmpty().withMessage('City is required'),
    
    // Course Selection
    body('course_id')
        .notEmpty().withMessage('Please select a course')
        .isInt().withMessage('Invalid course selection'),
    
    // Emergency Contact
    body('emergency_contact_name')
        .trim()
        .notEmpty().withMessage('Emergency contact name is required'),
    
    body('emergency_contact_phone')
        .trim()
        .notEmpty().withMessage('Emergency contact phone is required')
        .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
    
    handleValidationErrors
];

// Validation rules for contact form
const validateContactForm = [
    body('full_name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 5, max: 255 }).withMessage('Subject must be between 5 and 255 characters'),
    
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    
    handleValidationErrors
];

// Validation rules for admin login
const validateAdminLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    handleValidationErrors
];

// Validation rules for creating course
const validateCourse = [
    body('course_code')
        .trim()
        .notEmpty().withMessage('Course code is required')
        .isLength({ max: 50 }).withMessage('Course code too long'),
    
    body('course_name')
        .trim()
        .notEmpty().withMessage('Course name is required')
        .isLength({ min: 3, max: 255 }).withMessage('Course name must be between 3 and 255 characters'),
    
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required'),
    
    body('duration')
        .trim()
        .notEmpty().withMessage('Duration is required'),
    
    body('fee')
        .optional()
        .isFloat({ min: 0 }).withMessage('Fee must be a positive number'),
    
    handleValidationErrors
];

// Validation rules for creating news/post
const validateNews = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 255 }).withMessage('Title must be between 5 and 255 characters'),
    
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['news', 'event', 'announcement', 'achievement']).withMessage('Invalid category'),
    
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateContactForm,
    validateAdminLogin,
    validateCourse,
    validateNews
};