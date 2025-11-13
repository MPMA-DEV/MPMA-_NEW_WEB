// ============================================
// REGISTRATION ROUTES
// Routes for student registration management
// ============================================

const express = require('express');
const router = express.Router();
const {
    createRegistration,
    getRegistrationByNumber,
    getAllRegistrations,
    updateRegistrationStatus
} = require('../controllers/registrationController');
const { validateRegistration } = require('../middleware/validation');
const { authenticateAdmin } = require('../middleware/authentication');
const { registrationLimiter } = require('../config/security');

// Public routes
router.post('/', registrationLimiter, validateRegistration, createRegistration);
router.get('/:registrationNumber', getRegistrationByNumber);

// Admin routes (protected)
router.get('/', authenticateAdmin, getAllRegistrations);
router.patch('/:id/status', authenticateAdmin, updateRegistrationStatus);

module.exports = router;