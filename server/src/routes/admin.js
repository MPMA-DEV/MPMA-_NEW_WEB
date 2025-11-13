// ============================================
// ADMIN ROUTES
// Routes for admin-specific operations
// ============================================

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateAdmin, authorizeRoles } = require('../middleware/authentication');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
router.get('/dashboard/stats', authenticateAdmin, asyncHandler(async (req, res) => {
    // Get various statistics
    const [totalCourses] = await pool.query('SELECT COUNT(*) as count FROM courses WHERE is_active = TRUE');
    const [totalRegistrations] = await pool.query('SELECT COUNT(*) as count FROM registrations');
    const [pendingRegistrations] = await pool.query('SELECT COUNT(*) as count FROM registrations WHERE status = "pending"');
    const [totalNews] = await pool.query('SELECT COUNT(*) as count FROM news_events WHERE is_published = TRUE');
    const [newMessages] = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"');
    
    // Get recent registrations
    const [recentRegistrations] = await pool.query(
        `SELECT r.registration_number, r.full_name, r.email, r.status, r.created_at, c.course_name
         FROM registrations r
         JOIN courses c ON r.course_id = c.course_id
         ORDER BY r.created_at DESC
         LIMIT 5`
    );
    
    // Get registration trends (last 7 days)
    const [registrationTrends] = await pool.query(
        `SELECT DATE(created_at) as date, COUNT(*) as count
         FROM registrations
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(created_at)
         ORDER BY date DESC`
    );
    
    res.json({
        success: true,
        data: {
            stats: {
                totalCourses: totalCourses[0].count,
                totalRegistrations: totalRegistrations[0].count,
                pendingRegistrations: pendingRegistrations[0].count,
                totalNews: totalNews[0].count,
                newMessages: newMessages[0].count
            },
            recentRegistrations,
            registrationTrends
        }
    });
}));

// @desc    Get activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin (Super Admin only)
router.get('/logs', authenticateAdmin, authorizeRoles('super_admin'), asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const [logs] = await pool.query(
        `SELECT l.*, a.username, a.full_name
         FROM activity_logs l
         LEFT JOIN admins a ON l.admin_id = a.admin_id
         ORDER BY l.created_at DESC
         LIMIT ? OFFSET ?`,
        [parseInt(limit), parseInt(offset)]
    );
    
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM activity_logs');
    
    res.json({
        success: true,
        data: {
            logs,
            pagination: {
                total: countResult[0].total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(countResult[0].total / limit)
            }
        }
    });
}));

module.exports = router;