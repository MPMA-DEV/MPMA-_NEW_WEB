import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaIdCard, FaCalendarAlt, FaChartLine, FaDownload, FaPrint } from 'react-icons/fa';
import './Results.css';

const InternalResults = () => {
  const [searchData, setSearchData] = useState({
    studentId: '',
    semester: '',
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
        studentId: searchData.studentId,
        course: 'Diploma in Port Management',
        semester: searchData.semester,
        academicYear: '2025',
        modules: [
          { code: 'PM101', name: 'Port Operations', credits: 4, marks: 88, grade: 'A', gpa: 4.0 },
          { code: 'PM102', name: 'Maritime Law', credits: 3, marks: 82, grade: 'A-', gpa: 3.7 },
          { code: 'PM103', name: 'Logistics Management', credits: 4, marks: 90, grade: 'A+', gpa: 4.0 },
          { code: 'PM104', name: 'Safety Management', credits: 3, marks: 85, grade: 'A', gpa: 4.0 },
          { code: 'PM105', name: 'Environmental Management', credits: 2, marks: 78, grade: 'B+', gpa: 3.3 },
        ],
        attendance: 95,
        cgpa: 3.80,
        sgpa: 3.84,
        totalCredits: 16,
        status: 'PASS',
      });
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="results-page">
      <div className="results-hero internal-hero">
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
          <FaChartLine className="results-hero-icon" />
          <h1 className="hero-title">Internal Assessment Results</h1>
          <p className="hero-subtitle">View your semester-wise internal assessment results</p>
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
              <p>Enter your student ID and semester</p>
            </div>

            <form onSubmit={handleSearch} className="results-search-form">
              <div className="form-group">
                <label><FaIdCard /> Student ID *</label>
                <input
                  type="text"
                  name="studentId"
                  value={searchData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <div className="form-group">
                <label><FaCalendarAlt /> Semester *</label>
                <select name="semester" value={searchData.semester} onChange={handleChange} required>
                  <option value="">Select semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
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
                  <h2>Semester Results</h2>
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
                    <span className="info-label">Student ID:</span>
                    <span className="info-value">{results.studentId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Course:</span>
                    <span className="info-value">{results.course}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Semester:</span>
                    <span className="info-value">Semester {results.semester}</span>
                  </div>
                </div>
              </div>

              <div className="results-table">
                <h3>Module-wise Results</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Module Name</th>
                      <th>Credits</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.modules.map((module, index) => (
                      <tr key={index}>
                        <td>{module.code}</td>
                        <td>{module.name}</td>
                        <td>{module.credits}</td>
                        <td>{module.marks}/100</td>
                        <td><span className="grade-badge">{module.grade}</span></td>
                        <td>{module.gpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="results-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Credits:</span>
                  <span className="summary-value">{results.totalCredits}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">SGPA:</span>
                  <span className="summary-value highlight">{results.sgpa.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">CGPA:</span>
                  <span className="summary-value highlight">{results.cgpa.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Attendance:</span>
                  <span className="summary-value">{results.attendance}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InternalResults;