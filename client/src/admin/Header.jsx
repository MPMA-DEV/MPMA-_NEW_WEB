
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

export default function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };
  return (
    <header className="admin-header admin-header-flex">
      <div className="admin-header-left">
        <img 
          src="https://slhc.com.my/wp-content/uploads/2023/09/SLPA.jpg" 
          alt="SLPA Logo" 
          className="admin-logo"
        />
        <h2>Admin Dashboard</h2>
      </div>
      <button className="admin-btn admin-btn-logout" onClick={handleLogout}>Logout</button>
    </header>
  );
}
