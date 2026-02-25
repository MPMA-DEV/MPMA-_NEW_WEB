import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import GlassNavbar from "./components/common/GlassNavbar.jsx";
import GlassFooter from "./components/common/GlassFooter.jsx";
import OceanWaveFooter from "./components/common/OceanWaveFooter.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
// Pages
import Home from "./pages/public/Home.jsx";
import AboutUs from "./pages/public/AboutUs.jsx";
import ContactUs from "./pages/public/ContactUs.jsx";
import NewsEvents from "./pages/public/NewsEvents.jsx";
import SubmitSuccess from "./pages/public/SubmitSuccess.jsx";
import MissionDemo from "./pages/public/MissionDemo.jsx";
import PrivacyPolicy from "./pages/public/PrivacyPolicy.jsx";
import TermsOfUse from "./pages/public/TermsOfUse.jsx";
import SiteMap from "./pages/public/SiteMap.jsx";
import Courses from "./pages/public/courses/Courses.jsx";
import CourseCategories from "./pages/public/courses/CourseCategories.jsx";
import CourseDetails from "./pages/public/courses/CourseDetails.jsx";
import CategoryPage from "./pages/public/courses/CategoryPage.jsx";
import CertificationRegistration from "./pages/results/CertificationRegistration.jsx";
import ExternalResults from "./pages/results/ExternalResults.jsx";
import InternalResults from "./pages/results/InternalResults.jsx";
import PersonalInformation from "./pages/registration/PersonalInformation.jsx";
import CourseSelection from "./pages/registration/CourseSelection.jsx";
import AdditionalInformation from "./pages/registration/AdditionalInformation.jsx";
import Documents from "./pages/registration/Documents.jsx";
import Confirmation from "./pages/registration/Confirmation.jsx";
import EnrollmentPage from "./pages/registration/EnrollmentPage.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ManageCourses from "./admin/ManageCourses.jsx";
import AddCourse from "./admin/AddCourse.jsx";
import CreatePost from "./admin/CreatePost.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* Show GlassNavbar only on public pages */}
        {!window.location.pathname.startsWith("/admin") && <GlassNavbar />}

        {/* Main content */}
        <main
          className={
            window.location.pathname.startsWith("/admin") ? "" : "main-content"
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/news-events" element={<NewsEvents />} />
            <Route path="/submit-success" element={<SubmitSuccess />} />
            <Route path="/mission-demo" element={<MissionDemo />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/site-map" element={<SiteMap />} />

            {/* Courses Routes */}
            <Route path="/courses" element={<CourseCategories />} />
            <Route path="/courses/:categorySlug" element={<CategoryPage />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/registration/enroll" element={<EnrollmentPage />} />

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
            <Route path="/registration/documents" element={<Documents />} />
            <Route
              path="/registration/confirmation"
              element={<Confirmation />}
            />
            {/* Admin Routes (no links in main nav) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-course"
              element={
                <ProtectedRoute>
                  <AddCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-post"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <OceanWaveFooter />
      </div>
    </Router>
  );
}

export default App;
