
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GlassNavbar from './components/common/GlassNavbar.jsx';
import GlassFooter from './components/common/GlassFooter.jsx';
import OceanWaveFooter from './components/common/OceanWaveFooter.jsx';

// Pages
import Home from './pages/public/Home.jsx';
import AboutUs from './pages/public/AboutUs.jsx';
import ContactUs from './pages/public/ContactUs.jsx';
import NewsEvents from './pages/public/NewsEvents.jsx';
import SubmitSuccess from './pages/public/SubmitSuccess.jsx';
import MissionDemo from './pages/public/MissionDemo.jsx';
import PrivacyPolicy from './pages/public/PrivacyPolicy.jsx';
import TermsOfUse from './pages/public/TermsOfUse.jsx';
import SiteMap from './pages/public/SiteMap.jsx';

// Course Pages
import EquipmentOperations from './pages/courses/EquipmentOperations.jsx';
import FireSafety from './pages/courses/FireSafety.jsx';
import InformationSystems from './pages/courses/InformationSystems.jsx';
import Management from './pages/courses/Management.jsx';
import MaritimeSeamanship from './pages/courses/MaritimeSeamanship.jsx';
import Technical1 from './pages/courses/Technical1.jsx';
import Technical2 from './pages/courses/Technical2.jsx';
import GantryCraneCoursePage from './components/courses/GantryCraneCoursePage.jsx';
import ForkliftTugOperations from './pages/courses/ForkliftTugOperations.jsx';
import CraneOperatorTraining from './pages/courses/CraneOperatorTraining.jsx';
import MoversOperators from './pages/courses/MoversOperators.jsx';
import CraneOperatorTraining2 from './pages/courses/CraneOperatorTraining2.jsx';
import CertificationRegistration from './pages/results/CertificationRegistration.jsx';
import ExternalResults from './pages/results/ExternalResults.jsx';
import InternalResults from './pages/results/InternalResults.jsx';
import PersonalInformation from './pages/registration/PersonalInformation.jsx';
import CourseSelection from './pages/registration/CourseSelection.jsx';
import AdditionalInformation from './pages/registration/AdditionalInformation.jsx';
import Documents from './pages/registration/Documents.jsx';
import Confirmation from './pages/registration/Confirmation.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import ManageCourses from './admin/ManageCourses.jsx';
import AddCourse from './admin/AddCourse.jsx';
import CreatePost from './admin/CreatePost.jsx';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Show GlassNavbar only on public pages */}
        {!(window.location.pathname.startsWith('/admin')) && <GlassNavbar />}

        {/* Main content */}
        <main className={window.location.pathname.startsWith('/admin') ? '' : 'main-content'}>
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

            {/* Course Routes */}
            <Route path="/courses/equipment-operations" element={<EquipmentOperations />} />
            <Route path="/courses/fire-safety" element={<FireSafety />} />
            <Route path="/courses/information-systems" element={<InformationSystems />} />
            <Route path="/courses/management" element={<Management />} />
            <Route path="/courses/maritime-seamanship" element={<MaritimeSeamanship />} />
            <Route path="/courses/technical-1" element={<Technical1 />} />
            <Route path="/courses/technical-2" element={<Technical2 />} />
              <Route path="/courses/gantry-crane-operator-training" element={<GantryCraneCoursePage />} />
            <Route path="/courses/forklift-tug-operations" element={<ForkliftTugOperations />} />
            <Route path="/courses/crane-operator-training" element={<CraneOperatorTraining />} />
            <Route path="/courses/movers-operators" element={<MoversOperators />} />
            <Route path="/courses/crane-operator-training-2" element={<CraneOperatorTraining2 />} />

            {/* Results Routes */}
            <Route path="/results/certification-registration" element={<CertificationRegistration />} />
            <Route path="/results/external-results" element={<ExternalResults />} />
            <Route path="/results/internal-results" element={<InternalResults />} />

            {/* Registration Routes */}
            <Route path="/registration/personal-information" element={<PersonalInformation />} />
            <Route path="/registration/course-selection" element={<CourseSelection />} />
            <Route path="/registration/additional-information" element={<AdditionalInformation />} />
            <Route path="/registration/documents" element={<Documents />} />
            <Route path="/registration/confirmation" element={<Confirmation />} />
            {/* Admin Routes (no links in main nav) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute><ManageCourses /></ProtectedRoute>
            } />
            <Route path="/admin/add-course" element={
              <ProtectedRoute><AddCourse /></ProtectedRoute>
            } />
            <Route path="/admin/create-post" element={
              <ProtectedRoute><CreatePost /></ProtectedRoute>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <OceanWaveFooter />
      </div>
    </Router>
  );
}

export default App;
