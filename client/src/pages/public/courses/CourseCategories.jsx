import React from "react";
import { useNavigate } from "react-router-dom";
import "./Courses.css";
import "./CoursesNew.css";

const categories = [
  {
    slug: "maritime-seamanship",
    title: "Maritime & Seamanship",
    image: "https://i.imgur.com/hlJA98X.jpeg",
    description:
      "Professional maritime seamanship training covering navigation, vessel handling, safety operations, and international seafaring standards.",
  },
  {
    slug: "occupational-health-safety",
    title: "Occupational Health & Safety",
    image: "https://i.imgur.com/haQfnv3.jpeg",
    description:
      "Comprehensive workplace safety, emergency response, and regulatory compliance programs for maritime and industrial environments.",
  },
  {
    slug: "port-operation-logistics",
    title: "Port Operation & Logistics",
    image: "https://i.imgur.com/1EvgbJL.jpeg",
    description:
      "Training in port management, cargo logistics, terminal operations, shipping documentation, and supply chain coordination.",
  },
  {
    slug: "technical",
    title: "Technical",
    image: "https://i.imgur.com/71xCzzL.jpeg",
    description:
      "Hands-on technical programs covering marine engineering systems, machinery maintenance, electrical systems, and diagnostics.",
  },
  {
    slug: "management-is",
    title: "Management & IS",
    image: "https://i.imgur.com/X0VXQYT.jpeg",
    description:
      "Leadership, maritime administration, business management, and information systems training for modern maritime professionals.",
  },
];

const CourseCategories = () => {
  const navigate = useNavigate();
  return (
    <div className="categories-main">
      {/* Floating bubbles */}
      <div className="cat-bubbles">
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
        <div className="cat-bubble"></div>
      </div>

      {/* Wavy decorations */}
      <div className="cat-wave cat-wave-top">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {categories.map((cat, idx) => (
        <section
          key={cat.slug}
          className={`category-section alt-section-${idx % 2 === 0 ? "even" : "odd"}`}
        >
          <div className={`cat-content ${idx % 2 === 0 ? "left" : "right"}`}>
            <div className="cat-text">
              <h2 className="cat-title">{cat.title}</h2>
              <p className="cat-desc">{cat.description}</p>
              <button
                className="cat-cta-btn"
                onClick={() => navigate(`/courses/${cat.slug}`)}
              >
                VIEW COURSES
              </button>
            </div>
            <div className="cat-image-wrap">
              <img src={cat.image} alt={cat.title} className="cat-image" />
            </div>
          </div>
        </section>
      ))}

      <div className="cat-wave cat-wave-bottom">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C360,100 720,0 1080,40 C1260,70 1380,70 1440,40 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </div>
  );
};

export default CourseCategories;
