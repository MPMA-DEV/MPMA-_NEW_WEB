import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaCertificate, FaPrint, FaDownload, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import './Results.css';

const CertificateVerification = () => {
  const [certNumber, setCertNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!certNumber) return;

    setIsSearching(true);
    setError(null);
    setShowResult(false);
    
    try {
      // Encode the ID to handle special characters like slashes (/)
      const encodedId = encodeURIComponent(certNumber);
      // Call the proxy backend route using a query parameter
      const response = await axios.get(`http://localhost:5000/api/courses/verify?id=${encodedId}`);
      
      if (response.data) {
        // Map the API response to our component state
        // Assuming the API returns fields like course_name, student_name, etc.
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        
        const mappedResults = dataArray.map(item => ({
          courseName: item.course_name || item.CourseName || 'N/A',
          studentName: item.student_name || item.StudentName || 'N/A',
          batchNumber: item.batch_number || item.BatchNumber || 'N/A',
          nicNumber: item.nic_number || item.NICNumber || 'N/A',
          commencingDate: item.commencing_date || item.CommencingDate || 'N/A',
          completedDate: item.completed_date || item.CompletedDate || 'N/A',
          finalResult: item.final_result || item.FinalResult || 'RESULT PENDING'
        }));

        setResultData(mappedResults);
        setShowResult(true);
      } else {
        setError('No certificate found for the provided number.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Certificate not found or invalid details.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setCertNumber('');
    setShowResult(false);
    setResultData(null);
    setError(null);
  };

  return (
    <div className="results-page verification-page">
      <div className="results-hero certification-hero">
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="results-hero-content">
          <FaCertificate className="results-hero-icon" />
          <h1 className="hero-title">Certificate Verification</h1>
          <p className="hero-subtitle">Verify the authenticity of maritime training certificates issued by Mahapola Academy</p>
        </div>
        <div className="wave-container">
          <svg className="wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,90 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      <section className="verification-content">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="verification-card"
          >
            <div className="verification-header-text">
              THANK YOU FOR SELECTING OUR ACADEMY TO FULFILL YOUR TRAINING REQUIREMENT
            </div>

            <div className="search-box-yellow">
              <p className="search-label">Please enter the Certificate Number or NIC Number to search</p>
              <form onSubmit={handleSearch} className="search-input-group">
                <input 
                  type="text" 
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  placeholder="Enter Certificate Number or NIC Number"
                  className="cert-input"
                  required
                />
                <button 
                  type="submit" 
                  className="btn-search-verify"
                  disabled={isSearching}
                >
                  {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </form>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="verification-error"
              >
                <FaExclamationTriangle /> {error}
              </motion.div>
            )}

            <AnimatePresence>
              {showResult && resultData && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="verification-results-container"
                >
                  <div className="results-count-badge" style={{ 
                    marginBottom: '20px', 
                    padding: '8px 15px', 
                    backgroundColor: '#1e3a5f', 
                    color: 'white', 
                    borderRadius: '20px',
                    display: 'inline-block',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}>
                    Found {resultData.length} certificate{resultData.length > 1 ? 's' : ''}
                  </div>

                  {resultData.map((result, index) => (
                    <div key={index} className="verification-card" style={{ marginBottom: '40px', border: '1px solid #e2e8f0' }}>
                      <div className="result-field-group">
                        <label>Course Name</label>
                        <div className="result-input-readonly">{result.courseName}</div>
                      </div>

                      <div className="result-field-group">
                        <label>Student Name</label>
                        <div className="result-input-readonly">{result.studentName}</div>
                      </div>

                      <div className="result-row">
                        <div className="result-field-group">
                          <label>Batch Number</label>
                          <div className="result-input-readonly">{result.batchNumber}</div>
                        </div>
                        <div className="result-field-group">
                          <label>NIC Number</label>
                          <div className="result-input-readonly">{result.nicNumber}</div>
                        </div>
                      </div>

                      <div className="result-row">
                        <div className="result-field-group">
                          <label>Commencing Date</label>
                          <div className="result-input-readonly">{result.commencingDate}</div>
                        </div>
                        <div className="result-field-group">
                          <label>Completed Date</label>
                          <div className="result-input-readonly">{result.completedDate}</div>
                        </div>
                      </div>

                      <div className="result-field-group">
                        <label>Final Result</label>
                        <div className="result-input-readonly highlight-result">{result.finalResult}</div>
                      </div>
                    </div>
                  ))}

                  <div className="verification-actions">
                    <button className="btn-verify-action print" onClick={() => window.print()}>
                      <FaPrint /> Print All Results
                    </button>
                    <button className="btn-verify-action reset" onClick={handleReset}>
                      <FaArrowLeft /> New Search
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showResult && !isSearching && !error && (
              <div className="verification-placeholder">
                <FaSearch className="placeholder-icon" />
                <p>Results will be displayed here after a successful search</p>
              </div>
            )}
            
            {isSearching && (
              <div className="verification-loading">
                <div className="spinner-verify"></div>
                <p>Searching database...</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CertificateVerification;
