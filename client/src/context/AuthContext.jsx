// ============================================
// AUTHENTICATION CONTEXT
// Manages user authentication state globally
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // State to store authenticated user data
  const [user, setUser] = useState(null);
  
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with server
      const response = await authAPI.getProfile();
      
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        
        // Store user data in localStorage
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      }
    } catch (error) {
      // Token is invalid or expired
      console.error('Auth check failed:', error);
      logout(); // Clear invalid session
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Send login request to server
      const response = await authAPI.login({ username, password });
      
      if (response.success) {
        const { token, admin } = response.data;
        
        // Store token in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        
        // Store user data in localStorage
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(admin));
        
        // Update state
        setUser(admin);
        setIsAuthenticated(true);
        
        // Show success message
        toast.success(`Welcome back, ${admin.full_name}!`);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Show message
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  // Context value to be provided
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};