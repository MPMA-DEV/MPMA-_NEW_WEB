import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
        const res = await fetch('http://10.105.17.239:5003/api/portal/courses', 
        {
          method: "GET",  
          headers: { 
                'x-api-key': 'erp_portal_secure_key_2026',
                'Content-Type': 'application/json'
                }
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
  }, [categorySlug,selected]);

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
            {courses.map((course) => (
              <TiltCard
                className="course-card-new" 
                key={course.courseId}
              >

                <input
                     type="checkbox"
                     checked={selected.some((sel)=> sel.course === course.course)}
                     onChange={()=>hanDleCheckbox(course)}
                     style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 10,
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                    }}
                />

                <div className="card-accent-bar"></div>

                <h3 className="course-title">{course.course}</h3><br/>
                <p className="course-desc">
                
                  {`Rs.${course.fees}`} </p>
                <div className="course-meta">
                  
                  <span className="course-mode">
                    Meduim : {course.medium || "N/A"}
                  </span>
                </div>
                <div className="course-actions">
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      {!loading && (
        <div className="back-section">
          <button 
            className="back-btn"
            onClick={() => { navigate("/course/enroll", { state: selected }) }}
            
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
