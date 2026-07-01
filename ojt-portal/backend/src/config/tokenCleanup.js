export const tokenCleanupConfig = {
  // Enable/disable token cleanup system
  get enabled() {
    return process.env.TOKEN_CLEANUP_ENABLED === 'true' || process.env.NODE_ENV === 'production';
  },

  // Cleanup schedule (cron format) - Default: Daily at 2 AM
  get schedule() {
    return process.env.TOKEN_CLEANUP_SCHEDULE || '0 2 * * *';
  },

  // Retention periods (in days)
  get retention() {
    const expiredDays = process.env.EXPIRED_TOKEN_RETENTION_DAYS;
    const revokedDays = process.env.REVOKED_TOKEN_RETENTION_DAYS;
    return {
      // Clean expired tokens immediately (0 days)
      expiredTokens: expiredDays !== undefined ? parseInt(expiredDays) : 0,

      // Keep revoked tokens for 30 days for audit trail
      revokedTokens: revokedDays !== undefined ? parseInt(revokedDays) : 30
    };
  },

  // Batch processing configuration
  get batchProcessing() {
    return {
      // Number of tokens to process in each batch
      batchSize: parseInt(process.env.CLEANUP_BATCH_SIZE) || 1000,

      // Delay between batches (milliseconds) to prevent database overload
      batchDelay: parseInt(process.env.CLEANUP_BATCH_DELAY) || 100,

      // Maximum number of batches to process in one cleanup run
      maxBatches: parseInt(process.env.CLEANUP_MAX_BATCHES) || 100
    };
  },

  // Alert thresholds
  get alerts() {
    return {
      // Warn if more than this many tokens are eligible for cleanup
      warningThreshold: parseInt(process.env.CLEANUP_WARNING_THRESHOLD) || 10000,

      // Critical alert if more than this many tokens are eligible
      criticalThreshold: parseInt(process.env.CLEANUP_CRITICAL_THRESHOLD) || 50000
    };
  },

  // Logging configuration
  get logging() {
    return {
      // Log cleanup operations
      enabled: process.env.TOKEN_CLEANUP_LOGGING !== 'false',

      // Log detailed statistics
      detailed: process.env.TOKEN_CLEANUP_DETAILED_LOGGING === 'true'
    };
  }
};


/**
 * Validate configuration on startup
 */
export const validateTokenCleanupConfig = () => {
  const config = tokenCleanupConfig;
  const errors = [];

  // Validate retention periods
  if (config.retention.expiredTokens < 0) {
    errors.push('EXPIRED_TOKEN_RETENTION_DAYS must be >= 0');
  }

  if (config.retention.revokedTokens < 0) {
    errors.push('REVOKED_TOKEN_RETENTION_DAYS must be >= 0');
  }

  // Validate batch processing
  if (config.batchProcessing.batchSize <= 0) {
    errors.push('CLEANUP_BATCH_SIZE must be > 0');
  }

  if (config.batchProcessing.maxBatches <= 0) {
    errors.push('CLEANUP_MAX_BATCHES must be > 0');
  }

  // Validate alert thresholds
  if (config.alerts.warningThreshold <= 0) {
    errors.push('CLEANUP_WARNING_THRESHOLD must be > 0');
  }

  if (config.alerts.criticalThreshold <= config.alerts.warningThreshold) {
    errors.push('CLEANUP_CRITICAL_THRESHOLD must be > CLEANUP_WARNING_THRESHOLD');
  }

  if (errors.length > 0) {
    throw new Error(`Token cleanup configuration errors: ${errors.join(', ')}`);
  }

  return true;
};

export default tokenCleanupConfig;
