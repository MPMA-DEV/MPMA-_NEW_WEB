// ============================================
// CONTACT CONTROLLER
// Handles contact form submissions
// ============================================

const { pool } = require('../config/database');
const { sendEmail } = require('../config/email');
const { contactFormEmail } = require('../utils/emailTemplates');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { full_name, email, phone, subject, message } = req.body;
    
    // Get client information
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];
    
    // Insert contact message
    const [result] = await pool.query(
        `INSERT INTO contact_messages (full_name, email, phone, subject, message, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [full_name, email, phone, subject, message, ip_address, user_agent]
    );
    
    // Send email notification to admin
    await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form: ${subject}`,
        html: contactFormEmail({ full_name, email, phone, subject, message })
    });
    
    // Send auto-reply to user
    await sendEmail({
        to: email,
        subject: 'Thank you for contacting Mahapola Maritime Academy',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center;">
                    <h2>🚢 Mahapola Ports & Maritime Academy</h2>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h3>Dear ${full_name},</h3>
                    <p>Thank you for contacting us. We have received your message and will respond within 24-48 hours.</p>
                    <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                        <p><strong>Your Message:</strong></p>
                        <p>${message}</p>
                    </div>
                    <p>Best regards,<br>Mahapola Maritime Academy Team</p>
                </div>
            </div>
        `
    });
    
    res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully! We will contact you soon.',
        data: {
            message_id: result.insertId
        }
    });
});

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    
    // Filter by status
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    
    // Search
    if (search) {
        query += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
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
    
    // Get messages
    const [messages] = await pool.query(query, params);
    
    res.json({
        success: true,
        data: {
            messages,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// @desc    Update contact message status (Admin)
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status value'
        });
    }
    
    const updateData = { status };
    
    if (status === 'replied') {
        updateData.replied_by = req.admin.admin_id;
        updateData.replied_at = new Date();
    }
    
    await pool.query(
        `UPDATE contact_messages SET status = ?, replied_by = ?, replied_at = ? WHERE message_id = ?`,
        [status, updateData.replied_by || null, updateData.replied_at || null, id]
    );
    
    res.json({
        success: true,
        message: 'Message status updated successfully'
    });
});

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    await pool.query('DELETE FROM contact_messages WHERE message_id = ?', [id]);
    
    res.json({
        success: true,
        message: 'Message deleted successfully'
    });
});

module.exports = {
    submitContactForm,
    getAllContactMessages,
    updateContactStatus,
    deleteContactMessage
};