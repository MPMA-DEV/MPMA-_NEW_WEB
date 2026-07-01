import cron from 'node-cron';
import { tokenCleanupService } from './tokenCleanupService.js';
import { tokenCleanupConfig, validateTokenCleanupConfig } from '../config/tokenCleanup.js';
import logger from '../config/logger.js';

/**
 * Token Cleanup Scheduler
 * 
 * Manages scheduled token cleanup operations using cron jobs
 * Provides graceful startup, shutdown, and error handling
 */
class TokenCleanupScheduler {
  constructor() {
    this.scheduledTask = null;
    this.isInitialized = false;
    this.config = tokenCleanupConfig;
  }

  /**
   * Initialize the scheduler
   */
  async initialize() {
    try {
      // Validate configuration first
      validateTokenCleanupConfig();

      if (!this.config.enabled) {
        logger.info('Token cleanup scheduler disabled', {
          type: 'token_cleanup_scheduler_disabled',
          environment: process.env.NODE_ENV
        });
        return;
      }

      // Validate cron schedule
      if (!cron.validate(this.config.schedule)) {
        throw new Error(`Invalid cron schedule: ${this.config.schedule}`);
      }

      // Create scheduled task
      this.scheduledTask = cron.schedule(
        this.config.schedule,
        this.executeCleanup.bind(this),
        {
          scheduled: false, // Don't start immediately
          timezone: process.env.TZ || 'UTC'
        }
      );

      this.isInitialized = true;

      logger.info('Token cleanup scheduler initialized', {
        type: 'token_cleanup_scheduler_init',
        schedule: this.config.schedule,
        timezone: process.env.TZ || 'UTC',
        retentionPeriods: this.config.retention
      });

    } catch (error) {
      logger.error('Failed to initialize token cleanup scheduler', {
        type: 'token_cleanup_scheduler_init_error',
        error: error.message,
        stack: error.stack,
        config: this.config
      });
      throw error;
    }
  }

  /**
   * Start the scheduled cleanup
   */
  start() {
    if (!this.isInitialized) {
      throw new Error('Scheduler not initialized. Call initialize() first.');
    }

    if (!this.config.enabled) {
      logger.warn('Attempted to start disabled token cleanup scheduler', {
        type: 'token_cleanup_scheduler_start_disabled'
      });
      return;
    }

    if (this.scheduledTask && !this.scheduledTask.running) {
      this.scheduledTask.start();
      
      logger.info('Token cleanup scheduler started', {
        type: 'token_cleanup_scheduler_start',
        schedule: this.config.schedule,
        nextRun: this.getNextRunTime()
      });
    }
  }

  /**
   * Stop the scheduled cleanup
   */
  stop() {
    if (this.scheduledTask && this.scheduledTask.running) {
      this.scheduledTask.stop();
      
      logger.info('Token cleanup scheduler stopped', {
        type: 'token_cleanup_scheduler_stop'
      });
    }
  }

  /**
   * Destroy the scheduler (cleanup resources)
   */
  destroy() {
    if (this.scheduledTask) {
      this.scheduledTask.destroy();
      this.scheduledTask = null;
    }
    
    this.isInitialized = false;
    
    logger.info('Token cleanup scheduler destroyed', {
      type: 'token_cleanup_scheduler_destroy'
    });
  }

  /**
   * Get the next scheduled run time
   */
  getNextRunTime() {
    if (!this.scheduledTask) {
      return null;
    }

    try {
      // This is a simplified approach - node-cron doesn't provide direct next run time
      // In production, you might want to use a more sophisticated cron library
      return 'Next run calculated by cron schedule: ' + this.config.schedule;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      enabled: this.config.enabled,
      running: this.scheduledTask ? this.scheduledTask.running : false,
      schedule: this.config.schedule,
      nextRun: this.getNextRunTime(),
      lastRun: tokenCleanupService.lastRunStats?.startTime || null
    };
  }

  /**
   * Execute the cleanup process (called by cron)
   */
  async executeCleanup() {
    const startTime = new Date();
    
    try {
      logger.info('Scheduled token cleanup starting', {
        type: 'scheduled_token_cleanup_start',
        scheduledTime: startTime
      });

      // Check if cleanup is needed before running
      const cleanupCheck = await tokenCleanupService.checkCleanupNeeded();
      
      if (cleanupCheck.level === 'normal' && cleanupCheck.count === 0) {
        logger.info('Scheduled token cleanup skipped - no tokens to clean', {
          type: 'scheduled_token_cleanup_skip',
          eligibleTokens: cleanupCheck.count
        });
        return;
      }

      // Run the cleanup
      const results = await tokenCleanupService.runCleanup();

      logger.info('Scheduled token cleanup completed successfully', {
        type: 'scheduled_token_cleanup_success',
        duration: results.duration,
        cleaned: results.cleaned,
        batches: results.batches,
        scheduledTime: startTime,
        completedTime: results.endTime
      });

      // Log warning if cleanup took too long
      if (results.duration > 5 * 60 * 1000) { // 5 minutes
        logger.warn('Token cleanup took longer than expected', {
          type: 'token_cleanup_slow',
          duration: results.duration,
          cleaned: results.cleaned
        });
      }

    } catch (error) {
      logger.error('Scheduled token cleanup failed', {
        type: 'scheduled_token_cleanup_error',
        error: error.message,
        stack: error.stack,
        scheduledTime: startTime,
        duration: new Date() - startTime
      });

      // Don't throw - we don't want to crash the scheduler
      // The error is logged and the next scheduled run will try again
    }
  }

  /**
   * Run cleanup immediately (for testing or manual triggers)
   */
  async runNow(force = false) {
    if (!this.isInitialized) {
      throw new Error('Scheduler not initialized');
    }

    logger.info('Manual token cleanup triggered via scheduler', {
      type: 'manual_token_cleanup_via_scheduler',
      force
    });

    return await tokenCleanupService.runCleanup(force);
  }
}

// Export singleton instance
export const tokenCleanupScheduler = new TokenCleanupScheduler();
export default tokenCleanupScheduler;
