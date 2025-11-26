import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleOutline } from '@mui/icons-material';
import './SubmitSuccess.css';

const SubmitSuccess = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="submit-success-container">
      <header className="progress-header">
        <h2 className="header-title">Application Submission Complete</h2>
      </header>

      <div className="success-card">
        <div className="success-icon">
          <CheckCircleOutline className="icon" />
        </div>

        <h1 className="success-title">Application Submitted Successfully!</h1>

        <p className="success-message">
          Thank you for submitting your application to Mahapola Maritime Academy.
        </p>

        <p className="success-details">
          We have received your application and will review it shortly. 
          You will receive a confirmation email with further instructions.
        </p>

        <div className="success-info">
          <p><strong>What's next?</strong></p>
          <ul>
            <li>Check your email for a confirmation message</li>
            <li>Our admissions team will review your application</li>
            <li>You will be notified of the results within 2-3 weeks</li>
            <li>Keep your application reference number for future inquiries</li>
          </ul>
        </div>

        <div className="success-actions">
          <button className="btn-home" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccess;
