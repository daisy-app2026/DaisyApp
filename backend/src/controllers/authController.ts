import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/verifyToken';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid, email, name } = req.body;

    if (!uid || !email) {
      res.status(400).json({ 
        error: 'uid and email required' 
      });
      return;
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid,
        email,
        name: name || '',
        createdAt: new Date().toISOString(),
        streak: 0,
        lastEntryDate: null,
        language: 'en',
        notifications: true,
        deletedDefaultSpaces: [],
      });
    }

    const userData = (await userRef.get()).data();

    res.status(200).json({ 
      success: true, 
      user: userData 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid } = req.params;

    const userRef = db.collection('users').doc(uid as string);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      res.status(404).json({ 
        error: 'User not found' 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      user: userDoc.data() 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

export const updateUserName = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { name } = req.body

    await db
      .collection('users')
      .doc(userId)
      .update({ name })

    res.status(200).json({ 
      success: true 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

export const updateProfilePhoto = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { photoURL } = req.body

    await db
      .collection('users')
      .doc(userId)
      .update({ photoURL })

    res.status(200).json({ 
      success: true,
      photoURL 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}
