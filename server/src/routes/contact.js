// ============================================
// CONTACT ROUTES
// Routes for contact form management
// ============================================

const express = require('express');
const router = express.Router();
const {
    submitContactForm,
    getAllContactMessages,
    updateContactStatus,
    deleteContactMessage
} = require('../controllers/contactController');
const { validateContactForm } = require('../middleware/validation');
const { authenticateAdmin } = require('../middleware/authentication');
const { registrationLimiter } = require('../config/security');

// Public routes
router.post('/', registrationLimiter, validateContactForm, submitContactForm);

// Admin routes (protected)
router.get('/', authenticateAdmin, getAllContactMessages);
router.patch('/:id/status', authenticateAdmin, updateContactStatus);
router.delete('/:id', authenticateAdmin, deleteContactMessage);

module.exports = router;