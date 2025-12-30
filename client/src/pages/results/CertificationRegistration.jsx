import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaUser, FaIdCard, FaEnvelope, FaPhone, FaGraduationCap, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import './Results.css';

const CertificationRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    nicNumber: '',
    studentId: '',
    email: '',
    phone: '',
    courseCompleted: '',
    completionYear: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Certification Registration:', formData);
    setSubmitted(true);
  };

  return (
    <div className="results-page">
      <section className="results-hero certification-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="results-hero-content"
          >
            <FaCertificate className="results-hero-icon" />
            <h1>Certification Registration</h1>
            <p>Apply for your official maritime training certification</p>
          </motion.div>
        </div>
      </section>

      <section className="results-content-section">
        <div className="container">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="results-form-container"
            >
              <div className="form-header">
                <h2>Certification Application</h2>
                <p>Complete the form below to register for your maritime certification</p>
              </div>

              <form onSubmit={handleSubmit} className="results-form">
                <div className="form-row">
                  <div className="form-group">
                    <label><FaUser /> Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaIdCard /> NIC Number *</label>
                    <input
                      type="text"
                      name="nicNumber"
                      value={formData.nicNumber}
                      onChange={handleChange}
                      placeholder="Enter your NIC number"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FaIdCard /> Student ID *</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Enter your student ID"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaCalendarAlt /> Completion Year *</label>
                    <select name="completionYear" value={formData.completionYear} onChange={handleChange} required>
                      <option value="">Select year</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FaEnvelope /> Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label><FaPhone /> Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 XX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label><FaGraduationCap /> Course Completed *</label>
                  <select name="courseCompleted" value={formData.courseCompleted} onChange={handleChange} required>
                    <option value="">Select your course</option>
                    <option value="equipment-operations">Equipment Operations</option>
                    <option value="fire-safety">Fire Safety</option>
                    <option value="maritime-seamanship">Maritime Seamanship</option>
                    <option value="technical-1">Technical Level 1</option>
                    <option value="technical-2">Technical Level 2</option>
                    <option value="management">Management Program</option>
                    <option value="crane-operator">Crane Operator Training</option>
                    <option value="forklift-tug">Forklift & Tug Operations</option>
                    <option value="movers-operators">Movers & Operators</option>
                  </select>
                </div>

                <button type="submit" className="btn-submit">
                  <FaCertificate /> Submit Application
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="success-message"
            >
              <FaCheckCircle className="success-icon" />
              <h2>Application Submitted Successfully!</h2>
              <p>Your certification application has been received. We will contact you via email within 5-7 business days.</p>
              <button onClick={() => setSubmitted(false)} className="btn-back">Submit Another Application</button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificationRegistration;