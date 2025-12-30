import React from 'react';
import '../pages/public/AboutUs.css'; // Reuse main site footer styles if available

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Mahapola Ports & Maritime Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}
