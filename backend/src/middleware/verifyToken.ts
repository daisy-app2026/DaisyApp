import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization
      ?.split('Bearer ')[1];

    if (!token) {
      res.status(401).json({ 
        error: 'No token provided' 
      });
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    req.userId = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
};
