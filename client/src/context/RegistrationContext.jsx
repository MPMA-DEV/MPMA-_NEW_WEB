import React, { createContext, useContext, useState } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
};

export const RegistrationProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        personal: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            dateOfBirth: '',
            nicNumber: '',
            completeAddress: '',
            city: '',
            postalCode: '',
        },
        course: {
            selectedCourse: '',
            preferredIntake: '',
            educationLevel: '',
            workExperience: '',
        },
        documents: {
            hasPassport: false,
            hasSeamansBook: false,
            hasMedicalCert: false,
            uploadedFile: null,
        },
        additional: {
            motivation: '',
            source: '',
            requirements: '',
            agreedToTerms: false,
        },
    });

    const updatePersonalInfo = (data) => {
        setFormData((prev) => ({
            ...prev,
            personal: { ...prev.personal, ...data },
        }));
    };

    const updateCourseInfo = (data) => {
        setFormData((prev) => ({
            ...prev,
            course: { ...prev.course, ...data },
        }));
    };

    const updateDocuments = (data) => {
        setFormData((prev) => ({
            ...prev,
            documents: { ...prev.documents, ...data },
        }));
    };

    const updateAdditionalInfo = (data) => {
        setFormData((prev) => ({
            ...prev,
            additional: { ...prev.additional, ...data },
        }));
    };

    const value = {
        formData,
        updatePersonalInfo,
        updateCourseInfo,
        updateDocuments,
        updateAdditionalInfo,
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
};
