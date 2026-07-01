import express from 'express';
import { 
  healthCheck, 
  detailedHealthCheck, 
  tokenStatistics, 
  triggerTokenCleanup 
} from '../controllers/healthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Health Check Routes
 * 
 * These endpoints provide system health monitoring and token cleanup management
 */

// Basic health check - no authentication required
router.get('/', healthCheck);
router.get('/ping', healthCheck);
router.get('/status', healthCheck);

// Detailed health check with database and token cleanup status
router.get('/detailed', detailedHealthCheck);

// Token statistics - requires authentication for security
router.get('/tokens', authenticateToken, tokenStatistics);

// Manual token cleanup trigger - requires authentication
router.post('/cleanup/tokens', authenticateToken, triggerTokenCleanup);

export default router;
