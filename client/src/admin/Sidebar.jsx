import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBook, FaPen, FaUserGraduate } from 'react-icons/fa';
import './admin.css';

const navItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, to: '/admin/dashboard' },
  { label: 'Courses', icon: <FaBook />, to: '/admin/courses' },
  { label: 'Posts', icon: <FaPen />, to: '/admin/create-post' },
];

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img 
          src="https://slhc.com.my/wp-content/uploads/2023/09/SLPA.jpg" 
          alt="SLPA Logo" 
          className="sidebar-logo-img"
        />
      </div>
      <div className="admin-sidebar-title">Admin Panel</div>
      <nav>
        <ul>
          {navItems.map(item => (
            <li key={item.label}>
              <NavLink to={item.to} className={({ isActive }) => isActive ? 'active' : ''} end>
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
