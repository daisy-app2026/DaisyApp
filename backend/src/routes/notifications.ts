import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { adminAuth } from '../controllers/adminController';
import {
  saveToken,
  sendAll
} from '../controllers/notificationController';

const router = Router();

// Save push token (authenticated)
router.post('/save-token', verifyToken, saveToken);

// Send to all (admin only!)
router.post('/send-all', adminAuth, sendAll);

export default router;
