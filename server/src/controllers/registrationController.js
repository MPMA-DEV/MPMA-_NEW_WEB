// ============================================
// REGISTRATION CONTROLLER
// Handles student course registrations
// ============================================

const { pool } = require('../config/database');
const { sendEmail } = require('../config/email');
const { registrationConfirmationEmail, adminNotificationEmail } = require('../utils/emailTemplates');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate unique registration number
const generateRegistrationNumber = async () => {
    const year = new Date().getFullYear();
    const prefix = `REG${year}`;
    
    // Get last registration number for current year
    const [result] = await pool.query(
        `SELECT registration_number FROM registrations 
         WHERE registration_number LIKE ? 
         ORDER BY registration_id DESC LIMIT 1`,
        [`${prefix}%`]
    );
    
    let nextNumber = 1;
    if (result.length > 0) {
        const lastNumber = parseInt(result[0].registration_number.slice(-4));
        nextNumber = lastNumber + 1;
    }
    
    return `${prefix}${String(nextNumber).padStart(4, '0')}`;
};

// @desc    Create new student registration
// @route   POST /api/registrations
// @access  Public
const createRegistration = asyncHandler(async (req, res) => {
    const {
        full_name,
        name_with_initials,
        date_of_birth,
        gender,
        nationality,
        nic_number,
        passport_number,
        email,
        phone_mobile,
        phone_home,
        address_line1,
        address_line2,
        city,
        postal_code,
        course_id,
        preferred_start_date,
        highest_qualification,
        institution_name,
        year_of_completion,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_relationship,
        previous_maritime_experience,
        additional_notes
    } = req.body;
    
    // Check if NIC already registered
    const [existingNIC] = await pool.query(
        'SELECT registration_id FROM registrations WHERE nic_number = ?',
        [nic_number]
    );
    
    if (existingNIC.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'This NIC number is already registered'
        });
    }
    
    // Check if email already registered
    const [existingEmail] = await pool.query(
        'SELECT registration_id FROM registrations WHERE email = ?',
        [email]
    );
    
    if (existingEmail.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'This email is already registered'
        });
    }
    
    // Get course details
    const [courses] = await pool.query(
        'SELECT course_name, fee FROM courses WHERE course_id = ? AND is_active = TRUE',
        [course_id]
    );
    
    if (courses.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Selected course not found or inactive'
        });
    }
    
    const course = courses[0];
    
    // Generate registration number
    const registration_number = await generateRegistrationNumber();
    
    // Insert registration
    const [result] = await pool.query(
        `INSERT INTO registrations (
            registration_number, full_name, name_with_initials, date_of_birth, gender,
            nationality, nic_number, passport_number, email, phone_mobile, phone_home,
            address_line1, address_line2, city, postal_code, course_id, preferred_start_date,
            highest_qualification, institution_name, year_of_completion,
            emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
            previous_maritime_experience, additional_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            registration_number, full_name, name_with_initials, date_of_birth, gender,
            nationality, nic_number, passport_number, email, phone_mobile, phone_home,
            address_line1, address_line2, city, postal_code, course_id, preferred_start_date,
            highest_qualification, institution_name, year_of_completion,
            emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
            previous_maritime_experience, additional_notes
        ]
    );
    
    // Update course enrollment count
    await pool.query(
        'UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE course_id = ?',
        [course_id]
    );
    
    // Prepare email data
    const emailData = {
        registration_number,
        full_name,
        email,
        phone_mobile,
        course_name: course.course_name,
        date_of_birth,
        address_line1,
        city,
        nic_number,
        emergency_contact_name,
        emergency_contact_phone
    };
    
    // Send confirmation email to student
    await sendEmail({
        to: email,
        subject: `Registration Confirmation - ${registration_number}`,
        html: registrationConfirmationEmail(emailData)
    });
    
    // Send notification email to admin
    await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Registration - ${registration_number}`,
        html: adminNotificationEmail(emailData)
    });
    
    res.status(201).json({
        success: true,
        message: 'Registration submitted successfully! Check your email for confirmation.',
        data: {
            registration_number,
            registration_id: result.insertId
        }
    });
});

// @desc    Get registration by registration number
// @route   GET /api/registrations/:registrationNumber
// @access  Public
const getRegistrationByNumber = asyncHandler(async (req, res) => {
    const { registrationNumber } = req.params;
    
    const [registrations] = await pool.query(
        `SELECT r.*, c.course_name, c.course_code, c.duration, c.fee
         FROM registrations r
         JOIN courses c ON r.course_id = c.course_id
         WHERE r.registration_number = ?`,
        [registrationNumber]
    );
    
    if (registrations.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Registration not found'
        });
    }
    
    res.json({
        success: true,
        data: registrations[0]
    });
});

// @desc    Get all registrations (Admin)
// @route   GET /api/registrations
// @access  Private/Admin
const getAllRegistrations = asyncHandler(async (req, res) => {
    const { status, course_id, search, page = 1, limit = 10 } = req.query;
    
    let query = `
        SELECT r.*, c.course_name, c.course_code
        FROM registrations r
        JOIN courses c ON r.course_id = c.course_id
        WHERE 1=1
    `;
    const params = [];
    
    // Filter by status
    if (status) {
        query += ' AND r.status = ?';
        params.push(status);
    }
    
    // Filter by course
    if (course_id) {
        query += ' AND r.course_id = ?';
        params.push(course_id);
    }
    
    // Search by name, email, or registration number
    if (search) {
        query += ' AND (r.full_name LIKE ? OR r.email LIKE ? OR r.registration_number LIKE ?)';
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
    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Get registrations
    const [registrations] = await pool.query(query, params);
    
    res.json({
        success: true,
        data: {
            registrations,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// @desc    Update registration status (Admin)
// @route   PATCH /api/registrations/:id/status
// @access  Private/Admin
const updateRegistrationStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;
    
    const validStatuses = ['pending', 'reviewed', 'approved', 'rejected', 'enrolled'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status value'
        });
    }
    
    await pool.query(
        `UPDATE registrations 
         SET status = ?, reviewed_by = ?, reviewed_at = NOW(), additional_notes = ?
         WHERE registration_id = ?`,
        [status, req.admin.admin_id, remarks, id]
    );
    
    // Log activity
    await pool.query(
        `INSERT INTO activity_logs (admin_id, action, table_name, record_id, description)
         VALUES (?, 'update_registration_status', 'registrations', ?, ?)`,
        [req.admin.admin_id, id, `Changed status to ${status}`]
    );
    
    res.json({
        success: true,
        message: 'Registration status updated successfully'
    });
});

module.exports = {
    createRegistration,
    getRegistrationByNumber,
    getAllRegistrations,
    updateRegistrationStatus
};