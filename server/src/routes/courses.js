// ============================================
// COURSE ROUTES
// Routes for course management
// ============================================

const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    getCourseByCode,
    getCourseCategories,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validation');
const { authenticateAdmin } = require('../middleware/authentication');
const { uploadImage } = require('../utils/fileUpload');

// Public routes
router.get('/', getAllCourses);
router.get('/categories/all', getCourseCategories);
router.get('/:id', getCourseById);
router.get('/code/:code', getCourseByCode);

// Admin routes (protected)
router.post('/', authenticateAdmin, uploadImage.single('course_image'), validateCourse, createCourse);
router.put('/:id', authenticateAdmin, uploadImage.single('course_image'), validateCourse, updateCourse);
router.delete('/:id', authenticateAdmin, deleteCourse);

module.exports = router;