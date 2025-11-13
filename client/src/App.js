// ============================================
// MAIN APP COMPONENT
// ============================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Pages  
import Home from './pages/public/Home.jsx';
import AboutUs from './pages/public/AboutUs.jsx';
import ContactUs from './pages/public/ContactUs.jsx';
import NewsEvents from './pages/public/NewsEvents.jsx';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header with Navigation */}
        <header className="app-header">
          <div className="header-container">
            <Link to="/" className="logo">
              <h1>Mahapola Maritime Academy</h1>
            </Link>
            <nav className="main-nav">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/news">News</Link>
            </nav>
          </div>
        </header>
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/news" element={<NewsEvents />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-container">
            <p>&copy; 2025 Mahapola Ports & Maritime Academy. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/news">News & Events</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
