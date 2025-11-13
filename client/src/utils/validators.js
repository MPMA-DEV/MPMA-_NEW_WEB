// ============================================
// VALIDATION UTILITIES
// Form validation helper functions
// ============================================

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Sri Lankan format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// NIC validation (Sri Lankan NIC)
export const isValidNIC = (nic) => {
  // Old format: 9 digits + V/X
  const oldNICRegex = /^[0-9]{9}[vVxX]$/;
  // New format: 12 digits
  const newNICRegex = /^[0-9]{12}$/;
  
  return oldNICRegex.test(nic) || newNICRegex.test(nic);
};

// Password strength validation
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// Minimum length validation
export const minLength = (value, min) => {
  if (typeof value === 'string') {
    return value.trim().length >= min;
  }
  return false;
};

// Maximum length validation
export const maxLength = (value, max) => {
  if (typeof value === 'string') {
    return value.trim().length <= max;
  }
  return false;
};

// Number validation
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Positive number validation
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

// Date validation
export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// Future date validation
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

// Past date validation
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Age validation (minimum age)
export const isMinAge = (birthDate, minAge) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= minAge;
};

// File size validation
export const isValidFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// File type validation
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize input (remove HTML tags)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '');
};

// Validate registration form
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Personal Information
  if (!isRequired(formData.full_name)) {
    errors.full_name = 'Full name is required';
  }
  
  if (!isRequired(formData.date_of_birth)) {
    errors.date_of_birth = 'Date of birth is required';
  } else if (!isMinAge(formData.date_of_birth, 16)) {
    errors.date_of_birth = 'You must be at least 16 years old';
  }
  
  if (!isRequired(formData.nic_number)) {
    errors.nic_number = 'NIC number is required';
  } else if (!isValidNIC(formData.nic_number)) {
    errors.nic_number = 'Invalid NIC format';
  }
  
  // Contact Information
  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!isRequired(formData.phone_mobile)) {
    errors.phone_mobile = 'Mobile number is required';
  } else if (!isValidPhone(formData.phone_mobile)) {
    errors.phone_mobile = 'Invalid phone number (must be 10 digits)';
  }
  
  if (!isRequired(formData.address_line1)) {
    errors.address_line1 = 'Address is required';
  }
  
  if (!isRequired(formData.city)) {
    errors.city = 'City is required';
  }
  
  // Course Selection
  if (!isRequired(formData.course_id)) {
    errors.course_id = 'Please select a course';
  }
  
  // Emergency Contact
  if (!isRequired(formData.emergency_contact_name)) {
    errors.emergency_contact_name = 'Emergency contact name is required';
  }
  
  if (!isRequired(formData.emergency_contact_phone)) {
    errors.emergency_contact_phone = 'Emergency contact phone is required';
  } else if (!isValidPhone(formData.emergency_contact_phone)) {
    errors.emergency_contact_phone = 'Invalid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate contact form
export const validateContactForm = (formData) => {
  const errors = {};
  
  if (!isRequired(formData.full_name)) {
    errors.full_name = 'Name is required';
  }
  
  if (!isRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!isRequired(formData.subject)) {
    errors.subject = 'Subject is required';
  } else if (!minLength(formData.subject, 5)) {
    errors.subject = 'Subject must be at least 5 characters';
  }
  
  if (!isRequired(formData.message)) {
    errors.message = 'Message is required';
  } else if (!minLength(formData.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};