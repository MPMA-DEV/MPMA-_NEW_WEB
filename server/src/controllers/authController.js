// ============================================
// AUTHENTICATION CONTROLLER
// Handles admin login, logout, and authentication
// ============================================

const { pool } = require('../config/database');
const { comparePassword } = require('../utils/passwordHash');
const { generateAccessToken, storeSession, invalidateSession } = require('../utils/tokenGenerator');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    // Find admin by username
    const [admins] = await pool.query(
        'SELECT * FROM admins WHERE username = ? AND is_active = TRUE',
        [username]
    );
    
    if (admins.length === 0) {
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
    
    const admin = admins[0];
    
    // Verify password
    const isPasswordValid = await comparePassword(password, admin.password_hash);
    
    if (!isPasswordValid) {
        // Log failed login attempt
        await pool.query(
            `INSERT INTO activity_logs (admin_id, action, description, ip_address)
             VALUES (?, 'failed_login', 'Failed login attempt', ?)`,
            [admin.admin_id, req.ip]
        );
        
        return res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
    
    // Generate JWT token
    const token = generateAccessToken({
        admin_id: admin.admin_id,
        username: admin.username,
        role: admin.role
    });
    
    // Store session in database
    await storeSession(admin.admin_id, token, req);
    
    // Update last login
    await pool.query(
        'UPDATE admins SET last_login = NOW() WHERE admin_id = ?',
        [admin.admin_id]
    );
    
    // Log successful login
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, description, ip_address)
         VALUES (?, 'login', 'Successful login', ?)`,
        [admin.admin_id, req.ip]
    );
    
    // Send response
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            admin: {
                admin_id: admin.admin_id,
                username: admin.username,
                email: admin.email,
                full_name: admin.full_name,
                role: admin.role
            }
        }
    });
});

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Private
const adminLogout = asyncHandler(async (req, res) => {
    // Invalidate session
    await invalidateSession(req.token);
    
    // Log logout
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, description, ip_address)
         VALUES (?, 'logout', 'User logged out', ?)`,
        [req.admin.admin_id, req.ip]
    );
    
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
    const [admins] = await pool.query(
        `SELECT admin_id, username, email, full_name, role, last_login, created_at
         FROM admins WHERE admin_id = ?`,
        [req.admin.admin_id]
    );
    
    res.json({
        success: true,
        data: admins[0]
    });
});

module.exports = {
    adminLogin,
    adminLogout,
    getAdminProfile
};