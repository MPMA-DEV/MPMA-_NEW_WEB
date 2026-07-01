import logger from '../config/logger.js';

// Utility function to sanitize request body
const sanitizeRequestBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  
  const sensitiveFields = ['password', 'token', 'authorization', 'secret', 'key'];
  const sanitized = { ...body };
  
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    }
  };
  
  sanitizeObject(sanitized);
  return sanitized;
};

// Utility function to sanitize headers
const sanitizeHeaders = (headers) => {
  if (!headers || typeof headers !== 'object') return headers;
  
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
  const sanitized = { ...headers };
  
  for (const key in sanitized) {
    if (sanitized.hasOwnProperty(key)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveHeaders.includes(lowerKey)) {
        sanitized[key] = '[REDACTED]';
      }
    }
  }
  
  return sanitized;
};

// Extract user information from request
const extractUserInfo = (req) => {
  const userInfo = {};
  
  // Try to get user info from various sources
  if (req.user) {
    userInfo.userId = req.user.id || req.user.userId;
    userInfo.nic = req.user.nic;
    userInfo.username = req.user.username;
  }
  
  // Get IP address
  userInfo.ip = req.ip || 
    req.connection?.remoteAddress || 
    req.socket?.remoteAddress ||
    (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown';
  
  return userInfo;
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  // Extract request context
  const userInfo = extractUserInfo(req);
  const requestContext = {
    method: req.method,
    url: req.originalUrl || req.url,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
    correlationId: req.correlationId || req.headers['x-correlation-id'],
    ...userInfo
  };

  // Prepare error context for logging
  const errorContext = {
    ...requestContext,
    requestBody: sanitizeRequestBody(req.body),
    requestHeaders: sanitizeHeaders(req.headers),
    requestQuery: req.query,
    requestParams: req.params,
    stack: err.stack,
    name: err.name,
    code: err.code,
    statusCode: err.statusCode || err.status || 500
  };

  // Log the error with full context
  logger.error(`Unhandled error: ${err.message}`, errorContext);

  // Determine response status code
  let statusCode = 500;
  if (err.statusCode || err.status) {
    statusCode = err.statusCode || err.status;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
  } else if (err.name === 'TooManyRequestsError') {
    statusCode = 429;
  }

  // Prepare error response
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name || 'Error',
      statusCode
    }
  };

  // Add additional error details in development
  if (isDevelopment) {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = {
      code: err.code,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }

  // Add correlation ID if available
  if (requestContext.correlationId) {
    errorResponse.correlationId = requestContext.correlationId;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
  const userInfo = extractUserInfo(req);
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.name = 'NotFoundError';

  // Log 404 errors
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl || req.url,
    userAgent: req.headers['user-agent'],
    ...userInfo
  });

  next(error);
};

// Async error wrapper for route handlers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    promise: promise.toString()
  });
  
  // Optionally exit the process in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Unhandled Promise Rejection. Shutting down...');
    process.exit(1);
  }
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  
  console.error('Uncaught Exception. Shutting down...');
  process.exit(1);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.system.startup('shutdown', { signal });
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  try {
    // Stop token cleanup scheduler
    const { tokenCleanupScheduler } = await import('../services/tokenCleanupScheduler.js');
    tokenCleanupScheduler.stop();
    tokenCleanupScheduler.destroy();

    logger.info('Token cleanup scheduler stopped', {
      type: 'token_cleanup_scheduler_shutdown'
    });
  } catch (error) {
    logger.error('Error stopping token cleanup scheduler', {
      type: 'token_cleanup_scheduler_shutdown_error',
      error: error.message
    });
  }

  // Close server and database connections here
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { errorHandler, notFoundHandler, asyncHandler };
export default errorHandler;
