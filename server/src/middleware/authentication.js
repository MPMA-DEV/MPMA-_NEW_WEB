// ============================================
// AUTHENTICATION MIDDLEWARE
// Verifies JWT tokens and protects routes
// ============================================

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to verify admin authentication
const authenticateAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        // Format: "Bearer <token>"
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if session is still valid in database
        const [sessions] = await pool.query(
            'SELECT * FROM admin_sessions WHERE token = ? AND is_active = TRUE AND expires_at > NOW()',
            [token]
        );

        if (sessions.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
        }

        // Get admin details
        const [admins] = await pool.query(
            'SELECT admin_id, username, email, full_name, role, is_active FROM admins WHERE admin_id = ?',
            [decoded.admin_id]
        );

        if (admins.length === 0 || !admins[0].is_active) {
            return res.status(401).json({
                success: false,
                message: 'Admin account not found or inactive.'
            });
        }

        // Attach admin info to request object
        req.admin = admins[0];
        req.token = token;

        // Continue to next middleware/route handler
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error occurred.'
        });
    }
};

// Middleware to check admin role/permissions
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }

        next();
    };
};

module.exports = {
    authenticateAdmin,
    authorizeRoles
};