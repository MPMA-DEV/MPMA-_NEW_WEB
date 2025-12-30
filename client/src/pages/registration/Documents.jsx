import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PersonOutline,
    BookOutlined,
    DescriptionOutlined,
    MailOutline,
    CheckCircleOutline,
    CloudUploadOutlined,
    InfoOutlined,
} from '@mui/icons-material';
import { useRegistration } from '../../context/RegistrationContext.jsx';

import './Documents.css';

const StepIndicator = ({ number, title, icon, isActive, isComplete }) => {
    const itemClass = `step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`;

    return (
        <div className={itemClass}>
            <div className="icon-container">
                {icon}
            </div>
            <div className="step-label">
                <span className="step-number">Step {number}</span>
                <span className="step-title">{title}</span>
            </div>
        </div>
    );
};

const CustomCheckbox = ({ id, checked, onChange, label }) => {
    return (
        <div className="checklist-item">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="custom-checkbox"
            />
            <label htmlFor={id} className="checkbox-label">
                {label}
            </label>
        </div>
    );
};

const Documents = () => {
    const navigate = useNavigate();
    const { formData, updateDocuments } = useRegistration();
    const [hasPassport, setHasPassport] = useState(formData.documents.hasPassport);
    const [hasSeamansBook, setHasSeamansBook] = useState(formData.documents.hasSeamansBook);
    const [hasMedicalCert, setHasMedicalCert] = useState(formData.documents.hasMedicalCert);
    const [fileSelected, setFileSelected] = useState(formData.documents.uploadedFile);

    useEffect(() => {
        setHasPassport(formData.documents.hasPassport);
        setHasSeamansBook(formData.documents.hasSeamansBook);
        setHasMedicalCert(formData.documents.hasMedicalCert);
        setFileSelected(formData.documents.uploadedFile);
    }, [formData.documents]);

    const isNextButtonEnabled =
        hasPassport || hasSeamansBook || hasMedicalCert || fileSelected;

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileSelected(event.target.files[0].name);
        } else {
            setFileSelected(null);
        }
    };

    const handleNextStep = () => {
        if (isNextButtonEnabled) {
            updateDocuments({
                hasPassport,
                hasSeamansBook,
                hasMedicalCert,
                uploadedFile: fileSelected,
            });
            navigate('/registration/additional-information');
        }
    };

    return (
        <div className="application-container">
            <header className="progress-header">
                <StepIndicator number={1} title="Personal Information" icon={<PersonOutline />} isComplete={true} />
                <StepIndicator number={2} title="Course Selection" icon={<BookOutlined />} isComplete={true} />
                <StepIndicator number={3} title="Documents" icon={<DescriptionOutlined />} isActive={true} />
                <StepIndicator number={4} title="Additional Information" icon={<MailOutline />} />
                <StepIndicator number={5} title="Confirmation" icon={<CheckCircleOutline />} />
            </header>

            <div className="form-card">
                <h2 className="card-title">Documents</h2>

                {/* Requirements Box */}
                <div className="requirements-box">
                    <InfoOutlined className="requirements-icon" />
                    <div className="requirements-content">
                        <span className="requirements-title">Document Requirements</span>
                        <p className="requirements-subtext">
                            Please check the documents you currently have. Missing documents can be submitted later during the admission.
                        </p>
                    </div>
                </div>

                {/* Document Checklist */}
                <div className="document-checklist">
                    <CustomCheckbox
                        id="passport"
                        checked={hasPassport}
                        onChange={(e) => setHasPassport(e.target.checked)}
                        label="Valid Passport"
                    />

                    <CustomCheckbox
                        id="seamans-book"
                        checked={hasSeamansBook}
                        onChange={(e) => setHasSeamansBook(e.target.checked)}
                        label="Seaman's Book (if applicable)"
                    />

                    <CustomCheckbox
                        id="medical-cert"
                        checked={hasMedicalCert}
                        onChange={(e) => setHasMedicalCert(e.target.checked)}
                        label="Medical Fitness Certificate"
                    />
                </div>

                {/* Upload Section */}
                <div className="upload-container">
                    <div className="upload-placeholder">
                        <CloudUploadOutlined className="upload-icon" />
                        <span className="upload-title">Upload Documents</span>
                        <p className="upload-subtext">
                            You can upload your documents now or submit them later during the admission process.
                        </p>

                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        <label htmlFor="file-upload" className="choose-files-button" >
                            Choose Files
                        </label>

                        {fileSelected && (
                            <p className="file-name-feedback">File selected: {fileSelected}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-base btn-previous"
                        onClick={() => navigate('/registration/course-selection')}
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        className="btn-base btn-submit"
                        disabled={!isNextButtonEnabled}
                        onClick={handleNextStep}
                    >
                        Next Step
                    </button>
                </div>
            </div>

            <footer className="application-footer"></footer>
        </div>
    );
};

export default Documents;
