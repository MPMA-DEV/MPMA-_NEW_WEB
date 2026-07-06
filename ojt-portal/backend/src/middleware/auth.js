import { verifyAccessToken } from '../services/jwtService.js';
import { TraineeUser, Staff } from '../models/index.js';

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = req.cookies?.accessToken || (authHeader && authHeader.split(' ')[1]); // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify the token
    const decoded = await verifyAccessToken(token);

    // Optionally fetch fresh user data from database
    let user = null;
    let isStaff = false;

    if (decoded.role && ['superadmin', 'admin', 'staff'].includes(decoded.role)) {
      user = await Staff.findByPk(decoded.userId);
      isStaff = !!user;
    } else {
      user = await TraineeUser.findByPk(decoded.userId);
      // Fallback in case old staff token doesn't have role
      if (!user) {
        user = await Staff.findByPk(decoded.userId);
        isStaff = !!user;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status || 'Active', // Staff might not have a status field
      role: isStaff ? user.role : 'trainee',
      NIC: user.NIC,
      staffId: user.staffId
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired access token'
    });
  }
};

/**
 * Middleware to authenticate JWT tokens (optional - doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = req.cookies?.accessToken || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Verify the token
    const decoded = await verifyAccessToken(token);

    // Fetch user data
    let user = null;
    let isStaff = false;

    if (decoded.role && ['superadmin', 'admin', 'staff'].includes(decoded.role)) {
      user = await Staff.findByPk(decoded.userId);
      isStaff = !!user;
    } else {
      user = await TraineeUser.findByPk(decoded.userId);
    }

    if (user && (isStaff || user.status === 'Active')) {
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        NIC: user.NIC,
        status: user.status || 'Active',
        role: isStaff ? user.role : 'trainee'
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Token is invalid, but we don't fail the request
    req.user = null;
    next();
  }
};

/**
 * Middleware to check if user has specific status
 * @param {string|Array} allowedStatuses - Status or array of statuses
 * @returns {Function} - Express middleware function
 */
export const requireStatus = (...allowedStatuses) => {
  // Flatten in case an array was passed
  const statuses = allowedStatuses.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!statuses.includes(req.user.status)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required status: ${statuses.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has specific role
 * @param {string|Array} allowedRoles - Role or array of roles
 * @returns {Function} - Express middleware function
 */
export const requireRole = (...allowedRoles) => {
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to ensure the authenticated user is only accessing their own data
 * or has staff privileges.
 * 
 * @param {string} field - The name of the field to check (e.g. 'userId', 'id', 'nic')
 * @param {string} location - Where to find the field in the request ('params' or 'body')
 * @param {string} type - What the field represents ('id' or 'nic')
 */
export const authorizeUserOrStaff = (field = 'userId', location = 'params', type = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const requestedValue = req[location] && req[location][field] ? req[location][field] : (req.parsedBody && req.parsedBody[field]);
    if (!requestedValue) {
      // If the field isn't present, we let the controller or validation handle it
      return next();
    }

    const isStaff = ['superadmin', 'admin', 'staff'].includes(req.user.role);
    if (isStaff) {
      return next();
    }

    let isOwner = false;
    if (type === 'id') {
      isOwner = req.user.id.toString() === requestedValue.toString();
    } else if (type === 'nic') {
      isOwner = req.user.NIC === requestedValue;
    }

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only access your own data'
      });
    }

    next();
  };
};
