import { Request, Response } from 'express';
import { db, auth } from '../config/firebase';
import { AuthRequest } from '../middleware/verifyToken';
import { APP_CONFIG } from '../config/appConfig';
import { cascadeDeleteUserData } from '../services/accountDeletionService';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { uid, email, name, photoURL } = req.body;

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
        photoURL: photoURL || '',
        pushToken: null,
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

    // Update lastSeen field!
    await userRef.update({
      lastSeen: new Date().toISOString()
    });

    const updatedData = {
      ...userDoc.data(),
      lastSeen: new Date().toISOString()
    };

    res.status(200).json({ 
      success: true, 
      user: updatedData 
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

export const checkEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body
    
    if (!email) {
      res.status(400).json({
        exists: false
      })
      return
    }
    
    // Check in Firebase Auth
    await auth.getUserByEmail(email.trim())
    
    res.status(200).json({
      exists: true
    })
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      res.status(200).json({
        exists: false
      })
    } else {
      res.status(200).json({
        exists: false
      })
    }
  }
}

// Get user language
export const getLanguage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const userDoc = await db
      .collection('users')
      .doc(userId)
      .get()
    
    const language = userDoc.data()?.language || 'en'
    
    res.status(200).json({ language })
  } catch (error) {
    res.status(200).json({ 
      language: 'en' 
    })
  }
}

// Update user language
export const updateLanguage = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { language } = req.body
    
    if (!['en', 'de', 'ar', 'fr'].includes(language)) {
      res.status(400).json({
        error: 'Invalid language'
      })
      return
    }
    
    await db
      .collection('users')
      .doc(userId)
      .update({ language })
    
    res.status(200).json({ 
      success: true 
    })
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    })
  }
}

export const getAppConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({
    privacyPolicyUrl: APP_CONFIG.privacyPolicyUrl,
    termsOfServiceUrl: APP_CONFIG.termsOfServiceUrl,
  })
}

export const deleteMyAccount = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const summary = await cascadeDeleteUserData(userId);
    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('deleteMyAccount controller error:', error);
    res.status(500).json({
      error: 'Server error',
    });
  }
};
