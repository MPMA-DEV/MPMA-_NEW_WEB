import { z } from "zod";
import { Op } from "sequelize";
import { TraineeUser, Staff } from "../models/index.js";
import {
  generateTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../services/jwtService.js";
import logger from "../config/logger.js";

export const login = async (req, res) => {
  const schema = z.object({
    username: z.string(),
    password: z.string(),
    loginType: z.enum(["trainee", "staff"]).optional(),
  });

  try {
    const parsedData = schema.parse(req.body);
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const { username, password, loginType } = parsedData;
    const isStaffLogin = loginType === "staff";
    const superAdminUsername = process.env.SUPERADMIN_USERNAME;
    const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

    // Log login attempt
    logger.business.userAuth(
      "login_attempt",
      null,
      username,
      ipAddress
    );

    let user = null;

    if (isStaffLogin) {
      // Check Staff table for staff login
      user = await Staff.findOne({
        where: { username },
      });

      // If superadmin credentials are provided and username matches, create/update staff account
      if (
        superAdminUsername &&
        superAdminPassword &&
        username === superAdminUsername
      ) {
        if (!user) {
          user = await Staff.create({
            username,
            password,
            email: process.env.SUPERADMIN_EMAIL || `${username}@localhost`,
            role: "superadmin",
            status: "Active",
          });
        }
      }
    } else {
      // Check TraineeUser table for trainee login
      user = await TraineeUser.findOne({ where: { username } });
    }

    if (user) {
      let isValidPassword = await user.validatePassword(password);

      // For superadmin staff, allow override with env password
      if (
        !isValidPassword &&
        isStaffLogin &&
        superAdminUsername &&
        superAdminPassword &&
        username === superAdminUsername &&
        password === superAdminPassword
      ) {
        isValidPassword = true;
        user.password = password;
        await user.save();
      }

      if (!isValidPassword) {
        // Log failed authentication
        const identifier = user.NIC || user.username;
        logger.business.userAuth(
          "login_failed",
          user.id,
          identifier,
          ipAddress,
          false,
          "Invalid password"
        );

        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      // Check if user account is inactive
      if (user.status === "Inactive") {
        const identifier = user.NIC || user.username;
        logger.business.userAuth(
          "login_failed",
          user.id,
          identifier,
          ipAddress,
          false,
          "Account inactive"
        );

        return res.status(403).json({
          message: "Your account is inactive.",
        });
      }

      // Generate JWT tokens
      const userAgent = req.get("User-Agent");

      const tokens = await generateTokenPair(user, userAgent, ipAddress);

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.JWT_REFRESH_EXPIRY_DAYS) * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      // Set access token as httpOnly cookie
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes (matches JWT_ACCESS_EXPIRY)
        path: "/",
      });

      // Log successful authentication
      const identifier = user.NIC || user.username;
      logger.business.userAuth(
        "login_success",
        user.id,
        identifier,
        ipAddress,
        true
      );

      // Build response user object (flexible for both Staff and TraineeUser)
      const responseUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        status: user.status,
      };

      // Add model-specific fields
      if (user.NIC) responseUser.NIC = user.NIC;
      if (user.notifyChat !== undefined) responseUser.notifyChat = user.notifyChat;
      if (user.notifyPayment !== undefined) responseUser.notifyPayment = user.notifyPayment;
      if (user.notifyHoliday !== undefined) responseUser.notifyHoliday = user.notifyHoliday;
      if (user.role) responseUser.role = user.role;

      return res.status(200).json({
        message: "Login successful",
        user: responseUser,
        tokens: {
          accessToken: tokens.accessToken,
          tokenType: tokens.tokenType,
          expiresIn: tokens.expiresIn,
          // Don't send refresh token in response body
        },
      });
    } else {
      // Log failed authentication - user not found
      logger.business.userAuth(
        "login_failed",
        null,
        username,
        ipAddress,
        false,
        "User not found"
      );

      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

    if (error instanceof z.ZodError) {
      logger.warn("Login validation error", {
        type: "validation_error",
        errors: error.errors,
        ip: ipAddress,
      });

      return res.status(400).json({
        message: "Invalid input",
        errors: error.errors,
      });
    }

    // Log unexpected errors
    logger.error("Login error", {
      type: "authentication_error",
      error: error.message,
      stack: error.stack,
      ip: ipAddress,
    });

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Add a Map to store ongoing refresh operations
const refreshOperations = new Map();

export const refreshToken = async (req, res) => {
  try {
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const currentRefreshToken = req.cookies.refreshToken;

    if (!currentRefreshToken) {
      logger.warn("Refresh token not found", {
        type: "token_refresh_failed",
        reason: "missing_token",
        cookies_received: !!req.cookies,
        refresh_token_present: !!req.cookies?.refreshToken,
        ip: ipAddress,
      });
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // Check if there's an ongoing refresh operation for this token
    if (refreshOperations.has(currentRefreshToken)) {
      // Return the existing promise
      return refreshOperations.get(currentRefreshToken);
    }

    // Create a promise for this refresh operation
    const refreshPromise = (async () => {
      try {
        // Verify the refresh token
        const { payload, user } = await verifyRefreshToken(currentRefreshToken);

        if (!user) {
          logger.warn("User not found during token refresh", {
            type: "token_refresh_failed",
            reason: "user_not_found",
            userId: payload.userId,
            ip: ipAddress,
          });
          return res.status(404).json({ message: "User not found" });
        }

        // Revoke old refresh token first (token rotation)
        await revokeRefreshToken(currentRefreshToken);

        // Generate new token pair
        const userAgent = req.get("User-Agent");
        const tokens = await generateTokenPair(user, userAgent, ipAddress);

        // Set new refresh token as httpOnly cookie
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: Number(process.env.JWT_REFRESH_EXPIRY_DAYS) * 24 * 60 * 60 * 1000, // 7 days
          path: "/",
        });

        // Set access token as httpOnly cookie
        res.cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000, // 15 minutes
          path: "/",
        });

        logger.business.userAuth(
          "token_refresh",
          user.id,
          user.NIC,
          ipAddress,
          true
        );

        return res.status(200).json({
          message: "Token refreshed successfully",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            status: user.status,
            NIC: user.NIC,
            role: user.role,
            notifyChat: user.notifyChat,
            notifyPayment: user.notifyPayment,
            notifyHoliday: user.notifyHoliday
          },
          tokens: {
            accessToken: tokens.accessToken,
            tokenType: tokens.tokenType,
            expiresIn: tokens.expiresIn,
          },
        });
      } finally {
        // Clean up: remove the operation from the Map
        refreshOperations.delete(currentRefreshToken);
      }
    })();

    // Store the promise
    refreshOperations.set(currentRefreshToken, refreshPromise);

    // Wait for the operation to complete
    return await refreshPromise;
  } catch (error) {
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

    logger.error("Refresh token error", {
      type: "token_refresh_error",
      error: error.message,
      stack: error.stack,
      ip: ipAddress,
    });

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const refreshToken = req.cookies.refreshToken;

    // Try to get user info for logging
    let userId = null;
    let userNIC = null;

    if (req.user) {
      userId = req.user.id || req.user.userId;
      userNIC = req.user.nic;
    }

    console.log("Logging out user:", userId, "with token:", refreshToken);
    if (refreshToken) {
      // Revoke the refresh token
      console.log("Revoking refresh token:", refreshToken);
      await revokeRefreshToken(refreshToken);
    }

    // Clear the httpOnly cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Log successful logout
    logger.business.userAuth("logout", userId, userNIC, ipAddress, true);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    const ipAddress =
      req.ip ||
      req.connection?.remoteAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim();

    logger.error("Logout error", {
      type: "logout_error",
      error: error.message,
      stack: error.stack,
      ip: ipAddress,
    });

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.status(200).json({ user: req.user });
};
