import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Courses.css";

const streamClassMap = {
  Maritime: "stream-maritime",
  Management: "stream-management",
  "Management & IS": "stream-management-is",
  Equipment: "stream-equipment",
  Electrical: "stream-electrical",
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://10.70.4.34:5005/api/courses")
      .then((res) => {
        setCourses(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  // Group courses by stream
  const groupedCourses = courses.reduce((acc, course) => {
    const stream = course.stream || "Other";
    if (!acc[stream]) acc[stream] = [];
    acc[stream].push(course);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="courses-page">
        <p className="status">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <p className="status">{error}</p>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Wavy Hero Section */}
      <div className="courses-hero">
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
        <div className="courses-hero-content">
          <h1 className="hero-title">Our Courses</h1>
          <p className="hero-subtitle">
            Explore our comprehensive range of maritime training programs
          </p>
        </div>
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {Object.keys(groupedCourses).map((stream) => {
        const streamClass = streamClassMap[stream] || "stream-default";

        return (
          <section key={stream} className={`stream-section ${streamClass}`}>
            <h2 className="stream-title">{stream}</h2>

            <div className="courses-grid">
              {groupedCourses[stream].map((course) => (
                <div
                  key={course.courseId}
                  className="course-card"
                  onClick={() => navigate(`/courses/${course.courseId}`)}
                >
                  <h3 className="course-name">{course.courseName}</h3>

                  <p className="course-info">
                    <strong>Duration:</strong> {course.duration}
                  </p>

                  <p className="course-info">
                    <strong>Fees:</strong> Rs. {course.fees}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Courses;
