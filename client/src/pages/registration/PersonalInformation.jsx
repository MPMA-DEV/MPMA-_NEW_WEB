import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PersonOutline,
    BookOutlined,
    DescriptionOutlined,
    MailOutline,
    CheckCircleOutline,
} from '@mui/icons-material';
import { useRegistration } from '../../context/RegistrationContext.jsx';
import "./PersonalInformation.css";

const StepIndicator = ({ number, title, icon, isActive, isComplete }) => {
    return (
        <div
            className={`step-item ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
        >
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

const FormInput = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    isRequired = false,
    spanFull = false,
}) => {
    return (
        <div className={`form-group ${spanFull ? "span-full" : ""}`}>
            <label htmlFor={id} className="input-label">
                {label}
                {isRequired && <span className="required">*</span>}
            </label>

            {type === "textarea" ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="input-base textarea"
                    placeholder={placeholder}
                    required={isRequired}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    className="input-base"
                    placeholder={placeholder}
                    required={isRequired}
                />
            )}
        </div>
    );
};

const PersonalInformation = () => {
    const navigate = useNavigate();
    const { formData, updatePersonalInfo } = useRegistration();
    const [localFormData, setLocalFormData] = useState(formData.personal);

    useEffect(() => {
        setLocalFormData(formData.personal);
    }, [formData.personal]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLocalFormData((prev) => ({ ...prev, [id]: value }));
    };

    const isFormValid = Object.entries(localFormData).every(([key, value]) => {
        if (["completeAddress", "city", "postalCode"].includes(key)) return true;
        return !!value;
    });

    const handleNextStep = () => {
        if (isFormValid) {
            updatePersonalInfo(localFormData);
            navigate('/registration/course-selection');
        }
    };

    return (
        <div className="application-container">
            <header className="progress-header">
                <StepIndicator number={1} title="Personal Information" icon={<PersonOutline />} isActive={true} />
                <StepIndicator number={2} title="Course Selection" icon={<BookOutlined />} />
                <StepIndicator number={3} title="Documents" icon={<DescriptionOutlined />} />
                <StepIndicator number={4} title="Additional Information" icon={<MailOutline />} />
                <StepIndicator number={5} title="Confirmation" icon={<CheckCircleOutline />} />
            </header>

            <div className="form-card">
                <h2 className="card-title">Personal Information</h2>

                <div className="form-grid">
                    <FormInput id="firstName" label="First Name" value={localFormData.firstName} onChange={handleChange} placeholder="Enter your first name" isRequired={true} />
                    <FormInput id="lastName" label="Last Name" value={localFormData.lastName} onChange={handleChange} placeholder="Enter your last name" isRequired={true} />
                    <FormInput id="emailAddress" label="Email Address" type="email" value={localFormData.emailAddress} onChange={handleChange} placeholder="your.email@example.com" isRequired={true} />
                    <FormInput id="phoneNumber" label="Phone Number" type="tel" value={localFormData.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" isRequired={true} />
                    <FormInput id="dateOfBirth" label="Date of Birth" value={localFormData.dateOfBirth} onChange={handleChange} placeholder="dd/mm/yyyy" isRequired={true} />
                    <FormInput id="nicNumber" label="NIC Number" value={localFormData.nicNumber} onChange={handleChange} placeholder="200134907600 or 895467892V" isRequired={true} />
                    <FormInput id="completeAddress" label="Complete Address" type="textarea" value={localFormData.completeAddress} onChange={handleChange} placeholder="Enter your complete address" spanFull={true} />
                    <FormInput id="city" label="City" value={localFormData.city} onChange={handleChange} placeholder="Enter your city" isRequired={true} />
                    <FormInput id="postalCode" label="Postal Code" value={localFormData.postalCode} onChange={handleChange} placeholder="Enter your postal code" isRequired={true} />
                </div>

                <div className="form-actions">
                    <button
                        className={`btn-submit ${!isFormValid ? "disabled" : ""}`}
                        disabled={!isFormValid}
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

export default PersonalInformation;
