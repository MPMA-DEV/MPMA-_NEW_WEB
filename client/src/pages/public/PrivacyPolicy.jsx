import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase, FaCookie, FaEnvelope } from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <section className="privacy-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="privacy-hero-content"
          >
            <FaShieldAlt className="privacy-hero-icon" />
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us</p>
            <p className="last-updated">Last Updated: December 30, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="privacy-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="privacy-intro"
          >
            <p>
              At Mahapola Ports & Maritime Academy, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <div className="section-icon">
              <FaDatabase />
            </div>
            <h2>1. Information We Collect</h2>
            <div className="section-content">
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register for courses or programs</li>
                <li>Submit an application or inquiry</li>
                <li>Contact us via email or contact forms</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or feedback forms</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and contact details (email, phone number, address)</li>
                <li>Date of birth and identification information</li>
                <li>Educational background and qualifications</li>
                <li>Employment history and professional experience</li>
                <li>Payment and billing information</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect certain information, including:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Location data (if permitted)</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <div className="section-icon">
              <FaLock />
            </div>
            <h2>2. How We Use Your Information</h2>
            <div className="section-content">
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Course Registration:</strong> To process applications and enroll students in our training programs</li>
                <li><strong>Communication:</strong> To send important updates, notifications, and respond to inquiries</li>
                <li><strong>Service Improvement:</strong> To enhance our educational services and website functionality</li>
                <li><strong>Marketing:</strong> To send promotional materials and newsletters (with your consent)</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and regulatory requirements</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized access, and ensure data security</li>
                <li><strong>Analytics:</strong> To understand user behavior and improve user experience</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <div className="section-icon">
              <FaUserSecret />
            </div>
            <h2>3. Information Sharing and Disclosure</h2>
            <div className="section-content">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website and delivering our services</li>
                <li><strong>Educational Partners:</strong> With maritime industry partners for internship and employment opportunities (with your consent)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to respond to legal proceedings</li>
                <li><strong>Safety and Protection:</strong> To protect the rights, property, or safety of our academy, students, or others</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <div className="section-icon">
              <FaShieldAlt />
            </div>
            <h2>4. Data Security</h2>
            <div className="section-content">
              <p>We implement appropriate technical and organizational security measures to protect your personal information, including:</p>
              <ul>
                <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                <li>Secure servers and firewalls</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <div className="section-icon">
              <FaCookie />
            </div>
            <h2>5. Cookies and Tracking Technologies</h2>
            <div className="section-content">
              <p>We use cookies and similar tracking technologies to enhance your browsing experience. These include:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                <li><strong>Performance Cookies:</strong> Help us analyze website usage</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences</li>
                <li><strong>Marketing Cookies:</strong> Track your interests for personalized content</li>
              </ul>
              <p>You can control cookie settings through your browser preferences. Disabling cookies may affect website functionality.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <h2>6. Your Rights and Choices</h2>
            <div className="section-content">
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Restriction:</strong> Request restriction of processing your personal information</li>
              </ul>
              <p>To exercise these rights, please contact us at <a href="mailto:privacy@mahapola.edu">privacy@mahapola.edu</a></p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <h2>7. Children's Privacy</h2>
            <div className="section-content">
              <p>
                Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="privacy-section"
          >
            <h2>8. Changes to This Privacy Policy</h2>
            <div className="section-content">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            viewport={{ once: true }}
            className="privacy-section contact-section"
          >
            <div className="section-icon">
              <FaEnvelope />
            </div>
            <h2>9. Contact Us</h2>
            <div className="section-content">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
              <div className="contact-info">
                <p><strong>Mahapola Ports & Maritime Academy</strong></p>
                <p>Email: <a href="mailto:privacy@mahapola.edu">privacy@mahapola.edu</a></p>
                <p>Phone: +94 11 242 1201</p>
                <p>Address: Colombo Port, Sri Lanka</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
