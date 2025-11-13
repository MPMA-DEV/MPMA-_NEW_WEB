// ============================================
// AUTHENTICATION ROUTES
// Routes for admin login/logout
// ============================================

const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout, getAdminProfile } = require('../controllers/authController');
const { validateAdminLogin } = require('../middleware/validation');
const { authenticateAdmin } = require('../middleware/authentication');
const { authLimiter } = require('../config/security');

// Apply rate limiting to auth routes
router.use(authLimiter);

// @route   POST /api/auth/login
router.post('/login', validateAdminLogin, adminLogin);

// @route   POST /api/auth/logout
router.post('/logout', authenticateAdmin, adminLogout);

// @route   GET /api/auth/me
router.get('/me', authenticateAdmin, getAdminProfile);

module.exports = router;