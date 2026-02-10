// ============================================
// MAIN APP COMPONENT
// Root component with routing and providers
// ============================================

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { SessionProvider } from "./context/SessionContext";
import { ThemeProvider } from "./context/ThemeContext";

// Common Components
import GlassNavbar from "./components/common/GlassNavbar";
import Footer from "./components/common/Footer";
import CustomCursor from "./components/common/CustomCursor";
import LoadingSpinner from "./components/common/LoadingSpinner";
import SplashScreen from "./components/animations/SplashScreen";

// Import hooks
import usePageTransition from "./hooks/usePageTransition";

// Import styles
import "./App.css";

// Import page components
import Home from "./pages/public/Home";
import AboutUs from "./pages/public/AboutUs";
import NewsEvents from "./pages/public/NewsEvents";
import ContactUs from "./pages/public/ContactUs";
import SubmitSuccess from "./pages/public/SubmitSuccess";

// Courses (public)
import Courses from "./pages/public/courses/Courses.jsx";
import CourseDetails from "./pages/public/courses/CourseDetails.jsx";

// Course pages
import EquipmentOperations from "./pages/public/courses/EquipmentOperations";
import FireSafety from "./pages/public/courses/FireSafety";
import MaritimeSeamanship from "./pages/public/courses/MaritimeSeamanship";
import Technical1 from "./pages/public/courses/Technical1";
import Technical2 from "./pages/public/courses/Technical2";
import Management from "./pages/public/courses/Management";
import CraneOperatorTraining from "./pages/public/courses/CraneOperatorTraining";
import CraneOperatorTraining2 from "./pages/public/courses/CraneOperatorTraining2";
import ForkliftTugOperations from "./pages/public/courses/ForkliftTugOperations";
import MoversOperators from "./pages/public/courses/MoversOperators";
import InformationSystems from "./pages/public/courses/InformationSystems";

// Registration pages
import PersonalInformation from "./pages/registration/PersonalInformation";
import CourseSelection from "./pages/registration/CourseSelection";
import AdditionalInformation from "./pages/registration/AdditionalInformation";
import Documents from "./pages/registration/Documents";
import Confirmation from "./pages/registration/Confirmation";

// Results pages
import CertificationRegistration from "./pages/results/CertificationRegistration";
import ExternalResults from "./pages/results/ExternalResults";
import InternalResults from "./pages/results/InternalResults";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddCourse from "./pages/admin/AddCourse";
import CreatePost from "./pages/admin/CreatePost";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageNews from "./pages/admin/ManageNews";
import AdmissionManagement from "./admin/AdmissionManagement";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <HelmetProvider>
      <AuthProvider>
        <SessionProvider>
          <ThemeProvider>
            <Router>
              <div className="App">
                {/* Show splash screen on first load */}
                {showSplash ? (
                  <SplashScreen onComplete={handleSplashComplete} />
                ) : (
                  <>
                    {/* Custom cursor for desktop */}
                    <CustomCursor />

                    {/* Premium Glass Navigation Bar */}
                    <GlassNavbar />

                    {/* Toast notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: "#1f2937",
                          color: "#fff",
                          borderRadius: "8px",
                          padding: "16px",
                        },
                        success: {
                          iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                          },
                        },
                      }}
                    />

                    {/* Main content */}
                    <main className="main-content">
                      {isLoading ? (
                        <div className="loading-overlay">
                          <LoadingSpinner size="large" text="Loading..." />
                        </div>
                      ) : (
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<AboutUs />} />
                          <Route path="/news-events" element={<NewsEvents />} />
                          <Route path="/contact" element={<ContactUs />} />
                          <Route
                            path="/submit-success"
                            element={<SubmitSuccess />}
                          />

                          {/* Courses */}
                          <Route path="/courses" element={<Courses />} />
                          <Route
                            path="/course/:courseId"
                            element={<CourseDetails />}
                          />

                          {/* Course Routes */}
                          <Route
                            path="/courses/equipment-operations"
                            element={<EquipmentOperations />}
                          />
                          <Route
                            path="/courses/fire-safety"
                            element={<FireSafety />}
                          />
                          <Route
                            path="/courses/maritime-seamanship"
                            element={<MaritimeSeamanship />}
                          />
                          <Route
                            path="/courses/technical-1"
                            element={<Technical1 />}
                          />
                          <Route
                            path="/courses/technical-2"
                            element={<Technical2 />}
                          />
                          <Route
                            path="/courses/management"
                            element={<Management />}
                          />
                          <Route
                            path="/courses/crane-operator-training"
                            element={<CraneOperatorTraining />}
                          />
                          <Route
                            path="/courses/crane-operator-training-2"
                            element={<CraneOperatorTraining2 />}
                          />
                          <Route
                            path="/courses/forklift-tug-operations"
                            element={<ForkliftTugOperations />}
                          />
                          <Route
                            path="/courses/movers-operators"
                            element={<MoversOperators />}
                          />
                          <Route
                            path="/courses/information-systems"
                            element={<InformationSystems />}
                          />

                          {/* Registration Routes */}
                          <Route
                            path="/registration/personal-information"
                            element={<PersonalInformation />}
                          />
                          <Route
                            path="/registration/course-selection"
                            element={<CourseSelection />}
                          />
                          <Route
                            path="/registration/additional-information"
                            element={<AdditionalInformation />}
                          />
                          <Route
                            path="/registration/documents"
                            element={<Documents />}
                          />
                          <Route
                            path="/registration/confirmation"
                            element={<Confirmation />}
                          />

                          {/* Results Routes */}
                          <Route
                            path="/results/certification-registration"
                            element={<CertificationRegistration />}
                          />
                          <Route
                            path="/results/external-results"
                            element={<ExternalResults />}
                          />
                          <Route
                            path="/results/internal-results"
                            element={<InternalResults />}
                          />

                          {/* Admin Routes - Hidden access via URL */}
                          <Route
                            path="/mahapolaports/admin"
                            element={<AdminLogin />}
                          />
                          <Route
                            path="/mahapolaports/admin/dashboard"
                            element={<AdminDashboard />}
                          />
                          <Route
                            path="/mahapolaports/admin/add-course"
                            element={<AddCourse />}
                          />
                          <Route
                            path="/mahapolaports/admin/create-post"
                            element={<CreatePost />}
                          />
                          <Route
                            path="/mahapolaports/admin/manage-courses"
                            element={<ManageCourses />}
                          />
                          <Route
                            path="/mahapolaports/admin/manage-news"
                            element={<ManageNews />}
                          />
                          <Route
                            path="/mahapolaports/admin/admissions"
                            element={<AdmissionManagement />}
                          />
                          <Route
                            path="/admin/admissions"
                            element={<AdmissionManagement />}
                          />

                          {/* Redirect unknown routes to home */}
                          <Route
                            path="*"
                            element={<Navigate to="/" replace />}
                          />
                        </Routes>
                      )}
                    </main>

                    {/* Footer */}
                    <Footer />
                  </>
                )}
              </div>
            </Router>
          </ThemeProvider>
        </SessionProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
