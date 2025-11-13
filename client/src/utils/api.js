// ============================================
// API UTILITY
// Handles all API requests with axios
// ============================================

import axios from 'axios';
import { API_URL, STORAGE_KEYS } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // If token exists, add to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Return only the data from response
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle unauthorized (401) - Token expired or invalid
      if (status === 401) {
        // Clear auth data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Redirect to login if on admin page
        if (window.location.pathname.includes('admin')) {
          window.location.href = '/admin/login';
        }
      }
      
      // Return error message from server
      return Promise.reject(data || { message: 'An error occurred' });
    } else if (error.request) {
      // Request made but no response received (network error)
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message || 'An unexpected error occurred' });
    }
  }
);

// ============================================
// API METHODS
// ============================================

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

// Course APIs
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getByCode: (code) => api.get(`/courses/code/${code}`),
  getCategories: () => api.get('/courses/categories/all'),
  create: (formData) => api.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/courses/${id}`),
};

// News APIs
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getBySlug: (slug) => api.get(`/news/${slug}`),
  getLatest: (count = 5) => api.get(`/news/latest/${count}`),
  getAllAdmin: (params) => api.get('/news/admin/all', { params }),
  create: (formData) => api.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/news/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/news/${id}`),
};

// Registration APIs
export const registrationAPI = {
  create: (data) => api.post('/registrations', data),
  getByNumber: (registrationNumber) => api.get(`/registrations/${registrationNumber}`),
  getAll: (params) => api.get('/registrations', { params }),
  updateStatus: (id, data) => api.patch(`/registrations/${id}/status`, data),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  updateStatus: (id, data) => api.patch(`/contact/${id}/status`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getLogs: (params) => api.get('/admin/logs', { params }),
};

// Export default api instance
export default api;