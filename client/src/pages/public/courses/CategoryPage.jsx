import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaFilePdf, FaSpinner, FaInfoCircle } from "react-icons/fa";
import "./Courses.css";
import "./CoursesNew.css";

const categoryMeta = {
  "maritime-seamanship": {
    title: "Maritime & Seamanship",
    heroImg: "https://i.imgur.com/hlJA98X.jpeg",
  },
  "occupational-health-safety": {
    title: "Occupational Health & Safety",
    heroImg: "https://i.imgur.com/haQfnv3.jpeg",
  },
  "port-operation-logistics": {
    title: "Port Operation & Logistics",
    heroImg: "https://i.imgur.com/1EvgbJL.jpeg",
  },
  technical: {
    title: "Technical",
    heroImg: "https://i.imgur.com/71xCzzL.jpeg",
  },
  "management-is": {
    title: "Management & IS",
    heroImg: "https://i.imgur.com/X0VXQYT.jpeg",
  },
};

// Map slug to stream name
const slugToStream = {
  "maritime-seamanship": "Maritime & Seamanship",
  "occupational-health-safety": "Occupational Health & Safety",
  "port-operation-logistics": "Port Operation & Logistics",
  technical: "Technical",
  "management-is": "Management & IS",
};

// Normalize stream values for comparison
const normalizeStream = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/\/+/g, "-")
    .replace(/,+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const meta = categoryMeta[categorySlug] || {};
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the stream name from slug
        const streamName = slugToStream[categorySlug] || categorySlug;
        const normalizedCategory = normalizeStream(streamName);
        
        // Fetch all courses using the same URL pattern as other components
        const response = await axios.get("http://10.70.4.34:5005/api/courses");
        const allCourses = response.data || [];
        
        // Filter courses by stream
        const filteredCourses = allCourses.filter((course) => {
          const normalizedStream = normalizeStream(course.stream);
          return normalizedStream === normalizedCategory;
        });
        
        setCourses(filteredCourses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categorySlug]);

  return (
    <div className="category-page">
      {/* Hero Section */}
      <div 
        className="category-hero" 
        style={{ backgroundImage: `url('${meta.heroImg}')` }}
      >
        <div className="category-hero-overlay"></div>
        <div className="category-hero-content">
          <nav className="breadcrumb">
            <Link to="/courses">Courses</Link> <span>/</span> <span>{meta.title}</span>
          </nav>
          <h1 className="category-title">{meta.title}</h1>
          <button 
            className="back-to-categories" 
            onClick={() => navigate('/courses')}
          >
            ← Back to Categories
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="category-courses-list">
        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FaSpinner className="spinning" />
            <p>Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="error-state">
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="empty-state">
            <FaInfoCircle />
            <p>No courses available for this category.</p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="courses-list-grid">
            {courses.map((course) => (
              <div 
                className="course-card-new" 
                key={course.courseId}
                onClick={() => navigate(`/courses/${course.courseId}`)}
              >
                <h3 className="course-title">{course.courseName}</h3>
                <p className="course-desc">
                  {course.description 
                    ? course.description.substring(0, 150) + "..." 
                    : "No description available"}
                </p>
                <div className="course-meta">
                  <span className="course-duration">
                    Duration: {course.duration || "N/A"}
                  </span>
                  <span className="course-mode">
                    Mode: {course.medium || "N/A"}
                  </span>
                </div>
                <div className="course-actions">
                  <button
                    className="details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${course.courseId}`, { state: { course } });
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      {!loading && (
        <div className="back-section">
          <button 
            className="back-btn"
            onClick={() => navigate('/courses')}
          >
            ← Back to All Categories
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
