import { Request, Response, NextFunction } from 'express';
import { db, auth } from '../config/firebase';
import { APP_CONFIG } from '../config/appConfig';
import { cascadeDeleteUserData } from '../services/accountDeletionService';

const ADMIN_SECRET = 
  process.env.ADMIN_SECRET || 
  'daisy-admin-2026';

// Admin auth middleware
export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) {
    res.status(403).json({
      error: 'Unauthorized'
    });
    return;
  }
  next();
};

// GET /api/admin/stats
export const getStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      usersSnapshot,
      entriesSnapshot,
      pastSessionsSnapshot,
      crushSessionsSnapshot,
    ] = await Promise.all([
      db.collection('users').get(),
      db.collection('entries').get(),
      db.collection('talkToPastSessions').get(),
      db.collection('talkToCrushSessions').get(),
    ]);

    // Active today
    const now = new Date();
    const past24Hours = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    const activeToday = usersSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.lastSeen && data.lastSeen >= past24Hours;
    }).length;

    res.status(200).json({
      totalUsers: usersSnapshot.size,
      activeToday,
      totalEntries: entriesSnapshot.size,
      totalPastSessions: pastSessionsSnapshot.size,
      totalCrushSessions: crushSessionsSnapshot.size,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// GET /api/admin/users
export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const usersSnapshot = await db.collection('users')
      .orderBy('createdAt', 'desc')
      .get();

    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt,
        language: data.language,
        streak: data.streak || 0,
      };
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// DELETE /api/admin/users/:uid
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid } = req.params;

    if (typeof uid !== 'string') {
      res.status(400).json({
        error: 'Invalid user ID'
      });
      return;
    }

    const summary = await cascadeDeleteUserData(uid);

    res.status(200).json({ 
      success: true,
      summary
    });
  } catch (error) {
    console.error('admin deleteUser controller error:', error);
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Last 7 days entries count
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      const snapshot = await db
        .collection('entries')
        .where('createdAt', '>=', dayStr)
        .where('createdAt', '<', dayStr + 'T23:59:59')
        .get();
      
      days.push({
        date: dayStr,
        entries: snapshot.size,
      });
    }

    res.status(200).json({ days });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

// GET /api/admin/config
export const getConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      privacyPolicyUrl: APP_CONFIG.privacyPolicyUrl,
      termsOfServiceUrl: APP_CONFIG.termsOfServiceUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
};

// PUT /api/admin/config
export const updateConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { 
      privacyPolicyUrl, 
      termsOfServiceUrl 
    } = req.body;

    // Update in-memory!
    if (privacyPolicyUrl) {
      APP_CONFIG.privacyPolicyUrl = privacyPolicyUrl;
    }
    if (termsOfServiceUrl) {
      APP_CONFIG.termsOfServiceUrl = termsOfServiceUrl;
    }

    // Save to Firestore! ✅
    await db
      .collection('config')
      .doc('appConfig')
      .set({
        privacyPolicyUrl: APP_CONFIG.privacyPolicyUrl,
        termsOfServiceUrl: APP_CONFIG.termsOfServiceUrl,
        updatedAt: new Date().toISOString(),
      });

    res.status(200).json({
      success: true,
      config: {
        privacyPolicyUrl: APP_CONFIG.privacyPolicyUrl,
        termsOfServiceUrl: APP_CONFIG.termsOfServiceUrl,
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
};
