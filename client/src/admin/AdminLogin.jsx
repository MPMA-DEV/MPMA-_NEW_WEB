
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('admin_token', 'demo_token');
      navigate('/admin/dashboard');
    } else {
      setError('Please enter username and password');
    }
  };

  return (
    <div className="admin-login-bg-image">
      <div className="admin-login-glass">
        <div className="admin-login-logo-section">
          <img 
            src="https://slhc.com.my/wp-content/uploads/2023/09/SLPA.jpg" 
            alt="SLPA Logo" 
            className="admin-login-logo"
          />
          <h1 className="admin-login-welcome">Welcome to</h1>
          <h2 className="admin-login-org-name">Sri Lanka Ports Authority</h2>
          <p className="admin-login-subtitle">Admin Panel</p>
        </div>
        <h2 className="admin-login-title">Admin Dashboard Login</h2>
        <form onSubmit={handleLogin}>
          <label className="admin-login-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <label className="admin-login-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" className="admin-btn admin-login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
