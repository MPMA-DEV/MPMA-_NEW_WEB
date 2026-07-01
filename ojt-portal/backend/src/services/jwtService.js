import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { TraineeUser, Staff } from '../models/index.js';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m'; // 15 minutes
const JWT_REFRESH_EXPIRY_DAYS = process.env.JWT_REFRESH_EXPIRY_DAYS || '7'; // 7 days

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

export const generateAccessToken = async (payload) => {
  try {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_ACCESS_EXPIRY)
      .setIssuer('mpma-ojt-portal')
      .setAudience('mpma-ojt-users')
      .sign(secret);
    return jwt;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = async (user, payload) => {
  try {
    // Make the refresh token a JWT as well so it contains the user ID
    const refreshToken = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${JWT_REFRESH_EXPIRY_DAYS}d`)
      .setIssuer('mpma-ojt-portal')
      .setAudience('mpma-ojt-refresh')
      .sign(secret);

    // Hash it and store on the user record to allow revocation
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    user.refresh_token = tokenHash;
    await user.save();

    return refreshToken;
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

export const verifyAccessToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'mpma-ojt-portal',
      audience: 'mpma-ojt-users'
    });
    return payload;
  } catch (error) {
    console.error('Error verifying access token:', error);
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const { payload } = await jwtVerify(refreshToken, secret, {
      issuer: 'mpma-ojt-portal',
      audience: 'mpma-ojt-refresh'
    });

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    let user;

    if (payload.role || payload.staffId) {
      user = await Staff.findByPk(payload.userId);
    } else {
      user = await TraineeUser.findByPk(payload.userId);
    }

    if (!user || user.refresh_token !== tokenHash) {
      throw new Error('Refresh token is expired or revoked');
    }

    return { payload, user };
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    throw error;
  }
};

export const revokeRefreshToken = async (refreshToken) => {
  try {
    const { payload } = await jwtVerify(refreshToken, secret, {
      issuer: 'mpma-ojt-portal',
      audience: 'mpma-ojt-refresh'
    }).catch(() => null);

    if (!payload) return false;

    let user;
    if (payload.role || payload.staffId) {
      user = await Staff.findByPk(payload.userId);
    } else {
      user = await TraineeUser.findByPk(payload.userId);
    }

    if (user) {
      user.refresh_token = null;
      await user.save();
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    return false;
  }
};

export const generateTokenPair = async (user, userAgent = null, ipAddress = null) => {
  try {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
    };

    if (user.NIC) payload.NIC = user.NIC;
    if (user.staffId) payload.staffId = user.staffId;
    if (user.role) payload.role = user.role;

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(payload),
      generateRefreshToken(user, payload)
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: JWT_ACCESS_EXPIRY
    };
  } catch (error) {
    console.error('Error generating token pair:', error);
    throw new Error('Failed to generate authentication tokens');
  }
};
