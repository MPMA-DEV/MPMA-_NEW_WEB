import rateLimit from "express-rate-limit";

// Rate limiting for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 7,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password change
export const passwordChangeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password changes per hour
  message: {
    success: false,
    message:
      "Too many password change attempts, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 7, // Limit each IP to 20 uploads per 15 minutes
  message: {
    success: false,
    message: "Too many upload attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for chat messages
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 messages per minute
  message: {
    success: false,
    message: "Too many messages sent, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for token refresh
export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 200 refresh attempts per 15 minutes
  message: {
    success: false,
    message:
      "Too many token refresh attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
