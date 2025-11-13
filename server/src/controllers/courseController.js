// ============================================
// COURSE CONTROLLER
// Handles all course-related operations
// ============================================

const { pool } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { deleteFile } = require('../utils/fileUpload');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = asyncHandler(async (req, res) => {
    const { category, search, is_active = 'true' } = req.query;
    
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    
    // Filter by active status
    if (is_active === 'true') {
        query += ' AND is_active = TRUE';
    }
    
    // Filter by category
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    // Search by course name or code
    if (search) {
        query += ' AND (course_name LIKE ? OR course_code LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [courses] = await pool.query(query, params);
    
    res.json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const [courses] = await pool.query(
        'SELECT * FROM courses WHERE course_id = ?',
        [id]
    );
    
    if (courses.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
    
    res.json({
        success: true,
        data: courses[0]
    });
});

// @desc    Get course by course code
// @route   GET /api/courses/code/:code
// @access  Public
const getCourseByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    const [courses] = await pool.query(
        'SELECT * FROM courses WHERE course_code = ?',
        [code]
    );
    
    if (courses.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
    
    res.json({
        success: true,
        data: courses[0]
    });
});

// @desc    Get all course categories
// @route   GET /api/courses/categories/all
// @access  Public
const getCourseCategories = asyncHandler(async (req, res) => {
    const [categories] = await pool.query(
        'SELECT DISTINCT category FROM courses WHERE is_active = TRUE ORDER BY category'
    );
    
    res.json({
        success: true,
        data: categories.map(cat => cat.category)
    });
});

// @desc    Create new course (Admin)
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const {
        course_code,
        course_name,
        category,
        description,
        duration,
        duration_months,
        eligibility,
        fee
    } = req.body;
    
    // Check if course code already exists
    const [existing] = await pool.query(
        'SELECT course_id FROM courses WHERE course_code = ?',
        [course_code]
    );
    
    if (existing.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Course code already exists'
        });
    }
    
    // Handle file upload
    let course_image = null;
    if (req.file) {
        course_image = req.file.filename;
    }
    
    // Insert course
    const [result] = await pool.query(
        `INSERT INTO courses (
            course_code, course_name, category, description, duration, 
            duration_months, eligibility, fee, course_image, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            course_code, course_name, category, description, duration,
            duration_months, eligibility, fee, course_image, req.admin.admin_id
        ]
    );
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'create_course', 'courses', ?, ?)`,
        [req.admin.admin_id, result.insertId, `Created course: ${course_name}`]
    );
    
    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: {
            course_id: result.insertId,
            course_code,
            course_name
        }
    });
});

// @desc    Update course (Admin)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        course_code,
        course_name,
        category,
        description,
        duration,
        duration_months,
        eligibility,
        fee,
        is_active
    } = req.body;
    
    // Check if course exists
    const [existing] = await pool.query(
        'SELECT course_image FROM courses WHERE course_id = ?',
        [id]
    );
    
    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
    
    // Handle file upload
    let course_image = existing[0].course_image;
    if (req.file) {
        // Delete old image if exists
        if (course_image) {
            deleteFile(`uploads/courses/${course_image}`);
        }
        course_image = req.file.filename;
    }
    
    // Update course
    await pool.query(
        `UPDATE courses SET
            course_code = ?, course_name = ?, category = ?, description = ?,
            duration = ?, duration_months = ?, eligibility = ?, fee = ?,
            course_image = ?, is_active = ?
         WHERE course_id = ?`,
        [
            course_code, course_name, category, description, duration,
            duration_months, eligibility, fee, course_image, is_active, id
        ]
    );
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'update_course', 'courses', ?, ?)`,
        [req.admin.admin_id, id, `Updated course: ${course_name}`]
    );
    
    res.json({
        success: true,
        message: 'Course updated successfully'
    });
});

// @desc    Delete course (Admin)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if course exists
    const [existing] = await pool.query(
        'SELECT course_name, course_image FROM courses WHERE course_id = ?',
        [id]
    );
    
    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
    
    const course = existing[0];
    
    // Check if course has registrations
    const [registrations] = await pool.query(
        'SELECT COUNT(*) as count FROM registrations WHERE course_id = ?',
        [id]
    );
    
    if (registrations[0].count > 0) {
        // Don't delete, just deactivate
        await pool.query(
            'UPDATE courses SET is_active = FALSE WHERE course_id = ?',
            [id]
        );
        
        return res.json({
            success: true,
            message: 'Course deactivated (has existing registrations)'
        });
    }
    
    // Delete course image if exists
    if (course.course_image) {
        deleteFile(`uploads/courses/${course.course_image}`);
    }
    
    // Delete course
    await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'delete_course', 'courses', ?, ?)`,
        [req.admin.admin_id, id, `Deleted course: ${course.course_name}`]
    );
    
    res.json({
        success: true,
        message: 'Course deleted successfully'
    });
});

module.exports = {
    getAllCourses,
    getCourseById,
    getCourseByCode,
    getCourseCategories,
    createCourse,
    updateCourse,
    deleteCourse
};