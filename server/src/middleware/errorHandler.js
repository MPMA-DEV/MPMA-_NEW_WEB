// ============================================
// ERROR HANDLER MIDDLEWARE
// Centralized error handling for the application
// ============================================

// 404 Not Found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    // Determine status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Log error for debugging
    console.error('Error occurred:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });
    
    // Send error response
    res.status(statusCode).json({
        success: false,
        message: err.message,
        // Only send stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        // Add request details in development
        ...(process.env.NODE_ENV === 'development' && {
            path: req.originalUrl,
            method: req.method
        })
    });
};

// Async error wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    notFound,
    errorHandler,
    asyncHandler
};