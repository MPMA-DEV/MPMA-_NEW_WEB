// ============================================
// EMAIL CONFIGURATION
// This file sets up Nodemailer for sending emails
// ============================================

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter
// This is like setting up your email client
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,        // SMTP server (e.g., smtp.gmail.com)
    port: process.env.EMAIL_PORT,        // SMTP port (587 for TLS)
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,    // Your email address
        pass: process.env.EMAIL_PASSWORD // App-specific password
    },
    tls: {
        rejectUnauthorized: false        // Accept self-signed certificates
    }
});

// Verify email configuration on startup
const verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email service ready');
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        return false;
    }
};

// Function to send email
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,    // Sender address
            to: options.to,                  // Receiver email
            subject: options.subject,        // Email subject
            html: options.html,              // HTML body
            text: options.text || '',        // Plain text version (optional)
            attachments: options.attachments || [] // File attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    transporter,
    verifyEmailConfig,
    sendEmail
};