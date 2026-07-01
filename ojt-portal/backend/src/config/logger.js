import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Environment configuration
const isDevelopment = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

// Console line counter for auto-clear (production only)
let consoleLineCount = 0;
const MAX_CONSOLE_LINES = 500;

// Count actual lines in output (including newlines within strings)
const countLines = (...args) => {
  let lines = 1;
  for (const arg of args) {
    if (typeof arg === "string") {
      lines += (arg.match(/\n/g) || []).length;
    } else if (arg !== null && arg !== undefined) {
      const str = typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg);
      lines += (str.match(/\n/g) || []).length;
    }
  }
  return lines;
};

// Store original console.log before any overrides
const originalConsoleLog = console.log;

const clearConsoleIfNeeded = (...args) => {
  if (!isDevelopment) {
    consoleLineCount += countLines(...args);
    if (consoleLineCount >= MAX_CONSOLE_LINES) {
      process.stdout.write("\x1Bc");
      originalConsoleLog(`📋 Console cleared (${MAX_CONSOLE_LINES} lines limit)`);
      consoleLineCount = 0;
    }
  }
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    // Handle null
    if (value === null) return null;

    // Handle basic types
    if (typeof value !== "object") return value;

    // Handle Date objects
    if (value instanceof Date) return value;

    // Handle circular references
    if (seen.has(value)) return "[Circular Reference]";

    // Handle Sequelize specific objects
    if (value.constructor) {
      if (value.constructor.name === "Sequelize") return "[Sequelize Instance]";
      if (value.constructor.name.includes("Model")) return "[Sequelize Model]";
      if (value.constructor.name.includes("Instance"))
        return "[Model Instance]";
      if (value.constructor.name.includes("Dialect"))
        return "[Database Dialect]";
    }

    seen.add(value);
    return value;
  };
};

// Custom format for console output in development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ level: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Clean up metadata by removing common fields
    const filteredMeta = { ...meta };
    delete filteredMeta.service;
    delete filteredMeta.environment;
    delete filteredMeta.timestamp;
    delete filteredMeta.level;

    // Create base log message
    let logMessage = `${timestamp} ${level}: ${message}`;

    // Add metadata as JSON string if present
    if (Object.keys(filteredMeta).length > 0) {
      try {
        // Use the circular replacer
        const metaString = JSON.stringify(
          filteredMeta,
          getCircularReplacer(),
          2
        );
        logMessage += ` | ${metaString}`;
      } catch (error) {
        // Fallback if JSON stringify fails
        logMessage += ` | [Complex Object: Could not stringify]`;
      }
    }

    return logMessage;
  })
);

// Production format - clean, minimal, human-readable
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    // Get level icon
    const levelIcons = {
      error: "❌",
      warn: "⚠️",
      info: "✅",
      debug: "🔍",
    };
    const icon = levelIcons[level] || "📋";

    // Clean up metadata - only show important fields
    const filteredMeta = { ...meta };
    delete filteredMeta.service;
    delete filteredMeta.environment;
    delete filteredMeta.timestamp;
    delete filteredMeta.level;

    // For HTTP requests, format nicely
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    const foundMethod = httpMethods.find(m => message && (message.includes(` ${m} `) || message.startsWith(`${m} `)));

    if (foundMethod) {
      const parts = message.split(" ");
      const methodIndex = parts.findIndex(p => httpMethods.includes(p));

      if (methodIndex !== -1 && parts.length > methodIndex + 3) {
        const ip = methodIndex > 0 ? parts.slice(0, methodIndex).join(" ") : null;
        const method = parts[methodIndex];
        const path = parts[methodIndex + 1];
        const status = parts[methodIndex + 2];

        // Find response time (look for number before "ms")
        let time = "0";
        for (let i = methodIndex + 3; i < parts.length; i++) {
          if (parts[i] === "ms" && i > 0) {
            time = parts[i - 1];
            break;
          }
          // Handle case where time and ms are together like "5.123ms"
          if (parts[i].endsWith("ms")) {
            time = parts[i].replace("ms", "");
            break;
          }
        }

        // Method colors for console output
        const methodColors = {
          GET: '\x1b[32m',    // Green
          POST: '\x1b[33m',   // Yellow
          PUT: '\x1b[34m',    // Blue
          DELETE: '\x1b[31m', // Red
          PATCH: '\x1b[35m',  // Magenta
          OPTIONS: '\x1b[37m' // White
        };
        const resetColor = '\x1b[0m';
        const methodColor = methodColors[method] || '\x1b[0m';

        const httpPart = ip
          ? `${ip} → ${method} ${path} → ${status} (${time}ms)`
          : `${method} ${path} → ${status} (${time}ms)`;

        const httpOutput = `${timestamp} ${icon} ${methodColor}${httpPart}${resetColor}`;
        // Check if console needs clearing (pass output for line counting)
        clearConsoleIfNeeded(httpOutput);
        return httpOutput;
      }
    }

    // For simple messages, just show the message
    let output = `${timestamp} ${icon} ${message}`;

    // Add minimal metadata if present and important
    const importantKeys = ["userId", "error", "port", "host"];
    const importantMeta = Object.keys(filteredMeta)
      .filter((key) => importantKeys.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: filteredMeta[key] }), {});

    if (Object.keys(importantMeta).length > 0) {
      try {
        output += ` | ${JSON.stringify(importantMeta)}`;
      } catch (e) {
        // Ignore stringify errors
      }
    }

    // Check if console needs clearing (pass output for line counting)
    clearConsoleIfNeeded(output);

    return output;
  })
);

