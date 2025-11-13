// ============================================
// NEWS & EVENTS ROUTES
// Routes for news and events management
// ============================================

const express = require('express');
const router = express.Router();
const {
    getAllNews,
    getNewsBySlug,
    getLatestNews,
    getAllNewsAdmin,
    createNews,
    updateNews,
    deleteNews
} = require('../controllers/newsController');
const { validateNews } = require('../middleware/validation');
const { authenticateAdmin } = require('../middleware/authentication');
const { uploadImage } = require('../utils/fileUpload');

// Public routes
router.get('/', getAllNews);
router.get('/latest/:count', getLatestNews);
router.get('/:slug', getNewsBySlug);

// Admin routes (protected)
router.get('/admin/all', authenticateAdmin, getAllNewsAdmin);
router.post('/', authenticateAdmin, uploadImage.single('featured_image'), validateNews, createNews);
router.put('/:id', authenticateAdmin, uploadImage.single('featured_image'), validateNews, updateNews);
router.delete('/:id', authenticateAdmin, deleteNews);

module.exports = router;