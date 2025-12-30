import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './admin.css';

const quickActions = [
  {
    title: 'Create New Post',
    desc: 'Start a new news article or event announcement.',
    img: 'https://media.istockphoto.com/id/1075953222/photo/aerial-view-of-cargo-ship-in-transit.jpg?s=612x612&w=0&k=20&c=wZBOOtb9HSNcUYFGOQIedaMYV1yVFQPcXbSHqy15ziw=',
    btn: 'Create',
    link: '/admin/create-post'
  },
  {
    title: 'Manage Posts',
    desc: 'View, edit, or delete existing news and event announcements.',
    img: 'https://thumbs.dreamstime.com/b/container-cargo-ship-cargo-plane-working-crane-bridge-shipyard-background-logistic-import-export-73976031.jpg',
    btn: 'Manage',
    link: '/admin/manage-posts'
  },
  {
    title: 'Manage Courses',
    desc: 'View, edit, or delete existing courses.',
    img: 'https://www.cinec.edu/wp-content/uploads/2016/11/maritime-02-mobile.jpg',
    btn: 'Manage',
    link: '/admin/courses'
  }
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard-bg">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-dashboard-glass">
          <h2 className="admin-dashboard-title">Admin Dashboard</h2>
          <h3 className="admin-dashboard-subtitle">Quick Actions</h3>
          <div className="admin-dashboard-actions">
            <div className="admin-dashboard-actions-list">
              {quickActions.map((action, idx) => (
                <div className="admin-dashboard-action-card" key={action.title} onClick={() => window.location.href = action.link}>
                  <div className="admin-dashboard-action-img">
                    <img src={action.img} alt={action.title} />
                  </div>
                  <div className="admin-dashboard-action-info">
                    <div className="admin-dashboard-action-title">{action.title}</div>
                    <div className="admin-dashboard-action-desc">{action.desc}</div>
                    <button className="admin-btn admin-btn-primary admin-dashboard-action-btn">{action.btn}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
