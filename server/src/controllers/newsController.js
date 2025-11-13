// ============================================
// NEWS & EVENTS CONTROLLER
// Handles news posts and events management
// ============================================

const { pool } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { deleteFile } = require('../utils/fileUpload');

// Generate URL-friendly slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// @desc    Get all published news/events
// @route   GET /api/news
// @access  Public
const getAllNews = asyncHandler(async (req, res) => {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query = `
        SELECT news_id, title, slug, excerpt, featured_image, category, 
               event_date, views_count, published_at, created_at
        FROM news_events 
        WHERE is_published = TRUE
    `;
    const params = [];
    
    // Filter by category
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    // Search by title or content
    if (search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }
    
    // Get total count
    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM (${query}) as filtered`,
        params
    );
    const total = countResult[0].total;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get news
    const [news] = await pool.query(query, params);
    
    res.json({
        success: true,
        data: {
            news,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// @desc    Get single news/event by slug
// @route   GET /api/news/:slug
// @access  Public
const getNewsBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    
    const [news] = await pool.query(
        'SELECT * FROM news_events WHERE slug = ? AND is_published = TRUE',
        [slug]
    );
    
    if (news.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'News/Event not found'
        });
    }
    
    // Increment views count
    await pool.query(
        'UPDATE news_events SET views_count = views_count + 1 WHERE news_id = ?',
        [news[0].news_id]
    );
    
    res.json({
        success: true,
        data: news[0]
    });
});

// @desc    Get latest news (for homepage)
// @route   GET /api/news/latest/:count
// @access  Public
const getLatestNews = asyncHandler(async (req, res) => {
    const { count = 5 } = req.params;
    
    const [news] = await pool.query(
        `SELECT news_id, title, slug, excerpt, featured_image, category, published_at
         FROM news_events 
         WHERE is_published = TRUE 
         ORDER BY published_at DESC 
         LIMIT ?`,
        [parseInt(count)]
    );
    
    res.json({
        success: true,
        data: news
    });
});

// @desc    Get all news (Admin - including unpublished)
// @route   GET /api/news/admin/all
// @access  Private/Admin
const getAllNewsAdmin = asyncHandler(async (req, res) => {
    const { category, is_published, search, page = 1, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM news_events WHERE 1=1';
    const params = [];
    
    // Filter by published status
    if (is_published !== undefined) {
        query += ' AND is_published = ?';
        params.push(is_published === 'true');
    }
    
    // Filter by category
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    // Search
    if (search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }
    
    // Get total count
    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM (${query}) as filtered`,
        params
    );
    const total = countResult[0].total;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get news
    const [news] = await pool.query(query, params);
    
    res.json({
        success: true,
        data: {
            news,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// @desc    Create news/event (Admin)
// @route   POST /api/news
// @access  Private/Admin
const createNews = asyncHandler(async (req, res) => {
    const {
        title,
        content,
        excerpt,
        category,
        event_date,
        is_published
    } = req.body;
    
    // Generate slug
    let slug = generateSlug(title);
    
    // Check if slug exists, make it unique
    const [existingSlug] = await pool.query(
        'SELECT news_id FROM news_events WHERE slug = ?',
        [slug]
    );
    
    if (existingSlug.length > 0) {
        slug = `${slug}-${Date.now()}`;
    }
    
    // Handle file upload
    let featured_image = null;
    if (req.file) {
        featured_image = req.file.filename;
    }
    
    // Set published_at if publishing
    const published_at = is_published ? new Date() : null;
    
    // Insert news
    const [result] = await pool.query(
        `INSERT INTO news_events (
            title, slug, content, excerpt, featured_image, category,
            event_date, is_published, published_at, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title, slug, content, excerpt, featured_image, category,
            event_date, is_published, published_at, req.admin.admin_id
        ]
    );
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'create_news', 'news_events', ?, ?)`,
        [req.admin.admin_id, result.insertId, `Created news: ${title}`]
    );
    
    res.status(201).json({
        success: true,
        message: 'News/Event created successfully',
        data: {
            news_id: result.insertId,
            title,
            slug
        }
    });
});

// @desc    Update news/event (Admin)
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        title,
        content,
        excerpt,
        category,
        event_date,
        is_published
    } = req.body;
    
    // Check if news exists
    const [existing] = await pool.query(
        'SELECT featured_image, is_published FROM news_events WHERE news_id = ?',
        [id]
    );
    
    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'News/Event not found'
        });
    }
    
    // Generate new slug if title changed
    let slug = generateSlug(title);
    
    // Handle file upload
    let featured_image = existing[0].featured_image;
    if (req.file) {
        // Delete old image if exists
        if (featured_image) {
            deleteFile(`uploads/news/${featured_image}`);
        }
        featured_image = req.file.filename;
    }
    
    // Update published_at if publishing for the first time
    let published_at = null;
    if (is_published && !existing[0].is_published) {
        published_at = new Date();
    }
    
    // Update news
    const updateQuery = published_at
        ? `UPDATE news_events SET
            title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
            category = ?, event_date = ?, is_published = ?, published_at = ?
           WHERE news_id = ?`
        : `UPDATE news_events SET
            title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
            category = ?, event_date = ?, is_published = ?
           WHERE news_id = ?`;
    
    const updateParams = published_at
        ? [title, slug, content, excerpt, featured_image, category, event_date, is_published, published_at, id]
        : [title, slug, content, excerpt, featured_image, category, event_date, is_published, id];
    
    await pool.query(updateQuery, updateParams);
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'update_news', 'news_events', ?, ?)`,
        [req.admin.admin_id, id, `Updated news: ${title}`]
    );
    
    res.json({
        success: true,
        message: 'News/Event updated successfully'
    });
});

// @desc    Delete news/event (Admin)
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if news exists
    const [existing] = await pool.query(
        'SELECT title, featured_image FROM news_events WHERE news_id = ?',
        [id]
    );
    
    if (existing.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'News/Event not found'
        });
    }
    
    const news = existing[0];
    
    // Delete featured image if exists
    if (news.featured_image) {
        deleteFile(`uploads/news/${news.featured_image}`);
    }
    
    // Delete news
    await pool.query('DELETE FROM news_events WHERE news_id = ?', [id]);
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'delete_news', 'news_events', ?, ?)`,
        [req.admin.admin_id, id, `Deleted news: ${news.title}`]
    );
    
    res.json({
        success: true,
        message: 'News/Event deleted successfully'
    });
});

module.exports = {
    getAllNews,
    getNewsBySlug,
    getLatestNews,
    getAllNewsAdmin,
    createNews,
    updateNews,
    deleteNews
};