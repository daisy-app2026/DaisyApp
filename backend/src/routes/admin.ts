import { Router } from 'express';
import {
  adminAuth,
  getStats,
  getUsers,
  deleteUser,
  getAnalytics,
  getConfig,
  updateConfig,
} from '../controllers/adminController';
import { 
  sendAll 
} from '../controllers/notificationController';

const router = Router();

// All routes protected!
router.use(adminAuth);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:uid', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/config', getConfig);
router.put('/config', updateConfig);
router.post('/notifications/send', sendAll);

export default router;
