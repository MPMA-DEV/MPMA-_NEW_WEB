import morgan from 'morgan';
import logger from '../config/logger.js';
import { v4 as uuidv4 } from 'uuid';

// Health check endpoints to exclude from logging
const HEALTH_CHECK_ENDPOINTS = [
  '/health',
  '/healthz',
  '/ping',
  '/status',
  '/api/health'
];

// Utility function to check if request should be logged
const shouldLogRequest = (req) => {
  const url = req.originalUrl || req.url;
  return !HEALTH_CHECK_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
};

// Utility function to extract user info from request
const extractUserInfo = (req) => {
  if (req.user) {
    return {
      userId: req.user.id || req.user.userId,
      nic: req.user.nic,
      username: req.user.username
    };
  }
  return {};
};

// Custom Morgan token for user ID
morgan.token('user-id', (req) => {
  return req.user?.id || req.user?.userId || '-';
});

// Custom Morgan token for user NIC
morgan.token('user-nic', (req) => {
  return req.user?.nic || '-';
});

// Custom Morgan token for correlation ID
morgan.token('correlation-id', (req) => {
  return req.correlationId || '-';
});

// Custom Morgan token for real IP address
morgan.token('real-ip', (req) => {
  return req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    '-';
});

// Development format - clean and simple
const developmentFormat = ':method :url :status :response-time ms';

// Production format - structured for parsing
const productionFormat = ':real-ip :method :url :status :res[content-length] - :response-time ms ":user-agent" :user-id :user-nic :correlation-id';

// Custom stream that writes to Winston instead of console
const winstonStream = {
  write: (message) => {
    // Clean up the message and log it simply
    const trimmedMessage = message.trim();
    logger.info(trimmedMessage);
  }
};

// Middleware to add correlation ID to requests
const addCorrelationId = (req, res, next) => {
  // Check if correlation ID already exists in headers
  req.correlationId = req.headers['x-correlation-id'] || uuidv4();

  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', req.correlationId);

  next();
};

// Simple request logger without extra JSON output
const enhancedRequestLogger = (req, res, next) => {
  // Just pass through - Morgan handles the logging
  next();
};

// Create Morgan middleware instances
const isDevelopment = process.env.NODE_ENV !== 'production';

// Basic Morgan logger (skips errors - they're logged by errorRequestLogger)
const morganLogger = morgan(
  isDevelopment ? developmentFormat : productionFormat,
  {
    stream: winstonStream,
    skip: (req, res) => !shouldLogRequest(req) || res.statusCode >= 400
  }
);

// Error request logger for failed requests
const errorRequestLogger = morgan(
  isDevelopment ? developmentFormat : productionFormat,
  {
    stream: {
      write: (message) => {
        logger.error(`request_error: ${message.trim()}`);
      }
    },
    skip: (req, res) => {
      return !shouldLogRequest(req) || res.statusCode < 400;
    }
  }
);

// Request timing middleware
const requestTiming = (req, res, next) => {
  req.startTime = Date.now();

  // Add timing information to response headers in development
  if (isDevelopment) {
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - req.startTime;
      res.setHeader('X-Response-Time', `${duration}ms`);
      return originalSend.call(this, data);
    };
  }

  next();
};

// Rate limiting logger
const rateLimitLogger = (req, res, next) => {
  // Check if rate limit headers are present
  const rateLimitRemaining = res.getHeader('X-RateLimit-Remaining');
  const rateLimitLimit = res.getHeader('X-RateLimit-Limit');

  if (rateLimitRemaining !== undefined && parseInt(rateLimitRemaining) === 0) {
    const userInfo = extractUserInfo(req);
    logger.business.rateLimitViolation(
      req.ip || req.connection?.remoteAddress,
      req.originalUrl || req.url,
      rateLimitLimit
    );
  }

  next();
};

// Combined request logging middleware
const requestLogger = [
  addCorrelationId,
  requestTiming,
  morganLogger,
  errorRequestLogger,
  enhancedRequestLogger,
  rateLimitLogger
];

export {
  requestLogger,
  addCorrelationId,
  enhancedRequestLogger,
  morganLogger,
  errorRequestLogger,
  requestTiming,
  rateLimitLogger
};

export default requestLogger;
