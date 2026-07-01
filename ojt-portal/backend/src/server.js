import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { syncDatabaseRepetedly } from "./database/sequlize.js";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Import logging system
import logger from "./config/logger.js";
import requestLogger from "./middleware/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/security.js";

// Import token cleanup system
import { tokenCleanupScheduler } from "./services/tokenCleanupScheduler.js";

import Auth from "./routes/Auth.js";
import Trainee from "./routes/trainee.js";
import Profile from "./routes/profile.js";
import Health from "./routes/health.js";
import PasswordReset from "./routes/passwordReset.js";
import ExternalRoutes from "./routes/external.js";



const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 4001;
const environment = process.env.NODE_ENV || "development";

// Log server startup
logger.system.startup(port, environment);

// Enable trust proxy for Apache reverse proxy
app.set("trust proxy", 1);

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log('📡 Incoming request:', req.method, req.path, 'Origin:', req.headers.origin);
  next();
});

// ✅ CORS CONFIGURATION - Dynamic and supports localhost:5174
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mpma.slpa.lk"
];

if (process.env.CORS_ORIGINS) {
  process.env.CORS_ORIGINS.split(",").forEach(origin => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
logger.system.middleware("CORS", "initialized");

// Add request logging middleware
app.use(requestLogger);

// Use Helmet middleware
app.use(helmet());
logger.system.middleware("Helmet", "initialized");

// Add cookie parser middleware
app.use(cookieParser());
logger.system.middleware("Cookie Parser", "initialized");

// Add body parser middleware
app.use(express.json());
logger.system.middleware("Body Parser", "initialized");

// Initialize database with logging
syncDatabaseRepetedly();

// Socket.io removed

// Apply general API rate limiting to all /api routes
app.use("/api", apiLimiter);
logger.system.middleware("API Rate Limiter", "initialized");

import StaffRoutes from "./routes/staff.js";

// Routes
app.use("/auth", Auth);
app.use("/api/trainee", Trainee);
app.use("/api/profile", Profile);
app.use("/health", Health);
app.use("/api/password", PasswordReset);
app.use("/api/staff", StaffRoutes);
app.use("/api/external", ExternalRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize token cleanup system
const initializeTokenCleanup = async () => {
  try {
    await tokenCleanupScheduler.initialize();
    tokenCleanupScheduler.start();

    logger.info("Token cleanup system initialized successfully", {
      type: "token_cleanup_system_init",
      status: tokenCleanupScheduler.getStatus(),
    });
  } catch (error) {
    logger.error("Failed to initialize token cleanup system", {
      type: "token_cleanup_system_init_error",
      error: error.message,
      stack: error.stack,
    });
  }
};

const host = process.env.HOST || "127.0.0.1";
httpServer.listen(port, host, async () => {
  logger.system.startup(port, environment);
  console.log(`🚀 Server running on ${host}:${port} in ${environment} mode`);
  await initializeTokenCleanup();
});