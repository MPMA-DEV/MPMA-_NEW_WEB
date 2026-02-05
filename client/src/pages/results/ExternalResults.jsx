import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaIdCard, FaCalendarAlt, FaTrophy, FaDownload, FaPrint } from 'react-icons/fa';
import './Results.css';

const ExternalResults = () => {
  const [searchData, setSearchData] = useState({
    registrationNumber: '',
    nicNumber: '',
    examYear: '',
  });

  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    
    setTimeout(() => {
      setResults({
        studentName: 'Sample Student',
        registrationNumber: searchData.registrationNumber,
        nicNumber: searchData.nicNumber,
        examYear: searchData.examYear,
        examDate: '2025-11-15',
        course: 'Maritime Seamanship - Level 2',
        examinationBoard: 'Sri Lanka Ports Authority',
        subjects: [
          { name: 'Navigation Principles', marks: 85, grade: 'A', status: 'Pass' },
          { name: 'Safety Management', marks: 78, grade: 'B+', status: 'Pass' },
          { name: 'Port Operations', marks: 92, grade: 'A+', status: 'Pass' },
          { name: 'Marine Engineering', marks: 81, grade: 'A-', status: 'Pass' },
          { name: 'Cargo Handling', marks: 88, grade: 'A', status: 'Pass' },
        ],
        overallGrade: 'A',
        totalMarks: 424,
        percentage: 84.8,
        status: 'PASS',
      });
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="results-page">
      <div className="results-hero external-hero">
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
        <div className="results-hero-content">
          <FaTrophy className="results-hero-icon" />
          <h1 className="hero-title">External Examination Results</h1>
          <p className="hero-subtitle">Check your external maritime examination results</p>
        </div>
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      <section className="results-content-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="results-search-container"
          >
            <div className="search-header">
              <h2>Search Your Results</h2>
              <p>Enter your details to view examination results</p>
            </div>

            <form onSubmit={handleSearch} className="results-search-form">
              <div className="form-group">
                <label><FaIdCard /> Registration Number *</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={searchData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  required
                />
              </div>

              <div className="form-group">
                <label><FaIdCard /> NIC Number *</label>
                <input
                  type="text"
                  name="nicNumber"
                  value={searchData.nicNumber}
                  onChange={handleChange}
                  placeholder="Enter NIC number"
                  required
                />
              </div>

              <div className="form-group">
                <label><FaCalendarAlt /> Examination Year *</label>
                <select name="examYear" value={searchData.examYear} onChange={handleChange} required>
                  <option value="">Select year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              <button type="submit" className="btn-search" disabled={searching}>
                <FaSearch /> {searching ? 'Searching...' : 'Search Results'}
              </button>
            </form>
          </motion.div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="results-display"
            >
              <div className="results-header">
                <div className="results-title">
                  <h2>Examination Results</h2>
                  <span className={`status-badge ${results.status.toLowerCase()}`}>{results.status}</span>
                </div>
                <div className="results-actions">
                  <button className="btn-action"><FaDownload /> Download</button>
                  <button className="btn-action"><FaPrint /> Print</button>
                </div>
              </div>

              <div className="results-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Student Name:</span>
                    <span className="info-value">{results.studentName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Registration No:</span>
                    <span className="info-value">{results.registrationNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Exam Date:</span>
                    <span className="info-value">{results.examDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Course:</span>
                    <span className="info-value">{results.course}</span>
                  </div>
                </div>
              </div>

              <div className="results-table">
                <h3>Subject-wise Results</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.subjects.map((subject, index) => (
                      <tr key={index}>
                        <td>{subject.name}</td>
                        <td>{subject.marks}/100</td>
                        <td><span className="grade-badge">{subject.grade}</span></td>
                        <td><span className={`status-text ${subject.status.toLowerCase()}`}>{subject.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="results-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Marks:</span>
                  <span className="summary-value">{results.totalMarks}/500</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Percentage:</span>
                  <span className="summary-value">{results.percentage}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Overall Grade:</span>
                  <span className="summary-value grade-highlight">{results.overallGrade}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExternalResults;