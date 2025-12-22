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

import './CourseSelection.css';

const StepIndicator = ({ number, title, icon, isActive, isComplete }) => {
    return (
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
};

const CustomSelect = ({ id, label, value, onChange, options, placeholder, isRequired }) => {
    return (
        <div className="form-group">
            <label htmlFor={id} className="form-label">
                {label}{isRequired && <span className="required">*</span>}
            </label>

            <div className="select-wrapper">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    required={isRequired}
                    className="form-select"
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

const CourseSelection = () => {
    const navigate = useNavigate();
    const { formData, updateCourseInfo } = useRegistration();
    const [course, setCourse] = useState(formData.course.selectedCourse);
    const [intake, setIntake] = useState(formData.course.preferredIntake);
    const [educationLevel, setEducationLevel] = useState(formData.course.educationLevel);
    const [workExperience, setWorkExperience] = useState(formData.course.workExperience);

    useEffect(() => {
        setCourse(formData.course.selectedCourse);
        setIntake(formData.course.preferredIntake);
        setEducationLevel(formData.course.educationLevel);
        setWorkExperience(formData.course.workExperience);
    }, [formData.course]);

    const isNextButtonEnabled = course && intake && educationLevel;

    const handleNextStep = () => {
        if (isNextButtonEnabled) {
            updateCourseInfo({
                selectedCourse: course,
                preferredIntake: intake,
                educationLevel: educationLevel,
                workExperience: workExperience,
            });
            navigate('/registration/documents');
        }
    };

    const courseOptions = [
        { value: 'marine_eng', label: 'Marine Engineering' },
        { value: 'nautical_sci', label: 'Nautical Science' },
        { value: 'logistics', label: 'Logistics and Supply Chain Management' },
    ];

    const intakeOptions = [
        { value: '2025_sep', label: 'September 2025 Intake' },
        { value: '2026_jan', label: 'January 2026 Intake' },
    ];

    const educationOptions = [
        { value: 'al', label: "A/L (Advanced Level)" },
        { value: 'degree', label: 'Undergraduate Degree' },
        { value: 'diploma', label: 'Diploma' },
    ];

    return (
        <div className="application-container">
            
            <header className="progress-header">
                <StepIndicator number={1} title="Personal Information" icon={<PersonOutline />} isComplete />
                <StepIndicator number={2} title="Course Selection" icon={<BookOutlined />} isActive />
                <StepIndicator number={3} title="Documents" icon={<DescriptionOutlined />} />
                <StepIndicator number={4} title="Additional Information" icon={<MailOutline />} />
                <StepIndicator number={5} title="Confirmation" icon={<CheckCircleOutline />} />
            </header>

            <div className="form-card">
                <h2 className="card-title">Course Selection</h2>

                <CustomSelect
                    id="select-course"
                    label="Select Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    options={courseOptions}
                    placeholder="Choose Your Course"
                    isRequired
                />

                <CustomSelect
                    id="preferred-intake"
                    label="Preferred Intake"
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    options={intakeOptions}
                    placeholder="Select Intake Period"
                    isRequired
                />

                <CustomSelect
                    id="education-level"
                    label="Highest Education Level"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    options={educationOptions}
                    placeholder="Select Your Education Level"
                    isRequired
                />

                <div className="form-group">
                    <label htmlFor="work-experience" className="form-label">
                        Work Experience (Optional)
                    </label>
                    <textarea
                        id="work-experience"
                        value={workExperience}
                        onChange={(e) => setWorkExperience(e.target.value)}
                        className="form-textarea"
                        placeholder="Describe Your Relevant Work Experience"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-previous"
                        onClick={() => navigate('/registration/personal-information')}
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        className={`btn-submit ${!isNextButtonEnabled ? 'disabled' : ''}`}
                        disabled={!isNextButtonEnabled}
                        onClick={handleNextStep}
                    >
                        Next Step
                    </button>
                </div>
            </div>

            <footer className="application-footer" />
        </div>
    );
};

export default CourseSelection;
