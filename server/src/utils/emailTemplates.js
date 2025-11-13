// ============================================
// EMAIL TEMPLATES
// HTML email templates for different purposes
// ============================================

// Registration confirmation email to student
const registrationConfirmationEmail = (registrationData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 30px;
            }
            .info-box {
                background: #f0f9ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
            }
            .btn {
                display: inline-block;
                padding: 12px 30px;
                background: #3b82f6;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚢 Mahapola Ports & Maritime Academy</h1>
                <p>Registration Confirmation</p>
            </div>
            <div class="content">
                <h2>Dear ${registrationData.full_name},</h2>
                <p>Thank you for registering with Mahapola Ports & Maritime Academy!</p>
                
                <div class="info-box">
                    <h3>Registration Details:</h3>
                    <p><strong>Registration Number:</strong> ${registrationData.registration_number}</p>
                    <p><strong>Course:</strong> ${registrationData.course_name}</p>
                    <p><strong>Email:</strong> ${registrationData.email}</p>
                    <p><strong>Mobile:</strong> ${registrationData.phone_mobile}</p>
                </div>
                
                <p>Your application is currently under review. Our admissions team will contact you within 3-5 business days.</p>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Keep this email for your records</li>
                    <li>Prepare required documents</li>
                    <li>Wait for our confirmation call</li>
                </ul>
                
                <center>
                    <a href="${process.env.CLIENT_URL}" class="btn">Visit Our Website</a>
                </center>
                
                <p>If you have any questions, please contact us at:</p>
                <p>📧 Email: info@mahapola.lk<br>
                📞 Phone: +94 11 234 5678</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Mahapola Ports & Maritime Academy. All rights reserved.</p>
                <p>Colombo, Sri Lanka</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Registration notification email to admin
const adminNotificationEmail = (registrationData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a8a; color: white; padding: 20px; }
            .content { padding: 20px; background: #f9fafb; }
            .details { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔔 New Student Registration</h2>
            </div>
            <div class="content">
                <h3>New registration received!</h3>
                <div class="details">
                    <p><strong>Registration Number:</strong> ${registrationData.registration_number}</p>
                    <p><strong>Name:</strong> ${registrationData.full_name}</p>
                    <p><strong>Email:</strong> ${registrationData.email}</p>
                    <p><strong>Phone:</strong> ${registrationData.phone_mobile}</p>
                    <p><strong>NIC:</strong> ${registrationData.nic_number}</p>
                    <p><strong>Course:</strong> ${registrationData.course_name}</p>
                    <p><strong>Date of Birth:</strong> ${registrationData.date_of_birth}</p>
                    <p><strong>Address:</strong> ${registrationData.address_line1}, ${registrationData.city}</p>
                    <p><strong>Emergency Contact:</strong> ${registrationData.emergency_contact_name} - ${registrationData.emergency_contact_phone}</p>
                </div>
                <p><strong>Action Required:</strong> Please review this application in the admin panel.</p>
                <p><a href="${process.env.CLIENT_URL}/${process.env.ADMIN_SECRET_PATH}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Go to Admin Panel</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Contact form submission email
const contactFormEmail = (contactData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a8a; color: white; padding: 20px; }
            .content { padding: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>📨 New Contact Form Submission</h2>
            </div>
            <div class="content">
                <p><strong>From:</strong> ${contactData.full_name}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${contactData.subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${contactData.message}</p>
                <hr>
                <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    registrationConfirmationEmail,
    adminNotificationEmail,
    contactFormEmail
};