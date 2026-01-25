import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://10.70.4.34:5003/api/courses/${courseId}`)
      .then((res) => {
        const courseData = res.data.data || res.data;
        setCourse(courseData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load course");
        setLoading(false);
      });
  }, [courseId]);

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
      </div>
    );

  return (
    <div className="course-details">
      <div className="details-card">
        <h1 className="course-title">
          {course.course_name || course.courseName}
        </h1>

        <p className="course-subtitle">Detailed course info & requirements</p>

        <div className="info-grid">
          <div className="info-item">
            <b>Course Code</b>
            <span>{course.course_id || course.courseId}</span>
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
          <button className="cta-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
