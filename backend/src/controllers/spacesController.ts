import { Response } from 'express'
import admin, { db } from '../config/firebase'
import { AuthRequest } from '../middleware/verifyToken'

// Default spaces — always present
const DEFAULT_SPACES = [
  { 
    id: 'family', 
    name: 'Family', 
    icon: 'home',
    iconBg: '#FF6B35',
    iconBgLight: 'rgba(255,107,53,0.15)',
    isDefault: true
  },
  { 
    id: 'bestie', 
    name: 'Bestie', 
    icon: 'people',
    iconBg: '#8B5CF6',
    iconBgLight: 'rgba(139,92,246,0.15)',
    isDefault: true
  },
  { 
    id: 'crush', 
    name: 'Crush', 
    icon: 'heart',
    iconBg: '#EC4899',
    iconBgLight: 'rgba(236,72,153,0.15)',
    isDefault: true
  },
  { 
    id: 'vent', 
    name: 'Vent', 
    icon: 'flash',
    iconBg: '#F59E0B',
    iconBgLight: 'rgba(245,158,11,0.15)',
    isDefault: true
  },
  { 
    id: 'imagine', 
    name: 'Imagine', 
    icon: 'sparkles-outline',
    iconBg: '#3B82F6',
    iconBgLight: 'rgba(59,130,246,0.15)',
    isDefault: true
  },
]

// GET all spaces for user
export const getSpaces = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!

    // Get custom spaces from Firestore
    const spacesRef = db
      .collection('users')
      .doc(userId)
      .collection('spaces')

    const snapshot = await spacesRef
      .orderBy('createdAt', 'asc')
      .get()

    const customSpaces = snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() })
    )

    // Get deleted default space IDs
    const userRef = db
      .collection('users')
      .doc(userId)
    const userDoc = await userRef.get()
    const deletedDefaults = 
      userDoc.data()?.deletedDefaultSpaces || []

    // Filter default spaces
    const activeDefaults = DEFAULT_SPACES
      .filter(s => 
        !deletedDefaults.includes(s.id)
      )

    // Combine: defaults first then custom
    const allSpaces = [
      ...activeDefaults,
      ...customSpaces
    ]

    res.status(200).json({
      success: true,
      spaces: allSpaces
    })
  } catch (error) {
    console.error('Error fetching spaces:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

// POST add custom space
export const addSpace = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { name, icon, iconBg, iconBgLight } = req.body

    if (!name || !icon) {
      res.status(400).json({ 
        error: 'name and icon required' 
      })
      return
    }

    const spaceRef = db
      .collection('users')
      .doc(userId)
      .collection('spaces')
      .doc()

    const newSpace = {
      name,
      icon,
      iconBg: iconBg || '#2D5A1B',
      iconBgLight: iconBgLight || 'rgba(45,90,27,0.15)',
      isDefault: false,
      createdAt: new Date().toISOString()
    }

    await spaceRef.set(newSpace)

    res.status(200).json({
      success: true,
      space: { id: spaceRef.id, ...newSpace }
    })
  } catch (error) {
    console.error('Error adding space:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

// DELETE space
export const deleteSpace = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { spaceId, isDefault } = req.body

    if (!spaceId) {
       res.status(400).json({ 
        error: 'spaceId required' 
      })
      return
    }

    if (isDefault) {
      // Add to deletedDefaultSpaces array
      const userRef = db
        .collection('users')
        .doc(userId)
      await userRef.update({
        deletedDefaultSpaces: 
          admin
            .firestore
            .FieldValue
            .arrayUnion(spaceId)
      })
    } else {
      // Delete custom space document
      await db
        .collection('users')
        .doc(userId)
        .collection('spaces')
        .doc(spaceId)
        .delete()
    }

    res.status(200).json({ 
      success: true 
    })
  } catch (error) {
    console.error('Error deleting space:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}
