import React from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import "./SubmitSuccess.css"; // Import external CSS

const SuccessPage = () => {
    const handleGoHome = () => {
        alert("Navigating back to the home screen...");
    };

    return (
        <div className="success-container success-page-css">
            <div className="overlay"></div>

            <div className="success-modal">
                <div className="check-icon-container">
                    <CheckCircleOutline className="check-icon" />
                </div>

                <h1 className="success-message">You Have Successfully</h1>
                <h2 className="submission-text">Submitted!</h2>

                <button className="home-button" onClick={handleGoHome}>
                    View Application Status
                </button>
            </div>
        </div>
    );
};

export default SubmitSuccess;
