import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFilePdf, FaSpinner, FaInfoCircle, FaClock, FaLanguage, FaTag, FaCheckCircle } from "react-icons/fa";
import "./Courses.css";
import "./CoursesNew.css";
import "./CourseCardModern.css";


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

// Map slug to theme class
const slugToTheme = {
  "maritime-seamanship": "theme-maritime",
  "occupational-health-safety": "theme-health-safety",
  "port-operation-logistics": "theme-port-logistics",
  "technical": "theme-technical",
  "management-is": "theme-management-is",
};

// Smooth 3D tilt card wrapper
const TiltCard = ({ children, className}) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const currentTilt = useRef({ x: 0, y: 0 });
  const targetTilt = useRef({ x: 0, y: 0 });

  const lerp = (start, end, factor) => start + (end - start) * factor;



  const animate = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    currentTilt.current.x = lerp(currentTilt.current.x, targetTilt.current.x, 0.08);
    currentTilt.current.y = lerp(currentTilt.current.y, targetTilt.current.y, 0.08);

    const { x, y } = currentTilt.current;
    card.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1.02, 1.02, 1.02)`;

    if (
      Math.abs(currentTilt.current.x - targetTilt.current.x) > 0.01 ||
      Math.abs(currentTilt.current.y - targetTilt.current.y) > 0.01
    ) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);


  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
    
      
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
    >

    {/* Checkbox */}
      
      {children}
    </div>
  );
};

//-------------------------------------------------------------------------------------------------------------------------------------------

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const meta = categoryMeta[categorySlug] || {};
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([])

  const hanDleCheckbox=(value)=>{
    setSelected((prev)=>prev.some((item) => item.course === value.course) ? prev.filter((sel)=> sel.course !== value.course) : [...prev,value])
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the stream name from slug
        const streamName = slugToStream[categorySlug] || categorySlug;
        const normalizedCategory = normalizeStream(streamName);
        
         //Fetch all courses using the same URL pattern as other components
        const res = await fetch(process.env.REACT_APP_COURSE_API, 
        {
          method: "GET"
        });

        const response = await res.json();

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
    console.log(selected)

    fetchCourses();
  }, [categorySlug]);

  const themeClass = slugToTheme[categorySlug] || "theme-default";

  return (
    <div className={`category-page ${themeClass}`}>
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
        <p className="select-course">Select Your Courses</p>
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
            {courses.map((course) => {
              const isSelected = selected.some((sel) => sel.course === course.course);
              return (
                <div
                  className={`modern-course-card ${isSelected ? "selected" : ""}`}
                  key={course.course}
                >
                  {/* Card Header with Gradient */}
                  <div className="card-header">
                    <div className="card-header-content">
                      <h3 className="course-title-modern">{course.course}</h3>
                      <button
                        className={`select-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => hanDleCheckbox(course)}
                      >
                        {isSelected ? (
                          <>
                            <FaCheckCircle /> Selected
                          </>
                        ) : (
                          "Select Course"
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    {/* Course Info Grid */}
                    <div className="course-info-grid">
                      <div className="info-item">
                        <span className="info-icon">
                          <FaTag />
                        </span>
                        <div className="info-content">
                          <p className="info-label">Price</p>
                          <p className="info-value">Rs. {course.fees?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="info-item">
                        <span className="info-icon">
                          <FaLanguage />
                        </span>
                        <div className="info-content">
                          <p className="info-label">Medium</p>
                          <p className="info-value">
                            {Array.isArray(course.medium) 
                              ? course.medium.join(", ") 
                              : (typeof course.medium === 'string' && course.medium.startsWith('[')) 
                                  ? JSON.parse(course.medium).join(", ") 
                                  : course.medium || "English"}
                          </p>
                        </div>
                      </div>

                      {course.duration && (
                        <div className="info-item">
                          <span className="info-icon">
                            <FaClock />
                          </span>
                          <div className="info-content">
                            <p className="info-label">Duration</p>
                            <p className="info-value">{course.duration}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="card-divider"></div>

                    {/* Description */}
                    {course.description ? (
                      <p className="course-description">{course.description}</p>
                    ) : (
                      <p className="course-description">
                        Professional course in the {course.stream} category, offering comprehensive industry-aligned training.
                      </p>
                    )}

                    {/* Tags */}
                    <div className="course-tags">
                      {course.stream && (
                        <span className="tag">{course.stream}</span>
                      )}
                      {course.level && (
                        <span className="tag level-tag">{course.level}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <p className="course-code">Ref: {course.code || course.course.substring(0, 15)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Back Button */}
      {!loading && (
        <>
          {/* Selected Courses Summary */}
          {selected.length > 0 && (
            <div className="selection-summary">
              <div className="summary-header">
                <h3>Your Selection ({selected.length})</h3>
                <p className="summary-total">
                  Total: <span>Rs. {selected.reduce((sum, course) => sum + (Number(course.fees) || 0), 0).toLocaleString()}</span>
                </p>
              </div>

              <div className="selected-courses-list">
                {selected.map((course) => (
                  <div key={course.course} className="selected-item">
                    <span className="selected-name">{course.course}</span>
                    <span className="selected-fee">Rs. {course.fees}</span>
                    <button
                      className="remove-btn"
                      onClick={() => hanDleCheckbox(course)}
                      title="Remove course"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="back-section">
            <button 
              className={`back-btn ${selected.length === 0 ? "disabled" : ""}`}
              onClick={() => { navigate("/course/enroll", { state: selected }) }}
              disabled={selected.length === 0}
            >
              {selected.length === 0 ? "Select Courses to Continue" : `Proceed with ${selected.length} Course${selected.length > 1 ? "s" : ""}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
