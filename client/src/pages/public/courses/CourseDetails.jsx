import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CourseDetails.css";

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
    // Show state data instantly if present
    if (location.state && location.state.course) {
      setCourse(location.state.course);
      setLoading(true); // still fetch for up-to-date info
    } else {
      setLoading(true);
      setCourse(null);
    }
    setError(null);

    fetch(`/api/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (didCancel) return;
        let courseData = data;
        if (Array.isArray(data)) {
          courseData = data[0] || null;
        }
        setCourse(courseData);
        setLoading(false);
        // Debug output
        window.__COURSE_DEBUG__ = {
          courseId,
          locationState: location.state,
          apiResponse: data,
          parsedCourse: courseData
        };
        // eslint-disable-next-line no-console
        console.log('COURSE DEBUG:', window.__COURSE_DEBUG__);
      })
      .catch((err) => {
        if (didCancel) return;
        setError("Failed to load course");
        setLoading(false);
        // Debug output
        window.__COURSE_DEBUG__ = {
          courseId,
          locationState: location.state,
          apiError: err
        };
        // eslint-disable-next-line no-console
        console.log('COURSE DEBUG:', window.__COURSE_DEBUG__);
      });
    return () => { didCancel = true; };
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
        <pre style={{background:'#eee',color:'#333',padding:'1em',overflow:'auto'}}>
          {JSON.stringify(window.__COURSE_DEBUG__, null, 2)}
        </pre>
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
          <button className="cta-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
