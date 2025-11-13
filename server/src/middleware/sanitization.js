// ============================================
// DATA SANITIZATION MIDDLEWARE
// Cleans and sanitizes user input to prevent XSS attacks
// ============================================

const sanitizeHtml = require('sanitize-html');

// Sanitize HTML content (for rich text editors)
const sanitizeContent = (content) => {
    if (!content) return '';
    
    return sanitizeHtml(content, {
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'strong', 'em', 'u', 's',
            'ul', 'ol', 'li',
            'a', 'img',
            'blockquote', 'pre', 'code'
        ],
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
            'img': ['src', 'alt', 'width', 'height']
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
};

// Remove dangerous characters from strings
const sanitizeString = (str) => {
    if (!str) return '';
    
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onload, etc.)
        .trim();
};

// Middleware to sanitize request body
const sanitizeRequestBody = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // For 'content' fields, use HTML sanitization
                if (key === 'content' || key === 'description' || key === 'message') {
                    req.body[key] = sanitizeContent(req.body[key]);
                } else {
                    // For other fields, use string sanitization
                    req.body[key] = sanitizeString(req.body[key]);
                }
            }
        });
    }
    next();
};

module.exports = {
    sanitizeContent,
    sanitizeString,
    sanitizeRequestBody
};