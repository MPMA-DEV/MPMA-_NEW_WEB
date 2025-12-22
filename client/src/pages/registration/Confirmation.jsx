import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PersonOutline,
  BookOutlined,
  DescriptionOutlined,
  MailOutline,
  CheckCircleOutline,
  EditOutlined,
} from '@mui/icons-material';
import { useRegistration } from '../../context/RegistrationContext.jsx';
import './Confirmation.css';

// Helper component for the step indicator
const StepIndicator = ({ number, title, icon, isActive, isComplete }) => {
  return (
    <div className={`step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
      <div className="icon-container">{icon}</div>
      <div className="step-label">
        <span className="step-number">Step {number}</span>
        <span className="step-title">{title}</span>
      </div>
    </div>
  );
};

// Helper component for rendering data rows
const DataRow = ({ label, value }) => (
  <div className="data-item">
    <span className="data-label">{label}</span>
    <span className="data-value">{value}</span>
  </div>
);

// Helper component for rendering document rows
const DocumentRow = ({ label, status }) => (
  <div className="document-item">
    <span className="data-value doc-label">{label}</span>
    <span className={`document-status ${status === 'Uploaded' ? 'uploaded' : status === 'N/A' ? 'na' : ''}`}>
      {status}
    </span>
  </div>
);

// Mock Data (same as your original)
const mockApplicationData = {
  personal: [
    { label: 'Fist Name*', value: ' ' },
    { label: 'Last Name*', value: ' ' },
    { label: 'Email Address*', value: ' ' },
    { label: 'Phone Number*', value: ' ' },
    { label: 'Date of Birth*', value: ' ' },
    { label: 'NIC Number*', value: ' ' },
    { label: 'Complete Address*', value: ' ' },
    { label: 'City*', value: '' },
    { label: 'Postal Code*', value: ' ' },
  ],
  course: [
    { label: 'Select Course*', value: ' ' },
    { label: 'Preferred Intake*', value: ' ' },
    { label: 'Highest Education Level*', value: ' ' },
    {
      label: 'Work Experience(Optional)',
      value: ' ',
    },
  ],
  documents: [
    { label: 'Valid Passport', status: '' },
    { label: "Seaman's Book (if applicable)", status: 'N/A' },
    { label: 'Medical Fitness Certificate', status: 'Uploaded' },
  ],
  additional: {
    motivation:
      '',
    howHeard: ' ',
    requirements: '',
    termsAccepted: true,
  },
};

const ApplicationSummary = () => {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const navigate = useNavigate();
  const { formData } = useRegistration();

  // Map context data to display format
  const applicationData = {
    personal: [
      { label: 'First Name*', value: formData.personal.firstName },
      { label: 'Last Name*', value: formData.personal.lastName },
      { label: 'Email Address*', value: formData.personal.emailAddress },
      { label: 'Phone Number*', value: formData.personal.phoneNumber },
      { label: 'Date of Birth*', value: formData.personal.dateOfBirth },
      { label: 'NIC Number*', value: formData.personal.nicNumber },
      { label: 'Complete Address*', value: formData.personal.completeAddress },
      { label: 'City*', value: formData.personal.city },
      { label: 'Postal Code*', value: formData.personal.postalCode },
    ],
    course: [
      { label: 'Selected Course*', value: formData.course.selectedCourse },
      { label: 'Preferred Intake*', value: formData.course.preferredIntake },
      { label: 'Highest Education Level*', value: formData.course.educationLevel },
      { label: 'Work Experience(Optional)', value: formData.course.workExperience },
    ],
    documents: [
      { label: 'Valid Passport', status: formData.documents.hasPassport ? 'Checked' : 'Not Checked' },
      { label: "Seaman's Book (if applicable)", status: formData.documents.hasSeamansBook ? 'Checked' : 'Not Checked' },
      { label: 'Medical Fitness Certificate', status: formData.documents.hasMedicalCert ? 'Checked' : 'Not Checked' },
    ],
    additional: {
      motivation: formData.additional.motivation,
      howHeard: formData.additional.source,
      requirements: formData.additional.requirements,
      termsAccepted: formData.additional.agreedToTerms,
    },
  };

  const handleSubmit = () => {
    if (applicationData.additional.termsAccepted) {
      // Navigate to success page
      navigate('/submit-success');
      // In a real scenario, you would send the payload here
    } else {
      alert('Please accept the Terms & Conditions before submitting.');
    }
  };

  const handleEdit = (section) => {
    // navigate to the specific step route
    switch (section) {
      case 'Personal Information':
        navigate('/registration/personal-information');
        break;
      case 'Course Selection':
        navigate('/registration/course-selection');
        break;
      case 'Documents':
        navigate('/registration/documents');
        break;
      case 'Additional Information':
        navigate('/registration/additional-information');
        break;
      default:
        break;
    }
  };

  const isSubmitEnabled = termsAccepted;

  return (
    <div className="application-container">
      <header className="progress-header">
        <StepIndicator number={1} title="Personal Information" icon={<PersonOutline />} isComplete />
        <StepIndicator number={2} title="Course Selection" icon={<BookOutlined />} isComplete />
        <StepIndicator number={3} title="Documents" icon={<DescriptionOutlined />} isComplete />
        <StepIndicator number={4} title="Additional Information" icon={<MailOutline />} isComplete />
        <StepIndicator number={5} title="Confirmation" icon={<CheckCircleOutline />} isActive />
      </header>

      <div className="summary-card">
        <h2 className="card-title">Application Summary</h2>

        {/* Personal Information */}
        <section className="section no-top-border">
          <div className="section-header">
            <h3 className="section-title">Personal Information</h3>
            <button className="edit-button" onClick={() => handleEdit('Personal Information')} aria-label="Edit Personal Information">
              <EditOutlined className="edit-icon" /> Edit
            </button>
          </div>

          <div className="data-grid">
            {applicationData.personal.map((item, idx) => (
              <DataRow key={idx} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        {/* Course Selection */}
        <section className="section">
          <div className="section-header">
            <h3 className="section-title">Course Selection</h3>
            <button className="edit-button" onClick={() => handleEdit('Course Selection')} aria-label="Edit Course Selection">
              <EditOutlined className="edit-icon" /> Edit
            </button>
          </div>

          <div className="data-grid">
            {applicationData.course.map((item, idx) => (
              <DataRow key={idx} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        {/* Documents */}
        <section className="section">
          <div className="section-header">
            <h3 className="section-title">Documents</h3>
            <button className="edit-button" onClick={() => handleEdit('Documents')} aria-label="Edit Documents">
              <EditOutlined className="edit-icon" /> Edit
            </button>
          </div>

          <div className="documents-list">
            {applicationData.documents.map((item, idx) => (
              <DocumentRow key={idx} label={item.label} status={item.status} />
            ))}
          </div>
        </section>

        {/* Additional Information */}
        <section className="section">
          <div className="section-header">
            <h3 className="section-title">Additional Information</h3>
            <button className="edit-button" onClick={() => handleEdit('Additional Information')} aria-label="Edit Additional Information">
              <EditOutlined className="edit-icon" /> Edit
            </button>
          </div>

          <div className="data-grid">
            <div className="full-row-text">
              <span className="data-label">Why do you want to pursue this course?*</span>
              <span className="data-value">{applicationData.additional.motivation}</span>
            </div>

            <DataRow label="How did you hear about us?*" value={applicationData.additional.howHeard} />

            <div className="full-row-text">
              <span className="data-label">Special requirements or Accommodations</span>
              <span className="data-value">{applicationData.additional.requirements}</span>
            </div>
          </div>
        </section>

        {/* Terms */}
        <div className="terms-container">
          <input
            type="checkbox"
            id="terms"
            className="terms-checkbox"
            checked={applicationData.additional.termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms" className="terms-label">
            I agree to the Terms &amp; Conditions and Privacy Policy. I understand that this application does not guarantee admission.
          </label>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn-previous" type="button" onClick={() => navigate('/registration/additional-information')}>
            Previous
          </button>
          <button className={`btn-submit ${!applicationData.additional.termsAccepted ? 'disabled' : ''}`} type="button" onClick={handleSubmit} disabled={!applicationData.additional.termsAccepted}>
            Confirm &amp; Submit
          </button>
        </div>
      </div>

      <footer className="application-footer" />
    </div>
  );
};

export default ApplicationSummary;
