// ============================================
// MAIN APP COMPONENT
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Components
import GlassNavbar from './components/common/GlassNavbar.jsx';
import GlassFooter from './components/common/GlassFooter.jsx';

// Pages
import Home from './pages/public/Home.jsx';
import AboutUs from './pages/public/AboutUs.jsx';
import ContactUs from './pages/public/ContactUs.jsx';
import NewsEvents from './pages/public/NewsEvents.jsx';
import SubmitSuccess from './pages/public/SubmitSuccess.jsx';

// Course Pages
import EquipmentOperations from './pages/courses/EquipmentOperations.jsx';
import FireSafety from './pages/courses/FireSafety.jsx';
import InformationSystems from './pages/courses/InformationSystems.jsx';
import Management from './pages/courses/Management.jsx';
import MaritimeSeamanship from './pages/courses/MaritimeSeamanship.jsx';
import Technical1 from './pages/courses/Technical1.jsx';
import Technical2 from './pages/courses/Technical2.jsx';
import ForkliftTugOperations from './pages/courses/ForkliftTugOperations.jsx';
import CraneOperatorTraining from './pages/courses/CraneOperatorTraining.jsx';
import MoversOperators from './pages/courses/MoversOperators.jsx';
import CraneOperatorTraining2 from './pages/courses/CraneOperatorTraining2.jsx';

// Results Pages
import CertificationRegistration from './pages/results/CertificationRegistration.jsx';
import ExternalResults from './pages/results/ExternalResults.jsx';
import InternalResults from './pages/results/InternalResults.jsx';

// Registration Pages
import PersonalInformation from './pages/registration/PersonalInformation.jsx';
import CourseSelection from './pages/registration/CourseSelection.jsx';
import AdditionalInformation from './pages/registration/AdditionalInformation.jsx';
import Documents from './pages/registration/Documents.jsx';
import Confirmation from './pages/registration/Confirmation.jsx';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <GlassNavbar />

        {/* Main content */}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/news-events" element={<NewsEvents />} />
            <Route path="/submit-success" element={<SubmitSuccess />} />

            {/* Course Routes */}
            <Route path="/courses/equipment-operations" element={<EquipmentOperations />} />
            <Route path="/courses/fire-safety" element={<FireSafety />} />
            <Route path="/courses/information-systems" element={<InformationSystems />} />
            <Route path="/courses/management" element={<Management />} />
            <Route path="/courses/maritime-seamanship" element={<MaritimeSeamanship />} />
            <Route path="/courses/technical-1" element={<Technical1 />} />
            <Route path="/courses/technical-2" element={<Technical2 />} />
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
          </Routes>
        </main>

        {/* Footer */}
        <GlassFooter />
      </div>
    </Router>
  );
}

export default App;
