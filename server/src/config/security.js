// ============================================
// SECURITY CONFIGURATION
// Security settings and middleware configuration
// ============================================

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

// Rate limiting configuration
// Prevents brute force attacks by limiting requests
const createRateLimiter = (windowMinutes = 15, maxRequests = 100) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000, // Time window in milliseconds
        max: maxRequests,                     // Maximum requests per window
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: windowMinutes
        },
        standardHeaders: true,   // Return rate limit info in headers
        legacyHeaders: false,    // Disable X-RateLimit headers
        // Skip successful requests (only count failed attempts)
        skipSuccessfulRequests: false
    });
};

// Strict rate limiter for authentication routes
const authLimiter = createRateLimiter(15, 5); // 5 attempts per 15 minutes

// General API rate limiter
const apiLimiter = createRateLimiter(15, 100); // 100 requests per 15 minutes

// Registration form rate limiter
const registrationLimiter = createRateLimiter(60, 3); // 3 submissions per hour

// Helmet security headers configuration
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000,        // 1 year
        includeSubDomains: true, // Apply to all subdomains
        preload: true
    }
});

// HTTP Parameter Pollution protection
const hppConfig = hpp();

module.exports = {
    authLimiter,
    apiLimiter,
    registrationLimiter,
    helmetConfig,
    hppConfig
};