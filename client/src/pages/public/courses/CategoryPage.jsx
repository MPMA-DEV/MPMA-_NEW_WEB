import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaSpinner, FaInfoCircle, FaClock, FaLanguage, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import "./Courses.css";
import "./CoursesNew.css";
import "./HorizontalCourseCard.css";

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

const slugToStream = {
  "maritime-seamanship": "Maritime & Seamanship",
  "occupational-health-safety": "Occupational Health & Safety",
  "port-operation-logistics": "Port Operation & Logistics",
  technical: "Technical",
  "management-is": "Management & IS",
};

const slugToTheme = {
  "maritime-seamanship": "theme-maritime",
  "occupational-health-safety": "theme-health-safety",
  "port-operation-logistics": "theme-port-logistics",
  technical: "theme-technical",
  "management-is": "theme-management-is",
};

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
  const [selected, setSelected] = useState([]);

  const handleCheckbox = (course) => {
    setSelected((prev) =>
      prev.some((item) => item.course === course.course)
        ? prev.filter((sel) => sel.course !== course.course)
        : [...prev, course]
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const streamName = slugToStream[categorySlug] || categorySlug;
        const normalizedCategory = normalizeStream(streamName);

        const res = await fetch(process.env.REACT_APP_COURSE_API, { method: "GET" });
        const response = await res.json();
        const allCourses = response.data || [];

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

  const themeClass = slugToTheme[categorySlug] || "theme-default";

  const parseMedium = (medium) => {
    if (Array.isArray(medium)) return medium.join(", ");
    if (typeof medium === "string" && medium.startsWith("[")) {
      try { return JSON.parse(medium).join(", "); } catch { return medium; }
    }
    return medium || "English";
  };

  return (
    <div className={`category-page ${themeClass}`}>
      {/* Hero Section */}
      <div className="category-hero" style={{ backgroundImage: `url('${meta.heroImg}')` }}>
        <div className="category-hero-overlay"></div>
        <div className="category-hero-content">
          <nav className="breadcrumb">
            <Link to="/courses">Courses</Link> <span>/</span> <span>{meta.title}</span>
          </nav>
          <h1 className="category-title">{meta.title}</h1>
          <button className="back-to-categories" onClick={() => navigate("/courses")}>
            ← Back to Categories
          </button>
        </div>
      </div>

      {/* Courses Section */}
      <div className="hcc-page-content">
        <p className="hcc-section-heading">Select Your Courses</p>

        {loading && (
          <div className="loading-state">
            <FaSpinner className="spinning" />
            <p>Loading courses...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="empty-state">
            <FaInfoCircle />
            <p>No courses available for this category.</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="hcc-list">
            {courses.map((course) => {
              const isSelected = selected.some((sel) => sel.course === course.course);
              return (
                <div
                  key={course.course}
                  className={`hcc-card ${isSelected ? "hcc-card--selected" : ""}`}
                >
                  {/* Left: Category Image */}
                  <div
                    className="hcc-card__image"
                    style={{ backgroundImage: `url('${meta.heroImg}')` }}
                  >
                    <div className="hcc-card__image-overlay"></div>
                  </div>

                  {/* Middle: Course Info */}
                  <div className="hcc-card__body">
                    <h3 className="hcc-card__title">{course.course}</h3>

                    {course.description && (
                      <p className="hcc-card__description">{course.description}</p>
                    )}

                    <div className="hcc-card__meta-row">
                      <div className="hcc-card__meta-item">
                        <FaMoneyBillWave className="hcc-meta-icon" />
                        <div>
                          <span className="hcc-meta-label">Course Fee</span>
                          <span className="hcc-meta-value">Rs. {Number(course.fees || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="hcc-card__meta-divider"></div>

                      <div className="hcc-card__meta-item">
                        <FaLanguage className="hcc-meta-icon" />
                        <div>
                          <span className="hcc-meta-label">Medium</span>
                          <span className="hcc-meta-value">{parseMedium(course.medium)}</span>
                        </div>
                      </div>

                      {course.duration && (
                        <>
                          <div className="hcc-card__meta-divider"></div>
                          <div className="hcc-card__meta-item">
                            <FaClock className="hcc-meta-icon" />
                            <div>
                              <span className="hcc-meta-label">Duration</span>
                              <span className="hcc-meta-value">{course.duration}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Select Button */}
                  <div className="hcc-card__action">
                    <button
                      className={`hcc-select-btn ${isSelected ? "hcc-select-btn--selected" : ""}`}
                      onClick={() => handleCheckbox(course)}
                    >
                      {isSelected ? (
                        <><FaCheckCircle /> Selected</>
                      ) : (
                        "Select Course"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selection Summary */}
        {!loading && selected.length > 0 && (
          <div className="hcc-summary">
            <div className="hcc-summary__header">
              <h3>Your Selection ({selected.length})</h3>
              <p className="hcc-summary__total">
                Total: <span>Rs. {selected.reduce((sum, c) => sum + (Number(c.fees) || 0), 0).toLocaleString()}</span>
              </p>
            </div>
            <div className="hcc-summary__list">
              {selected.map((course) => (
                <div key={course.course} className="hcc-summary__item">
                  <span className="hcc-summary__name">{course.course}</span>
                  <span className="hcc-summary__fee">Rs. {Number(course.fees || 0).toLocaleString()}</span>
                  <button
                    className="hcc-summary__remove"
                    onClick={() => handleCheckbox(course)}
                    title="Remove"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        {!loading && (
          <div className="hcc-proceed">
            <button
              className={`hcc-proceed-btn ${selected.length === 0 ? "hcc-proceed-btn--disabled" : ""}`}
              onClick={() => navigate("/course/enroll", { state: selected })}
              disabled={selected.length === 0}
            >
              {selected.length === 0
                ? "Select Courses to Continue"
                : `Proceed with ${selected.length} Course${selected.length > 1 ? "s" : ""}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
