import { Sequelize } from "sequelize";
import logger from "../config/logger.js";

export const sequalize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME || process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT || "mysql",

  // Connection Pool Configuration for scalability
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 20,      // Maximum number of connections in pool
    min: parseInt(process.env.DB_POOL_MIN) || 5,       // Minimum number of connections in pool
    acquire: 30000,                                     // Maximum time (ms) to acquire connection before throwing error
    idle: 10000,                                        // Maximum time (ms) a connection can be idle before being released
    evict: 1000,                                        // Time interval (ms) for evicting stale connections
  },

  // Retry configuration for connection failures
  retry: {
    max: 3,                                             // Maximum retry attempts
    backoffBase: 1000,                                  // Initial backoff time (ms)
    backoffExponent: 1.5,                               // Backoff multiplier
  },

  // Disable SQL logging in production for clean console
  logging: process.env.NODE_ENV === "production" ? false : (sql, timing) => {
    logger.debug("SQL Query", {
      type: "database_query",
      sql: sql.substring(0, 500) + (sql.length > 500 ? "..." : ""),
      timing,
    });
  },
});

export const sync = async () => {
  try {
    await sequalize.authenticate();
    logger.system.database("connected", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

    await sequalize.sync({ alter: true });
    logger.business.databaseEvent(
      "sync",
      "All models synchronized successfully",
      true
    );
  } catch (error) {
    logger.system.database("failed", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      error: error.message,
    });

    logger.error("Database connection failed", {
      type: "database_error",
      error: error.message,
      stack: error.stack,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

    throw error;
  }
};

export const syncDatabaseRepetedly = async () => {
  // Run a single sync at startup only
  try {
    await sync();
  } catch (error) {
    logger.error("Database sync at startup failed", {
      type: "database_sync_error",
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Add pool monitoring (development only)
if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const pool = sequalize.connectionManager.pool;
    if (pool) {
      logger.debug("Connection Pool Stats", {
        total: pool.size,
        used: pool.used,
        waiting: pool.pending,
      });
    }
  }, 5 * 60000); // Log every 5min
}
