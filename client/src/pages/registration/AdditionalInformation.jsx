// AdditionalInformation.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdditionalInformation.css';
import {
    PersonOutline,
    BookOutlined,
    DescriptionOutlined,
    MailOutline,
    CheckCircleOutline,
} from '@mui/icons-material';
import { useRegistration } from '../../context/RegistrationContext.jsx';

const AdditionalInformation = () => {
    const navigate = useNavigate();
    const { formData, updateAdditionalInfo } = useRegistration();
    // State to handle form inputs
    const [motivation, setMotivation] = useState(formData.additional.motivation);
    const [source, setSource] = useState(formData.additional.source);
    const [requirements, setRequirements] = useState(formData.additional.requirements);
    const [agreedToTerms, setAgreedToTerms] = useState(formData.additional.agreedToTerms);

    useEffect(() => {
        setMotivation(formData.additional.motivation);
        setSource(formData.additional.source);
        setRequirements(formData.additional.requirements);
        setAgreedToTerms(formData.additional.agreedToTerms);
    }, [formData.additional]);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (agreedToTerms && motivation.length >= 50 && source) {
            updateAdditionalInfo({
                motivation,
                source,
                requirements,
                agreedToTerms,
            });
            navigate('/registration/confirmation');
        }
    };

    // Helper component for the step indicator (remains the same)
    const StepIndicator = ({ number, title, icon, isActive, isComplete }) => (
        <div className={`step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
            <div className="icon-container">
                {icon}
            </div>
            <div className="step-label">
                <span className="step-number">Step {number}</span>
                <span className="step-title">{title}</span>
            </div>
        </div>
    );

    return (
        <div className="application-container">
            <header className="progress-header">
                {/* Step Indicators */}
                <StepIndicator number={1} title="Personal Information" icon={<PersonOutline />} isComplete={true} />
                <StepIndicator number={2} title="Course Selection" icon={<BookOutlined />} isComplete={true} />
                <StepIndicator number={3} title="Documents" icon={<DescriptionOutlined />} isComplete={true} />
                <StepIndicator number={4} title="Additional Information" icon={<MailOutline />} isActive={true} />
                <StepIndicator number={5} title="Confirmation" icon={<CheckCircleOutline />} />
            </header>

            {/* Main Form Section */}
            <div className="form-card" >
                <h2 className="card-title">Additional Information</h2>
                <form className="additional-info-form">

                    {/* Motivation Field */}
                    <div className="form-group">
                        <label htmlFor="motivation">Why do you want to pursue this course?*</label>
                        <p className="sub-text">Tell us about your motivation and career goals...</p>
                        <textarea
                            id="motivation"
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            rows="3" // Reduced height as requested
                            placeholder="Type your response here..."
                            required
                        ></textarea>
                        
                        {/* 🛑 INSTRUCTION 1: MINIMUM CHARACTER VALIDATION/HINT 🛑 */}
                        {motivation.length < 50 && (
                            <p className="validation-error">
                                **Please provide at least 50 characters** (Current: {motivation.length})
                            </p>
                        )}
                    </div>

                    {/* Source Field */}
                    <div className="form-group">
                        <label htmlFor="source">How did you hear about us?*</label>
                        
                        {/* 🛑 INSTRUCTION 2: REQUIRED TEXT HINT (FROM ORIGINAL IMAGE) 🛑 */}
                        {!source && <p className="required-error">Required</p>}

                        <select
                            id="source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                        >
                            <option value="" disabled>Please select</option>
                            <option value="social">Social Media</option>
                            <option value="search">Search Engine</option>
                            <option value="friend">Friend/Referral</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Special Requirements Field */}
                    <div className="form-group">
                        <label htmlFor="requirements">Special requirements or Accommodations</label>
                        <textarea
                            id="requirements"
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            rows="2" // Reduced height as requested
                            placeholder="Any special requirements or accommodations needed..."
                        ></textarea>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <label htmlFor="terms">
                            I agree to the **Terms & Conditions** and **Privacy Policy**. I understand that this application does not guarantee admission.
                        </label>
                        
                        {/* 🛑 INSTRUCTION 3: MUST ACCEPT TERMS VALIDATION/HINT 🛑 */}
                        {!agreedToTerms && (
                            <p className="validation-error">
                                **You must accept the terms & conditions**
                            </p>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-previous"
                            onClick={() => navigate('/registration/documents')}
                        >
                            Previous
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={!agreedToTerms || motivation.length < 50 || !source}
                            onClick={handleNextStep}
                        >
                            Next Step
                        </button>
                    </div>
                </form>
            </div>
            
            <footer className="application-footer">
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default AdditionalInformation;