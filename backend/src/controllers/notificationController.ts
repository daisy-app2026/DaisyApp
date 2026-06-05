import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/verifyToken';
import { 
  sendToAllUsers,
  savePushToken 
} from '../services/notificationService';

const ADMIN_SECRET = 
  process.env.ADMIN_SECRET || 
  'daisy-admin-2026';

// Save token endpoint
export const saveToken = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        error: 'Token required'
      });
      return;
    }

    await savePushToken(userId, token);
    res.status(200).json({ 
      success: true 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// Send to all users (Admin only!)
export const sendAll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Admin check!
    const adminToken = req.headers['x-admin-secret'];
    
    if (adminToken !== ADMIN_SECRET) {
      res.status(403).json({
        error: 'Unauthorized'
      });
      return;
    }

    const { title, body } = req.body;

    if (!title || !body) {
      res.status(400).json({
        error: 'Title and body required'
      });
      return;
    }

    await sendToAllUsers(title, body);
    
    res.status(200).json({
      success: true,
      message: 'Notifications sent!'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
};
