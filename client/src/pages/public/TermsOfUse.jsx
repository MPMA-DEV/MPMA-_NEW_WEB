import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaExclamationTriangle, FaBalanceScale, FaGavel, FaUserShield } from 'react-icons/fa';
import './TermsOfUse.css';

const TermsOfUse = () => {
  return (
    <div className="terms-page">
      <section className="terms-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="terms-hero-content"
          >
            <FaFileContract className="terms-hero-icon" />
            <h1>Terms of Use</h1>
            <p>Please read these terms carefully before using our services</p>
            <p className="last-updated">Last Updated: December 30, 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="terms-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="terms-intro"
          >
            <p>
              Welcome to Mahapola Ports & Maritime Academy. By accessing or using our website and services, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <div className="section-icon">
              <FaUserShield />
            </div>
            <h2>1. Acceptance of Terms</h2>
            <div className="section-content">
              <p>
                By accessing and using the Mahapola Ports & Maritime Academy website and services, you accept and agree to be bound by these Terms of Use and our Privacy Policy. These terms apply to all visitors, users, and others who access or use our services.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of our services after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>2. Use of Services</h2>
            <div className="section-content">
              <h3>Eligibility</h3>
              <p>You must be at least 16 years old to register for our courses. By registering, you represent that you meet this age requirement.</p>

              <h3>User Account</h3>
              <p>When creating an account, you agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password confidential and secure</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>

              <h3>Prohibited Activities</h3>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any unlawful purpose or in violation of these terms</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Upload or transmit viruses, malware, or other harmful code</li>
                <li>Collect or harvest information about other users without permission</li>
                <li>Use automated systems to access our services without authorization</li>
                <li>Engage in any activity that could damage our reputation or business</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <div className="section-icon">
              <FaBalanceScale />
            </div>
            <h2>3. Intellectual Property Rights</h2>
            <div className="section-content">
              <h3>Our Content</h3>
              <p>
                All content on our website, including text, graphics, logos, images, videos, audio clips, digital downloads, data compilations, and software, is the property of Mahapola Ports & Maritime Academy or its content suppliers and is protected by intellectual property laws.
              </p>

              <h3>License to Use</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to access and use our website and services for personal, non-commercial purposes. This license does not include:
              </p>
              <ul>
                <li>Resale or commercial use of our services or content</li>
                <li>Collection and use of any product listings, descriptions, or prices</li>
                <li>Derivative use of our services or content</li>
                <li>Downloading or copying of account information for the benefit of another party</li>
                <li>Use of data mining, robots, or similar data gathering tools</li>
              </ul>

              <h3>User Content</h3>
              <p>
                By submitting content (such as applications, feedback, or forum posts) to our website, you grant us a worldwide, royalty-free, perpetual license to use, reproduce, modify, and display such content in connection with our services.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>4. Course Registration and Enrollment</h2>
            <div className="section-content">
              <h3>Application Process</h3>
              <p>
                Course applications are subject to review and approval by the academy. We reserve the right to reject any application at our discretion. Acceptance is not guaranteed upon submission.
              </p>

              <h3>Payment Terms</h3>
              <ul>
                <li>Course fees must be paid according to the payment schedule provided</li>
                <li>All fees are in Sri Lankan Rupees (LKR) unless otherwise stated</li>
                <li>Payment methods and installment options are subject to availability</li>
                <li>Late payments may result in suspension of access to course materials</li>
              </ul>

              <h3>Cancellation and Refunds</h3>
              <ul>
                <li>Cancellations must be submitted in writing to the academy</li>
                <li>Refund eligibility depends on the timing of cancellation relative to course start date</li>
                <li>Cancellations made 30+ days before course start: 90% refund</li>
                <li>Cancellations made 15-29 days before course start: 50% refund</li>
                <li>Cancellations made less than 15 days before course start: No refund</li>
                <li>The academy reserves the right to cancel courses due to insufficient enrollment</li>
              </ul>

              <h3>Course Completion</h3>
              <p>
                Certificates and credentials are awarded upon successful completion of course requirements. Requirements include attendance, assignments, examinations, and any other criteria specified in the course syllabus.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="terms-section warning-section"
          >
            <div className="section-icon warning">
              <FaExclamationTriangle />
            </div>
            <h2>5. Disclaimers and Limitations of Liability</h2>
            <div className="section-content">
              <h3>Service "As Is"</h3>
              <p>
                Our services are provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
              </p>

              <h3>No Guarantee of Results</h3>
              <p>
                While we strive to provide quality education and training, we do not guarantee employment, certification outcomes, or specific career results upon completion of our courses.
              </p>

              <h3>Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Mahapola Ports & Maritime Academy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul>
                <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                <li>Damages resulting from unauthorized access to or use of our servers</li>
                <li>Interruption or cessation of our services</li>
                <li>Errors or omissions in any content</li>
                <li>Any conduct or content of third parties on our services</li>
              </ul>
              <p>
                Our total liability shall not exceed the amount paid by you for the specific course or service in question.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>6. Indemnification</h2>
            <div className="section-content">
              <p>
                You agree to indemnify, defend, and hold harmless Mahapola Ports & Maritime Academy, its officers, directors, employees, agents, and affiliates from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul>
                <li>Your use of our services</li>
                <li>Your violation of these Terms of Use</li>
                <li>Your violation of any rights of another party</li>
                <li>Your conduct in connection with our services</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <div className="section-icon">
              <FaGavel />
            </div>
            <h2>7. Governing Law and Dispute Resolution</h2>
            <div className="section-content">
              <h3>Governing Law</h3>
              <p>
                These Terms of Use shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
              </p>

              <h3>Dispute Resolution</h3>
              <p>
                Any disputes arising out of or relating to these terms shall first be resolved through good-faith negotiations. If negotiations fail, disputes shall be resolved through arbitration in Colombo, Sri Lanka, in accordance with the Arbitration Act.
              </p>

              <h3>Class Action Waiver</h3>
              <p>
                You agree to resolve disputes with us on an individual basis and waive any right to participate in class actions or class-wide arbitration.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>8. Termination</h2>
            <div className="section-content">
              <p>
                We reserve the right to suspend or terminate your account and access to our services at any time, with or without notice, for any reason, including:
              </p>
              <ul>
                <li>Violation of these Terms of Use</li>
                <li>Fraudulent or illegal activities</li>
                <li>Requests by law enforcement or government agencies</li>
                <li>Discontinuation or material modification of our services</li>
              </ul>
              <p>
                Upon termination, your right to use our services will immediately cease. Provisions that should reasonably survive termination (such as indemnification, disclaimers, and limitations of liability) will continue to apply.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>9. Third-Party Links</h2>
            <div className="section-content">
              <p>
                Our website may contain links to third-party websites or services that are not owned or controlled by Mahapola Ports & Maritime Academy. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p>
                You acknowledge and agree that we shall not be liable for any damage or loss caused by your use of any third-party content, goods, or services available through such websites.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>10. Severability</h2>
            <div className="section-content">
              <p>
                If any provision of these Terms of Use is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            viewport={{ once: true }}
            className="terms-section"
          >
            <h2>11. Entire Agreement</h2>
            <div className="section-content">
              <p>
                These Terms of Use, together with our Privacy Policy and any other legal notices published by us on our website, constitute the entire agreement between you and Mahapola Ports & Maritime Academy regarding the use of our services.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="terms-section contact-section"
          >
            <h2>12. Contact Information</h2>
            <div className="section-content">
              <p>If you have any questions about these Terms of Use, please contact us:</p>
              <div className="contact-info">
                <p><strong>Mahapola Ports & Maritime Academy</strong></p>
                <p>Email: <a href="mailto:legal@mahapola.edu">legal@mahapola.edu</a></p>
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

export default TermsOfUse;
