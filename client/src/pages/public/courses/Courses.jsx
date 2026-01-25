import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaClock,
  FaMoneyBillWave,
  FaChevronRight,
  FaBook,
} from "react-icons/fa";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://10.70.4.34:5003/api/courses")
      .then((res) => {
        const coursesData = res.data.data || res.data;
        setCourses(coursesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <FaGraduationCap className="header-icon" />
        <h1 className="courses-title">Our Courses</h1>
        <p className="courses-subtitle">
          Explore our comprehensive range of maritime training programs
        </p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <Link
            key={course.course_id || course.courseId}
            to={`/courses/${course.course_id || course.courseId}`}
            className="course-link"
          >
            <div className="course-tile">
              <div className="course-header">
                <div className="course-icon">
                  <FaBook />
                </div>
                <div className="course-badge">Available</div>
              </div>

              <h2 className="course-name">
                {course.course_name || course.courseName}
              </h2>

              <div className="course-details">
                <div className="detail-item">
                  <FaGraduationCap className="detail-icon" />
                  <div>
                    <span className="detail-label">Stream</span>
                    <span className="detail-value">{course.stream}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <div>
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{course.duration}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaMoneyBillWave className="detail-icon" />
                  <div>
                    <span className="detail-label">Fees</span>
                    <span className="detail-value">
                      Rs. {course.fees || course.fee}
                    </span>
                  </div>
                </div>
              </div>

              <div className="course-cta">
                <span>View Details</span>
                <FaChevronRight className="cta-icon" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;
