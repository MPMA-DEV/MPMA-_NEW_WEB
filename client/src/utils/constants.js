// ============================================
// APPLICATION CONSTANTS
// Centralized configuration values
// ============================================

// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = process.env.REACT_APP_UPLOADS_URL || 'http://localhost:5000/uploads';

// Admin Configuration
export const ADMIN_SECRET_PATH = process.env.REACT_APP_ADMIN_SECRET_PATH || 'mahapola-admin-secure-2024';

// Session Configuration
export const SESSION_TIMEOUT = parseInt(process.env.REACT_APP_SESSION_TIMEOUT) || 300000; // 5 minutes

// Color Theme
export const COLORS = {
  // Primary colors (Port Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e3a8a',
    900: '#1e40af',
  },
  // Secondary colors (Ocean)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Accent colors (Gold)
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Course Categories
export const COURSE_CATEGORIES = [
  'Equipment Operations',
  'Safety',
  'Information Technology',
  'Management',
  'Maritime',
  'Technical',
];

// Registration Status
export const REGISTRATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ENROLLED: 'enrolled',
};

// News Categories
export const NEWS_CATEGORIES = {
  NEWS: 'news',
  EVENT: 'event',
  ANNOUNCEMENT: 'announcement',
  ACHIEVEMENT: 'achievement',
};

// Contact Information
export const CONTACT_INFO = {
  email: process.env.REACT_APP_CONTACT_EMAIL || 'info@mahapola.lk',
  phone: process.env.REACT_APP_CONTACT_PHONE || '+94 11 234 5678',
  address: process.env.REACT_APP_CONTACT_ADDRESS || 'Colombo, Sri Lanka',
  workingHours: 'Monday - Friday: 8:00 AM - 5:00 PM',
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/mahapola',
  twitter: 'https://twitter.com/mahapola',
  linkedin: 'https://linkedin.com/company/mahapola',
  instagram: 'https://instagram.com/mahapola',
  youtube: 'https://youtube.com/mahapola',
};

// File Upload Limits
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Pagination
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 50,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mahapola_auth_token',
  USER_DATA: 'mahapola_user_data',
  THEME: 'mahapola_theme',
  LANGUAGE: 'mahapola_language',
};