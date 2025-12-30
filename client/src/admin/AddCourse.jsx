import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './admin.css';

export default function AddCourse() {
  const [form, setForm] = useState({
    title: '', description: '', code: '', duration: '', eligibility: '', fee: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-addcourse-bg">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-addcourse-glass">
          <h2 className="admin-post-title">Add New Course</h2>
          <form>
            <label className="admin-post-label">Course Title</label>
            <input name="title" placeholder="Enter course title" value={form.title} onChange={handleChange} />

            <label className="admin-post-label">Course Description</label>
            <textarea name="description" placeholder="Enter course description" value={form.description} onChange={handleChange} />

            <label className="admin-post-label">Course Code</label>
            <input name="code" placeholder="Enter course code" value={form.code} onChange={handleChange} />

            <label className="admin-post-label">Duration</label>
            <input name="duration" placeholder="Enter course duration" value={form.duration} onChange={handleChange} />

            <label className="admin-post-label">Eligibility Criteria</label>
            <textarea name="eligibility" placeholder="Enter eligibility criteria" value={form.eligibility} onChange={handleChange} />

            <label className="admin-post-label">Course Fee</label>
            <input name="fee" placeholder="Enter course fee" value={form.fee} onChange={handleChange} />

            <div className="admin-form-actions">
              <button className="admin-btn admin-btn-primary" type="submit">Save Course</button>
              <button className="admin-btn admin-btn-secondary" type="button">Cancel</button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
