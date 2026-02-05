import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaComments, FaPaperPlane, FaHeadset, FaGlobe } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:info@mahapola-maritime.lk?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  // Floating communication icons
  const floatingIcons = [
    { Icon: FaComments, delay: 0, duration: 7, x: '8%', startY: '15%' },
    { Icon: FaPaperPlane, delay: 1, duration: 8, x: '88%', startY: '25%' },
    { Icon: FaHeadset, delay: 1.5, duration: 6.5, x: '15%', startY: '65%' },
    { Icon: FaGlobe, delay: 0.5, duration: 7.5, x: '85%', startY: '70%' },
    { Icon: FaEnvelope, delay: 2, duration: 8.5, x: '92%', startY: '45%' },
    { Icon: FaPhone, delay: 2.5, duration: 7, x: '12%', startY: '85%' },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        {/* Bubble Animation */}
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="contact-hero-content">
          <h1 className="hero-title">Get In Touch</h1>
          <p className="hero-subtitle">
            We're here to help and answer any questions you might have
          </p>
        </div>
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Contact Content Section */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-modern-grid">
            {/* Contact Information Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="contact-info-wrapper"
            >
              <div className="section-header">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="section-title"
                >
                  Let's Connect
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="section-description"
                >
                  Reach out to us through any of the following channels
                </motion.p>
              </div>

              <div className="info-cards-grid">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="info-card"
                >
                  <div className="info-card-icon address-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-card-content">
                    <h4>Visit Us</h4>
                    <p>5th Floor, 507, De-La Salle Street,<br />Colombo 15, Sri Lanka</p>
                  </div>
                  <div className="info-card-shine"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="info-card"
                >
                  <div className="info-card-icon phone-icon">
                    <FaPhone />
                  </div>
                  <div className="info-card-content">
                    <h4>Call Us</h4>
                    <p>+94 11 25 22 452<br />+94 11 25 23 268</p>
                  </div>
                  <div className="info-card-shine"></div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="info-card"
                >
                  <div className="info-card-icon email-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-card-content">
                    <h4>Email Us</h4>
                    <p>info@mahapola-maritime.lk<br />admissions@mahapola-maritime.lk</p>
                  </div>
                  <div className="info-card-shine"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="contact-form-wrapper"
            >
              <div className="form-container">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="form-title"
                >
                  Send a Message
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="form-subtitle"
                >
                  Fill out the form below and we'll get back to you shortly
                </motion.p>

                <form onSubmit={handleSubmit} className="modern-contact-form">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="form-group"
                  >
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="form-group"
                  >
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="form-group"
                  >
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="form-group"
                  >
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows="6"
                      required
                    ></textarea>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="submit-button"
                  >
                    <span>Send Message</span>
                    <FaPaperPlane />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;