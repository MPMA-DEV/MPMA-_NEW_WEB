
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './admin.css';

const courses = [
  { id: 1, title: 'Gantry Crane Operator', code: 'CRN101', duration: '2 Weeks' },
  { id: 2, title: 'Forklift Training', code: 'FLT201', duration: '1 Week' },
  { id: 3, title: 'Prime Mover Training', code: 'PM301', duration: '3 Weeks' },
];

export default function ManageCourses() {
  return (
    <div className="admin-bg">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <div className="admin-courses-table-card">
          <h3>Courses</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Code</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
              <tr>
                <td colSpan={3}></td>
                <td>
                  <button className="admin-btn admin-btn-primary" onClick={() => window.location.href='/admin/add-course'}>Add</button>
                </td>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.code}</td>
                  <td>{course.duration}</td>
                  <td>
                    <button className="admin-btn admin-btn-edit">Edit</button>
                    <button className="admin-btn admin-btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </div>
  );
}
