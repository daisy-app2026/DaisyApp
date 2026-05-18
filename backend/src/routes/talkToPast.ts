import { Router } from 'express';
import {
  createSession,
  getSessions,
  getSession,
  sendMessage,
  deleteSession,
} from '../controllers/talkToPastController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/sessions', verifyToken, createSession);
router.get('/sessions', verifyToken, getSessions);
router.get('/sessions/:sessionId', verifyToken, getSession);
router.post('/sessions/:sessionId/message', verifyToken, sendMessage);
router.delete('/sessions/:sessionId', verifyToken, deleteSession);

export default router;
