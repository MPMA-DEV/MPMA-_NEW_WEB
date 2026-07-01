/**
 * Logging System Demonstration
 * 
 * This file demonstrates how to use the comprehensive logging system
 * in the MPMA OJT Trainee Portal backend.
 */

import logger from '../config/logger.js';

// Example 1: Basic logging levels
console.log('\n=== Basic Logging Levels ===');
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning message');
logger.error('This is an error message');

// Example 2: Structured logging with context
console.log('\n=== Structured Logging ===');
logger.info('User action performed', {
  userId: 123,
  action: 'profile_update',
  ip: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  timestamp: new Date().toISOString()
});

// Example 3: Business event logging
console.log('\n=== Business Event Logging ===');

// Authentication events
logger.business.userAuth('login_success', 123, '200010010201', '192.168.1.100', true);
logger.business.userAuth('login_failed', null, 'invalid_user', '192.168.1.100', false, 'User not found');

// File operations
logger.business.fileOperation('upload', 123, 'profile_picture.jpg', '192.168.1.100', true);
logger.business.fileOperation('download', 123, 'certificate.pdf', '192.168.1.100', false, 'File not found');

// Database events
logger.business.databaseEvent('connection', 'MySQL connection established', true);
logger.business.databaseEvent('query_slow', 'SELECT * FROM users took 5.2s', true);

// Rate limiting
logger.business.rateLimitViolation('192.168.1.100', '/api/login', 5);

// Example 4: Error logging with context
console.log('\n=== Error Logging ===');
try {
  throw new Error('Something went wrong!');
} catch (error) {
  logger.error('Application error occurred', {
    type: 'application_error',
    error: error.message,
    stack: error.stack,
    context: {
      userId: 123,
      action: 'data_processing',
      timestamp: new Date().toISOString()
    }
  });
}

// Example 5: System logging
console.log('\n=== System Logging ===');
logger.system.startup(4001, 'development');
logger.system.database('connected', { host: 'localhost', port: 3306 });
logger.system.middleware('CORS', 'initialized');

// Example 6: Correlation ID logging
console.log('\n=== Correlation ID Logging ===');
const correlatedLogger = logger.addCorrelationId('req-123-456-789');
correlatedLogger.info('Processing user request', {
  userId: 123,
  action: 'get_profile'
});

// Example 7: Sensitive data sanitization
console.log('\n=== Sensitive Data Sanitization ===');
logger.logWithContext('info', 'User login attempt', {
  username: 'john_doe',
  password: 'secret123', // This will be sanitized
  token: 'jwt-token-here', // This will be sanitized
  email: 'john@example.com',
  ip: '192.168.1.100'
});

// Example 8: Performance logging
console.log('\n=== Performance Logging ===');
const startTime = Date.now();
// Simulate some work
await new Promise(resolve => setTimeout(resolve, 100));
const duration = Date.now() - startTime;

logger.info('Operation completed', {
  type: 'performance',
  operation: 'data_processing',
  duration: `${duration}ms`,
  success: true
});

console.log('\n=== Logging Demo Complete ===');
console.log('Check the console output above and the log files in the logs/ directory');
console.log('- logs/business-YYYY-MM-DD.log for business events');
console.log('- logs/error-YYYY-MM-DD.log for error logs');
