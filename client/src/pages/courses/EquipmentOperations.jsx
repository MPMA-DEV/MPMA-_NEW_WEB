import React from "react";
import "./EquipmentOperations.css";

export default function EquipmentOperations() {
  return (
    <div className="equip-page">

      {/* Hero Section */}
      <div className="equip-hero">

        <img
          src="https://shipnerdnews.com/wp-content/uploads/2023/05/port-operations-container-transport.jpg"
          alt="Equipment operations"
          className="equip-hero-img"
        />

        <div className="equip-hero-content">
          <h1>EQUIPMENT OPERATIONS & LOGISTICS</h1>

          <p>
            Comprehensive training in maritime equipment operations, maintenance,
            and logistics management for modern shipping operations.
          </p>

          <div className="equip-buttons">
            <button className="apply-btn">Apply Now</button>
            <button className="brochure-btn">Download Brochure</button>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <h2 className="equip-title">Course Highlights</h2>
      <p className="equip-subtitle">
        Discover what makes this course exceptional and why it's the right choice
        for your maritime career.
      </p>

      <div className="highlight-cards">
        <div className="highlight-card">★ Hands-on Training With Modern Equipment</div>
        <div className="highlight-card">★ Industry Placement Assistance</div>
        <div className="highlight-card">★ International Certification</div>
        <div className="highlight-card">★ Expert Faculty from Maritime Industry</div>
      </div>

      {/* Information Grid */}
      <div className="info-grid">

        <div className="info-card">
          <h3>📘 Course Modules</h3>
          <ul>
            <li>Cargo Handling Equipment</li>
            <li>Port Operations Management</li>
            <li>Supply Chain Logistics</li>
            <li>Equipment Maintenance</li>
            <li>Safety Protocols</li>
            <li>Quality Control Systems</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>📝 Prerequisites</h3>
          <ul>
            <li>Basic Maritime Knowledge</li>
            <li>Physical fitness certificate</li>
            <li>Basic English proficiency</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🌐 Course Modules</h3>
          <ul>
            <li>Cargo Handling Equipment</li>
            <li>Port Operations Management</li>
            <li>Supply Chain Logistics</li>
            <li>Equipment Maintenance</li>
            <li>Safety Protocols</li>
            <li>Quality Control Systems</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
