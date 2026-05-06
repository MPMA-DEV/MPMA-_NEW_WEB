import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMap, FaHome, FaInfoCircle, FaGraduationCap, FaEnvelope, FaNewspaper, FaUserGraduate, FaCertificate } from 'react-icons/fa';
import './SiteMap.css';

const SiteMap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: FaHome,
      links: [
        { name: 'Home', path: '/', description: 'Welcome to Mahapola Ports & Maritime Academy' },
        { name: 'About Us', path: '/about', description: 'Learn about our history, mission, and values' },
        { name: 'Contact Us', path: '/contact', description: 'Get in touch with us' },
        { name: 'News & Events', path: '/news-events', description: 'Latest news and upcoming events' },
      ]
    },
    {
      category: 'Academic Programs',
      icon: FaGraduationCap,
      links: [
        { name: 'Equipment Operations', path: '/courses/equipment-operations', description: 'Port equipment handling and operations' },
        { name: 'Fire Safety', path: '/courses/fire-safety', description: 'Maritime fire safety and prevention' },
        { name: 'Information Systems', path: '/courses/information-systems', description: 'Port information and management systems' },
        { name: 'Management Program', path: '/courses/management', description: 'Port and maritime management' },
        { name: 'Maritime Seamanship', path: '/courses/maritime-seamanship', description: 'Essential maritime skills and navigation' },
        { name: 'Technical Level 1', path: '/courses/technical-1', description: 'Foundation technical training' },
        { name: 'Technical Level 2', path: '/courses/technical-2', description: 'Advanced technical training' },
      ]
    },
    {
      category: 'Specialized Training',
      icon: FaUserGraduate,
      links: [
        { name: 'Gantry Crane Operations', path: '/courses/gantry-crane-operator-training', description: 'Professional gantry crane training' },
        { name: 'Crane Operator Training', path: '/courses/crane-operator-training', description: 'Comprehensive crane operation course' },
        { name: 'Forklift & Tug Operations', path: '/courses/forklift-tug-operations', description: 'Forklift and tug boat operations' },
        { name: 'Movers & Operators', path: '/courses/movers-operators', description: 'Heavy machinery operations' },
      ]
    },
    {
      category: 'Student Services',
      icon: FaCertificate,
      links: [
        { name: 'Course Registration', path: '/registration/personal-information', description: 'Start your application process' },
        { name: 'Certificate Verification', path: '/results/certificate-verification', description: 'Verify your maritime certification' },
        { name: 'External Results', path: '/results/external-results', description: 'Check external examination results' },
        { name: 'Internal Results', path: '/results/internal-results', description: 'View internal assessment results' },
      ]
    },
    {
      category: 'Information',
      icon: FaInfoCircle,
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy', description: 'Our data protection and privacy practices' },
        { name: 'Terms of Use', path: '/terms-of-use', description: 'Terms and conditions for using our services' },
        { name: 'Site Map', path: '/site-map', description: 'Complete navigation guide' },
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <section className="sitemap-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="sitemap-hero-content"
          >
            <FaMap className="sitemap-hero-icon" />
            <h1>Site Map</h1>
            <p>Comprehensive guide to navigate our website</p>
          </motion.div>
        </div>
      </section>

      <section className="sitemap-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sitemap-intro"
          >
            <p>
              Welcome to our site map. Here you'll find links to all pages and sections of the Mahapola Ports & Maritime Academy website. Use this guide to quickly navigate to the information you need.
            </p>
          </motion.div>

          <div className="sitemap-grid">
            {siteStructure.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="sitemap-category"
              >
                <div className="category-header">
                  <div className="category-icon">
                    <section.icon />
                  </div>
                  <h2>{section.category}</h2>
                </div>
                <ul className="category-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.path}>
                        <span className="link-name">{link.name}</span>
                        <span className="link-description">{link.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="sitemap-contact"
          >
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <h2>Need Help Finding Something?</h2>
            <p>If you can't find what you're looking for, please don't hesitate to contact us.</p>
            <Link to="/contact" className="contact-button">
              <FaEnvelope /> Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SiteMap;
