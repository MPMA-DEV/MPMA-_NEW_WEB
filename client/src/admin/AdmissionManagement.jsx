import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './admin.css';

export default function AdmissionManagement() {
  const [applications, setApplications] = useState([
    { id: 1, name: 'Rajesh Kumar Silva', nic: '199512345678', email: 'rajesh.silva@email.com', phone: '+94 77 123 4567', course: 'Maritime Navigation', appliedDate: '2024-11-15', status: 'Pending' },
    { id: 2, name: 'Priya Fernando', nic: '199823456789', email: 'priya.fernando@email.com', phone: '+94 71 234 5678', course: 'Port Management', appliedDate: '2024-11-10', status: 'Approved' },
    { id: 3, name: 'David Perera', nic: '199734567890', email: 'david.perera@email.com', phone: '+94 76 345 6789', course: 'Cargo Operations', appliedDate: '2024-11-08', status: 'Rejected' },
    { id: 4, name: 'Sarah Wijesinghe', nic: '199645678901', email: 'sarah.w@email.com', phone: '+94 72 456 7890', course: 'Crane Operator Training', appliedDate: '2024-11-12', status: 'Pending' },
    { id: 5, name: 'Nuwan Jayawardena', nic: '199556789012', email: 'nuwan.j@email.com', phone: '+94 75 567 8901', course: 'Fire Safety & Emergency', appliedDate: '2024-11-05', status: 'Approved' },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.nic.includes(searchQuery) || 
                          app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(applications.filter(app => app.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setShowModal(false);
      }
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'Pending').length,
    approved: applications.filter(app => app.status === 'Approved').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
  };

  return (
    <div className="admin-bg">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-content">
          <div className="admission-header">
            <h1>Admission Management</h1>
            <p>Manage and review course admission applications</p>
          </div>

          {/* Statistics Cards */}
          <div className="admission-stats">
            <div className="stat-card stat-total">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            <div className="stat-card stat-pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            <div className="stat-card stat-approved">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.approved}</h3>
                <p>Approved</p>
              </div>
            </div>
            <div className="stat-card stat-rejected">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <h3>{stats.rejected}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="admission-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by name, NIC or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="status-filter"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="admission-table-container">
            <table className="admission-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>NIC</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map(app => (
                    <tr key={app.id}>
                      <td>{app.id}</td>
                      <td className="name-cell">{app.name}</td>
                      <td>{app.nic}</td>
                      <td>
                        <div className="contact-cell">
                          <div>{app.email}</div>
                          <div className="phone-text">{app.phone}</div>
                        </div>
                      </td>
                      <td>{app.course}</td>
                      <td>{app.appliedDate}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewDetails(app)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          {app.status === 'Pending' && (
                            <>
                              <button 
                                className="btn-approve"
                                onClick={() => handleUpdateStatus(app.id, 'Approved')}
                                title="Approve"
                              >
                                ✓
                              </button>
                              <button 
                                className="btn-reject"
                                onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                                title="Reject"
                              >
                                ✕
                              </button>
                            </>
                          )}
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(app.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal for viewing details */}
      {showModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Application ID:</span>
                <span className="detail-value">{selectedApp.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{selectedApp.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">NIC Number:</span>
                <span className="detail-value">{selectedApp.nic}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedApp.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedApp.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Course Applied:</span>
                <span className="detail-value">{selectedApp.course}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Applied Date:</span>
                <span className="detail-value">{selectedApp.appliedDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${getStatusClass(selectedApp.status)}`}>
                  {selectedApp.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              {selectedApp.status === 'Pending' && (
                <>
                  <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                  >
                    Approve Application
                  </button>
                  <button 
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                  >
                    Reject Application
                  </button>
                </>
              )}
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