// File format for structured logging
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console transport configuration
const consoleTransport = new winston.transports.Console({
  level: logLevel,
  format: isDevelopment ? developmentFormat : productionFormat,
  handleExceptions: true,
  handleRejections: true,
});

// Error log file transport
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "error",
  format: fileFormat,
  maxSize: "20m",
  maxFiles: "14d",
  zippedArchive: true,
  handleExceptions: true,
  handleRejections: true,
});

// Business log file transport (info and above, excluding errors)
const businessFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "business-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "info",
  format: fileFormat,
  maxSize: "20m",
  maxFiles: "14d",
  zippedArchive: true,
  // Custom filter to exclude error level logs (they go to error file)
  filter: (info) => info.level !== "error",
});

// Create Winston logger instance
const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: {
    service: "mpma-ojt-portal-backend",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [consoleTransport, errorFileTransport, businessFileTransport],
  exitOnError: false,
});

// Add correlation ID support
logger.addCorrelationId = (correlationId) => {
  return logger.child({ correlationId });
};

// Utility function to sanitize sensitive data
const sanitizeData = (data) => {
  if (!data || typeof data !== "object") return data;

  const sensitiveFields = [
    "password",
    "token",
    "authorization",
    "cookie",
    "secret",
    "key",
  ];

  try {
    // Create a new object using the circular replacer
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (!value || typeof value !== "object") {
          const lowerKey = key.toLowerCase();
          if (sensitiveFields.some((field) => lowerKey.includes(field))) {
            return "[REDACTED]";
          }
          return value;
        }
        return getCircularReplacer()(key, value);
      })
    );
  } catch (error) {
    // Fallback if JSON operations fail
    return "[Complex Object: Could not sanitize]";
  }
};

// Enhanced logging methods with context
logger.logWithContext = (level, message, context = {}) => {
  const sanitizedContext = sanitizeData(context);
  logger[level](message, sanitizedContext);
};

// Business event logging methods
logger.business = {
  userAuth: (action, userId, nic, ip, success = true, error = null) => {
    const logData = { userId, nic, ip, success };
    if (error) logData.error = sanitizeData(error);

    logger.info(`user_${action}`, logData);
  },

  fileOperation: (
    action,
    userId,
    filename,
    ip,
    success = true,
    error = null
  ) => {
    const logData = { userId, filename, ip, success };
    if (error) logData.error = sanitizeData(error);

    logger.info(`file_${action}`, logData);
  },

  databaseEvent: (action, details, success = true, error = null) => {
    const logData = { details, success };
    if (error) logData.error = sanitizeData(error);

    logger.info(`database_${action}`, logData);
  },

  rateLimitViolation: (ip, endpoint, limit) => {
    logger.warn("rate_limit_exceeded", {
      ip,
      endpoint,
      limit,
    });
  },
};

// System logging methods (console only)
logger.system = {
  startup: (port, environment) => {
    logger.info("server_startup", {
      port,
      environment,
    });
  },

  database: (status, details = {}) => {
    logger.info(`database_${status}`, {
      ...details,
    });
  },

  middleware: (name, status) => {
    logger.info(`middleware_${status}`, {
      name,
    });
  },
};

// Suppress console.log in production for clean output
if (!isDevelopment) {
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;

  // Override console methods in production to suppress noise
  console.log = (...args) => {
    // Only allow startup messages (with emojis) through
    const message = args[0]?.toString() || "";
    if (message.includes("🚀") || message.includes("🛑")) {
      originalConsoleLog.apply(console, args);
    }
    // All other console.log calls are suppressed in production
  };

  console.info = (...args) => {
    // Suppress info calls - use logger.info instead
  };

  console.debug = (...args) => {
    // Suppress debug calls - use logger.debug instead
  };
}

export default logger;

