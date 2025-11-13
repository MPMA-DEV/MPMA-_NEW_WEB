// ============================================
// MAIN SERVER FILE
// Entry point for the server application
// ============================================

// Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Import configurations
const { testConnection } = require('./config/database');
const { verifyEmailConfig } = require('./config/email');
const { helmetConfig, hppConfig, apiLimiter } = require('./config/security');
const { createUploadDirs } = require('./utils/fileUpload');
const { cleanExpiredSessions } = require('./utils/tokenGenerator');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { sanitizeRequestBody } = require('./middleware/sanitization');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const newsRoutes = require('./routes/news');
const registrationRoutes = require('./routes/registration');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security headers
app.use(helmetConfig);

// HPP - Prevent HTTP Parameter Pollution
app.use(hppConfig);

// CORS - Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// GENERAL MIDDLEWARE
// ============================================

// Body parser - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression - Compress response bodies
app.use(compression());

// Morgan - HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sanitize request body
app.use(sanitizeRequestBody);

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Must be after all routes
app.use(notFound);

// Global error handler - Must be last
app.use(errorHandler);

// ============================================
// SERVER INITIALIZATION
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        console.log('🔄 Testing database connection...');
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        
        // Verify email configuration
        console.log('🔄 Verifying email configuration...');
        await verifyEmailConfig();
        
        // Create upload directories
        console.log('🔄 Creating upload directories...');
        createUploadDirs();
        
        // Clean expired sessions (run every hour)
        setInterval(cleanExpiredSessions, 60 * 60 * 1000);
        
        // Start server
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════');
            console.log('🚢  MAHAPOLA MARITIME ACADEMY - SERVER');
            console.log('═══════════════════════════════════════════════════════');
            console.log(`🟢  Server running on: http://localhost:${PORT}`);
            console.log(`🌍  Environment: ${process.env.NODE_ENV}`);
            console.log(`📊  API Endpoint: http://localhost:${PORT}/api`);
            console.log(`💾  Database: Connected`);
            console.log(`📧  Email: Configured`);
            console.log('═══════════════════════════════════════════════════════');
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Server startup failed:', error.message);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

// Start the server
startServer();