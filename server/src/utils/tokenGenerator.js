// ============================================
// JWT TOKEN GENERATOR
// Generates and manages JWT tokens
// ============================================

const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate access token
const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '5m' }
    );
};

// Generate refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
};

// Store session in database
const storeSession = async (adminId, token, req) => {
    try {
        // Calculate expiration time (5 minutes from now)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        
        // Get client info
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        // Insert session into database
        await pool.query(
            `INSERT INTO admin_sessions (admin_id, token, ip_address, user_agent, expires_at)
             VALUES (?, ?, ?, ?, ?)`,
            [adminId, token, ipAddress, userAgent, expiresAt]
        );
        
        return true;
    } catch (error) {
        console.error('Session storage error:', error);
        return false;
    }
};

// Invalidate session
const invalidateSession = async (token) => {
    try {
        await pool.query(
            'UPDATE admin_sessions SET is_active = FALSE WHERE token = ?',
            [token]
        );
        return true;
    } catch (error) {
        console.error('Session invalidation error:', error);
        return false;
    }
};

// Clean expired sessions (run periodically)
const cleanExpiredSessions = async () => {
    try {
        await pool.query(
            'DELETE FROM admin_sessions WHERE expires_at < NOW()'
        );
    } catch (error) {
        console.error('Session cleanup error:', error);
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    storeSession,
    invalidateSession,
    cleanExpiredSessions
};