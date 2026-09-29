import { Router } from 'express';
import {
  adminAuth,
  adminLogin,
  getStats,
  getUsers,
  deleteUser,
  getAnalytics,
  getConfig,
  updateConfig,
  getServiceHealth,
  getPricing,
  updatePricing,
  getSubscriptionStats,
  clearCache,
  getPlanLimits,
  updatePlanLimits,
} from '../controllers/adminController';
import { 
  sendAll 
} from '../controllers/notificationController';

const router = Router();

// Public login route
router.post('/login', adminLogin);

// All routes protected!
router.use(adminAuth);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:uid', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/config', getConfig);
router.put('/config', updateConfig);
router.get('/service-health', getServiceHealth);
router.get('/pricing', getPricing);
router.put('/pricing', updatePricing);
router.get('/plans/limits', getPlanLimits);
router.put('/plans/limits', updatePlanLimits);
router.get('/subscription-stats', getSubscriptionStats);
router.delete('/cache', clearCache);
router.post('/notifications/send', sendAll);

export default router;
