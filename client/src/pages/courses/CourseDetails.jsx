// ============================================
// COURSE DETAILS PAGE COMPONENT
// Detailed view of a single course
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaClock,
  FaCalendar,
  FaCertificate,
  FaUsers,
  FaCheckCircle,
  FaBook,
  FaChevronRight,
} from 'react-icons/fa';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import API
import { courseAPI } from '../../utils/api';
import { formatCurrency, formatDuration } from '../../utils/formatters';

import './CourseDetails.css';

const CourseDetails = () => {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseCode]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);

      // Fetch course by code
      const response = await courseAPI.getByCode(courseCode.toUpperCase());

      if (response.success) {
        setCourse(response.data);

        // Fetch related courses from same category
        const relatedResponse = await courseAPI.getAll({
          category: response.data.category,
          limit: 3,
        });

        if (relatedResponse.success) {
          // Filter out current course
          const related = relatedResponse.data.filter(
            (c) => c.course_id !== response.data.course_id
          );
          setRelatedCourses(related);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = () => {
    navigate('/registration/personal-information', {
      state: { selectedCourse: course },
    });
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner size="large" text="Loading course details..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <div className="container">
          <h1>Course Not Found</h1>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses" className="btn btn-primary">
            View All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{course.course_name} - Mahapola Ports & Maritime Academy</title>
        <meta name="description" content={course.description} />
      </Helmet>

      <div className="course-details-page">
        {/* Breadcrumb */}
        <section className="breadcrumb-section">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <FaChevronRight />
              <Link to="/courses">Courses</Link>
              <FaChevronRight />
              <span>{course.course_name}</span>
            </div>
          </div>
        </section>

        {/* Course Hero */}
        <section className="course-hero">
          <div className="container">
            <div className="course-hero-grid">
              <motion.div
                className="course-hero-content"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="course-category-badge">{course.category}</span>
                <h1>{course.course_name}</h1>
                <p className="course-code">Course Code: {course.course_code}</p>
                <p className="course-short-desc">{course.description}</p>

                <div className="course-meta-info">
                  <div className="meta-item">
                    <FaClock />
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-item">
                    <FaUsers />
                    <span>{course.enrollment_count || 0} Enrolled</span>
                  </div>
                  <div className="meta-item">
                    <FaCertificate />
                    <span>Certificate Provided</span>
                  </div>
                </div>

                <div className="course-actions">
                  <button onClick={handleEnrollClick} className="btn btn-primary btn-large">
                    Enroll Now
                  </button>
                  <Link to="/contact" className="btn btn-outline btn-large">
                    Contact Us
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="course-hero-image"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {course.course_image ? (
                  <img
                    src={`${process.env.REACT_APP_UPLOADS_URL}/courses/${course.course_image}`}
                    alt={course.course_name}
                  />
                ) : (
                  <div className="course-placeholder">
                    <span className="course-icon">🚢</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section className="course-content-section section">
          <div className="container">
            <div className="course-content-grid">
              {/* Main Content */}
              <div className="course-main-content">
                {/* Description */}
                <div className="content-card">
                  <h2>
                    <FaBook /> Course Overview
                  </h2>
                  <p>{course.description}</p>
                </div>

                {/* Eligibility */}
                {course.eligibility && (
                  <div className="content-card">
                    <h2>
                      <FaCheckCircle /> Eligibility Requirements
                    </h2>
                    <p>{course.eligibility}</p>
                  </div>
                )}

                {/* What You'll Learn (sample) */}
                <div className="content-card">
                  <h2>What You'll Learn</h2>
                  <ul className="learning-outcomes">
                    <li>
                      <FaCheckCircle /> Industry-standard practices and procedures
                    </li>
                    <li>
                      <FaCheckCircle /> Hands-on practical training with real equipment
                    </li>
                    <li>
                      <FaCheckCircle /> Safety protocols and emergency procedures
                    </li>
                    <li>
                      <FaCheckCircle /> Professional certification preparation
                    </li>
                    <li>
                      <FaCheckCircle /> Career development and job placement support
                    </li>
                  </ul>
                </div>

                {/* Career Opportunities (sample) */}
                <div className="content-card">
                  <h2>Career Opportunities</h2>
                  <p>
                    Upon successful completion of this course, graduates can pursue careers in:
                  </p>
                  <ul className="career-list">
                    <li>Port and harbor operations</li>
                    <li>Shipping companies</li>
                    <li>Maritime logistics firms</li>
                    <li>Terminal operators</li>
                    <li>Government maritime agencies</li>
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="course-sidebar">
                {/* Course Info Card */}
                <div className="sidebar-card course-info-card">
                  <h3>Course Information</h3>

                  <div className="info-item">
                    <span className="info-label">
                      <FaClock /> Duration
                    </span>
                    <span className="info-value">
                      {formatDuration(course.duration_months)}
                    </span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">
                      <FaCalendar /> Start Date
                    </span>
                    <span className="info-value">Flexible</span>
                  </div>

                  {course.fee && (
                    <div className="info-item">
                      <span className="info-label">Course Fee</span>
                      <span className="info-value fee-value">
                        {formatCurrency(course.fee)}
                      </span>
                    </div>
                  )}

                  <div className="info-item">
                    <span className="info-label">
                      <FaCertificate /> Certification
                    </span>
                    <span className="info-value">Included</span>
                  </div>

                  <button onClick={handleEnrollClick} className="btn btn-primary btn-block">
                    Enroll in This Course
                  </button>
                </div>

                {/* Download Brochure */}
                <div className="sidebar-card">
                  <h3>Need More Information?</h3>
                  <p>Download our detailed course brochure</p>
                  <button className="btn btn-outline btn-block">
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="related-courses-section section section-light">
            <div className="container">
              <h2 className="section-title">Related Courses</h2>
              <p className="section-subtitle">
                Other courses you might be interested in
              </p>

              <div className="related-courses-grid">
                {relatedCourses.map((relatedCourse, index) => (
                  <motion.div
                    key={relatedCourse.course_id}
                    className="related-course-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="related-course-image">
                      {relatedCourse.course_image ? (
                        <img
                          src={`${process.env.REACT_APP_UPLOADS_URL}/courses/${relatedCourse.course_image}`}
                          alt={relatedCourse.course_name}
                        />
                      ) : (
                        <div className="related-course-placeholder">
                          <span>🚢</span>
                        </div>
                      )}
                    </div>

                    <div className="related-course-content">
                      <h3>{relatedCourse.course_name}</h3>
                      <p className="related-course-duration">{relatedCourse.duration}</p>
                      <Link
                        to={`/courses/${relatedCourse.course_code.toLowerCase()}`}
                        className="related-course-link"
                      >
                        View Course <FaChevronRight />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CourseDetails;