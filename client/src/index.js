// ============================================
// APPLICATION ENTRY POINT
// This is where React starts rendering
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './Index.css';
import App from './App';
import { RegistrationProvider } from './context/RegistrationContext.jsx';

// Create root element and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // StrictMode helps identify potential problems
  <React.StrictMode>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </React.StrictMode>
);