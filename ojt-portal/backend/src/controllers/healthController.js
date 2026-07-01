import { sequalize } from '../database/sequlize.js';
import { tokenCleanupService } from '../services/tokenCleanupService.js';
import { tokenCleanupConfig } from '../config/tokenCleanup.js';
import logger from '../config/logger.js';

/**
 * Health Controller
 * 
 * Provides health check endpoints with system status, database connectivity,
 * and token cleanup monitoring
 */

/**
 * Basic health check endpoint
 */
export const healthCheck = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed', {
      type: 'health_check_error',
      error: error.message,
      stack: error.stack
    });

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
};

/**
 * Detailed health check with database and token cleanup status
 */
export const detailedHealthCheck = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {},
      alerts: []
    };

    // Database connectivity check
    try {
      await sequalize.authenticate();
      health.checks.database = {
        status: 'healthy',
        responseTime: null // Could add timing if needed
      };
    } catch (dbError) {
      health.status = 'unhealthy';
      health.checks.database = {
        status: 'unhealthy',
        error: dbError.message
      };
      health.alerts.push('Database connection failed');
    }

    // Token cleanup system check
    if (tokenCleanupConfig.enabled) {
      try {
        const tokenStats = await tokenCleanupService.getTokenStatistics();
        const cleanupCheck = await tokenCleanupService.checkCleanupNeeded();

        health.checks.tokenCleanup = {
          status: 'healthy',
          enabled: true,
          statistics: tokenStats,
          cleanupNeeded: cleanupCheck
        };

        // Add alerts based on token cleanup status
        if (cleanupCheck.level === 'critical') {
          health.status = 'critical';
          health.alerts.push(`Critical: ${cleanupCheck.count} tokens eligible for cleanup`);
        } else if (cleanupCheck.level === 'warning') {
          if (health.status === 'healthy') {
            health.status = 'warning';
          }
          health.alerts.push(`Warning: ${cleanupCheck.count} tokens eligible for cleanup`);
        }

        // Check if cleanup service is running
        if (tokenCleanupService.isRunning) {
          health.checks.tokenCleanup.currentlyRunning = true;
        }

      } catch (cleanupError) {
        health.checks.tokenCleanup = {
          status: 'error',
          enabled: true,
          error: cleanupError.message
        };
        health.alerts.push('Token cleanup system error');
        
        if (health.status === 'healthy') {
          health.status = 'warning';
        }
      }
    } else {
      health.checks.tokenCleanup = {
        status: 'disabled',
        enabled: false
      };
    }

    // Memory usage check
    const memUsage = process.memoryUsage();
    health.checks.memory = {
      status: 'healthy',
      usage: {
        rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024) // MB
      }
    };

    // Set appropriate HTTP status code
    let statusCode = 200;
    if (health.status === 'critical' || health.status === 'unhealthy') {
      statusCode = 503;
    } else if (health.status === 'warning') {
      statusCode = 200; // Still operational, just warning
    }

    res.status(statusCode).json(health);

  } catch (error) {
    logger.error('Detailed health check failed', {
      type: 'detailed_health_check_error',
      error: error.message,
      stack: error.stack
    });

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check failed',
      message: error.message
    });
  }
};

/**
 * Token statistics endpoint (for monitoring/admin)
 */
export const tokenStatistics = async (req, res) => {
  try {
    if (!tokenCleanupConfig.enabled) {
      return res.status(200).json({
        enabled: false,
        message: 'Token cleanup system is disabled'
      });
    }

    const stats = await tokenCleanupService.getTokenStatistics();
    const cleanupCheck = await tokenCleanupService.checkCleanupNeeded();

    const response = {
      enabled: true,
      timestamp: new Date().toISOString(),
      statistics: stats,
      cleanupStatus: cleanupCheck,
      configuration: {
        retentionPeriods: tokenCleanupConfig.retention,
        schedule: tokenCleanupConfig.schedule,
        batchSize: tokenCleanupConfig.batchProcessing.batchSize
      }
    };

    res.status(200).json(response);

  } catch (error) {
    logger.error('Token statistics request failed', {
      type: 'token_statistics_error',
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Failed to retrieve token statistics',
      message: error.message
    });
  }
};

/**
 * Manual token cleanup trigger (for admin use)
 */
export const triggerTokenCleanup = async (req, res) => {
  try {
    if (!tokenCleanupConfig.enabled) {
      return res.status(400).json({
        success: false,
        message: 'Token cleanup system is disabled'
      });
    }

    // Check if cleanup is already running
    if (tokenCleanupService.isRunning) {
      return res.status(409).json({
        success: false,
        message: 'Token cleanup is already running'
      });
    }

    // Get force parameter from query
    const force = req.query.force === 'true';

    logger.info('Manual token cleanup triggered', {
      type: 'manual_token_cleanup_trigger',
      force,
      triggeredBy: req.user?.id || 'unknown'
    });

    // Run cleanup (this is async but we don't wait for completion)
    const cleanupPromise = tokenCleanupService.runCleanup(force);

    // Return immediate response
    res.status(202).json({
      success: true,
      message: 'Token cleanup started',
      force
    });

    // Log completion when done (don't await to avoid blocking response)
    cleanupPromise
      .then(results => {
        logger.info('Manual token cleanup completed', {
          type: 'manual_token_cleanup_complete',
          results
        });
      })
      .catch(error => {
        logger.error('Manual token cleanup failed', {
          type: 'manual_token_cleanup_error',
          error: error.message
        });
      });

  } catch (error) {
    logger.error('Manual token cleanup trigger failed', {
      type: 'manual_token_cleanup_trigger_error',
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Failed to trigger token cleanup',
      message: error.message
    });
  }
};
