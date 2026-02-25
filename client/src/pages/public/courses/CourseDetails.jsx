import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

const API_BASE = "http://10.70.4.34:5005";

const streamClassMap = {
  "Maritime & Seamanship": "stream-maritime-seamanship",
  "Occupational Health & Safety": "stream-health-safety",
  "Port Operation & Logistics": "stream-port-logistics",
  Technical: "stream-technical",
  "Management & IS": "stream-management-is",
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let didCancel = false;

    // Use course from navigation state immediately if available
    const stateCourse = location.state?.course ?? null;

    if (stateCourse) {
      setCourse(stateCourse);
    } else {
      setCourse(null);
    }

    setLoading(true);
    setError(null);

    // Fetch latest data from the API (same base URL Courses.jsx uses)
    axios
      .get(`${API_BASE}/api/courses/${courseId}`)
      .then((res) => {
        if (didCancel) return;
        let courseData = res.data;
        if (Array.isArray(courseData)) {
          courseData = courseData[0] || null;
        }
        if (courseData) {
          setCourse(courseData);
        }
        setLoading(false);
      })
      .catch(() => {
        if (didCancel) return;
        // If API fails but we already have state data, keep showing it
        if (!stateCourse) {
          setError("Failed to load course. Please try again later.");
        }
        setLoading(false);
      });

    return () => {
      didCancel = true;
    };
  }, [courseId, location.state]);

  const getMedium = () => {
    try {
      if (typeof course.medium === "string") {
        return JSON.parse(course.medium).join(", ");
      }
      if (Array.isArray(course.medium)) {
        return course.medium.join(", ");
      }
      return course.medium;
    } catch {
      return course.medium;
    }
  };

  if (loading)
    return (
      <div className="course-details">
        <p className="status">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="course-details">
        <p className="status">Error: {error}</p>
      </div>
    );
  if (!course)
    return (
      <div className="course-details">
        <p className="status">Course not found</p>
        <button className="cta-btn" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
      </div>
    );

  const streamClass = streamClassMap[course.stream] || "stream-default";

  return (
    <div className={`course-details ${streamClass}`}>
      <div className="details-card">
        <h1 className="course-title">
          {course.course_name || course.courseName || course.name || "Untitled Course"}
        </h1>

        <p className="course-subtitle">Detailed course info & requirements</p>

        <div className="info-grid">
          <div className="info-item">
            <b>Course Code</b>
            <span>{course.course_id || course.courseId || course.id}</span>
          </div>

          <div className="info-item">
            <b>Stream</b>
            <span>{course.stream}</span>
          </div>

          <div className="info-item">
            <b>Medium</b>
            <span>{getMedium()}</span>
          </div>

          <div className="info-item">
            <b>Duration</b>
            <span>{course.duration}</span>
          </div>

          <div className="info-item">
            <b>Fees</b>
            <span>Rs. {course.fees || course.fee}</span>
          </div>

          <div className="info-item">
            <b>Registration Fee</b>
            <span>
              Rs. {course.registrationFee || course.registration_fee || 0}
            </span>
          </div>
        </div>

        <div className="description">
          {course.description || "No description available"}
        </div>

        <div className="cta-row">
          <button className="cta-btn" onClick={() => navigate(-1)}>
            Back to Courses
          </button>
          {course.pdfUrl && (
            <a
              href={course.pdfUrl}
              className="cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
          )}
          <button
            className="cta-btn"
            onClick={() => navigate("/registration/enroll", { state: { course } })}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
