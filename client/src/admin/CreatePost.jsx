

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './admin.css';

export default function CreatePost() {
  const [form, setForm] = useState({
    title: '', image: '', content: '', date: '', category: '', shortDesc: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files && files[0]) {
        setForm({ ...form, image: files[0] });
        setImagePreview(URL.createObjectURL(files[0]));
      } else {
        setForm({ ...form, image: value });
        setImagePreview(value);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <div className="admin-bg">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-post-form-card">
          <h2 className="admin-post-title">Create New Post</h2>
          <form>
            <label className="admin-post-label">Title</label>
            <input name="title" placeholder="Enter post title" value={form.title} onChange={handleChange} />

            <label className="admin-post-label">Featured Image</label>
            <input name="image" type="file" accept="image/*" onChange={handleChange} style={{ marginBottom: 0 }} />
            <input name="image" type="url" placeholder="Upload image or enter URL" value={typeof form.image === 'string' ? form.image : ''} onChange={handleChange} style={{ marginTop: 8 }} />
            {imagePreview && (
              <div className="admin-post-image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}

            <label className="admin-post-label">Content</label>
            <textarea name="content" placeholder="Enter post content" value={form.content} onChange={handleChange} />

            <label className="admin-post-label">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />

            <label className="admin-post-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">Select</option>
              <option value="news">News</option>
              <option value="event">Event</option>
              <option value="announcement">Announcement</option>
            </select>

            <label className="admin-post-label">Short Description</label>
            <textarea name="shortDesc" placeholder="Short Description" value={form.shortDesc} onChange={handleChange} />

            <div className="admin-form-actions">
              <button className="admin-btn admin-btn-secondary" type="button">Save Draft</button>
              <button className="admin-btn admin-btn-secondary" type="button">Cancel</button>
              <button className="admin-btn admin-btn-primary" type="submit">Publish</button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
