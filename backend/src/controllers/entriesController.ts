import { Response } from 'express'
import admin, { db } from '../config/firebase'
import { AuthRequest } from '../middleware/verifyToken'
import { sendCapsuleNotification } from '../services/notificationService'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper to extract public ID
const getCloudinaryPublicId = (url: string): string => {
  try {
    const parts = url.split('/')
    const uploadIndex = parts.indexOf('upload')
    const pathAfterUpload = parts.slice(uploadIndex + 2)
    const filename = pathAfterUpload.join('/')
    return filename.split('.')[0]
  } catch {
    return ''
  }
}

// Delete Cloudinary files
export const deleteEntryMedia = async (
  content: unknown
): Promise<void> => {
  try {
    if (!content) return

    // Extract URLs from any format!
    const urls: string[] = []

    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          urls.push(...parsed)
        } else {
          urls.push(content)
        }
      } catch {
        urls.push(content)
      }
    } else if (Array.isArray(content)) {
      urls.push(...content)
    }

    // Delete each URL from Cloudinary!
    for (const url of urls) {
      if (
        !url ||
        typeof url !== 'string' ||
        !url.includes('cloudinary.com')
      ) continue

      // Extract public ID from URL!
      const parts = url.split('/')
      const uploadIndex = 
        parts.indexOf('upload')
      if (uploadIndex === -1) continue

      const pathAfterUpload = 
        parts.slice(uploadIndex + 2)
      const publicId = 
        pathAfterUpload
          .join('/')
          .split('.')[0]

      if (!publicId) continue

      // Try image first, then video, then raw!
      const resourceTypes = [
        'image', 'video', 'raw'
      ]

      for (const resourceType of resourceTypes) {
        try {
          await cloudinary.uploader.destroy(
            publicId,
            { resource_type: resourceType }
          )
          console.log(
            `Cloudinary deleted (${resourceType}):`,
            publicId
          )
          break // Success! Stop trying!
        } catch (err: any) {
          if (
            err?.http_code === 404 ||
            err?.result === 'not found'
          ) {
            continue // Try next type!
          }
          // Not a type error, skip!
          console.log(
            'Cloudinary delete error:',
            err?.message
          )
          break
        }
      }
    }
  } catch (error) {
    console.log(
      'deleteEntryMedia error:', error
    )
  }
}


const updateStreak = async (userId: string) => {
  const userRef = db
    .collection('users')
    .doc(userId)
  
  const userDoc = await userRef.get()
  const userData = userDoc.data()
  
  const lastEntryDate = userData?.lastEntryDate || null
  const currentStreak = userData?.streak || 0
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayStr = today
    .toISOString()
    .split('T')[0]
  
  // Already wrote today — no change
  if (lastEntryDate === todayStr) {
    return currentStreak
  }
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday
    .toISOString()
    .split('T')[0]
  
  let newStreak = 1
  
  // Wrote yesterday — continue streak
  if (lastEntryDate === yesterdayStr) {
    newStreak = currentStreak + 1
  }
  // Missed days — reset to 1
  
  await userRef.update({
    streak: newStreak,
    lastEntryDate: todayStr,
  })
  
  return newStreak
}

// CREATE entry
export const createEntry = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const {
      title,
      content,
      type,
      spaceId,
      spaceName,
      isCapsule,
      capsuleDuration,
      unlockDate,
    } = req.body

    if (!content && !title) {
      res.status(400).json({
        error: 'Content or title required'
      })
      return
    }

    const entryRef = db
      .collection('entries')
      .doc()

    const newEntry = {
      id: entryRef.id,
      userId,
      title: title || '',
      content: content || '',
      type: type || 'text',
      spaceId,
      spaceName,
      isCapsule: isCapsule || false,
      capsuleDuration: capsuleDuration || null,
      unlockDate: unlockDate || null,
      isEdited: false,
      editCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await entryRef.set(newEntry)

    // Index text entries in Pinecone
    if (
      (type === 'text' || !type) && 
      content
    ) {
      const { indexDiaryEntry } = 
        require('../services/pineconeService')
      
      indexDiaryEntry(
        userId,
        entryRef.id,
        title || '',
        content,
        spaceId || '',
        spaceName || '',
        new Date().toISOString()
      ).catch((err: any) => 
        console.error('Pinecone err:', err)
      )
    }

    await updateStreak(userId)

    res.status(200).json({
      success: true,
      entry: newEntry
    })
  } catch (error) {
    console.error('Error creating entry:', error)
    res.status(500).json({
      error: 'Server error'
    })
  }
}

// GET entries by space
export const getEntriesBySpace = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const { spaceId } = req.params

    const snapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .where('spaceId', '==', spaceId)
      .orderBy('createdAt', 'desc')
      .get()

    const entries = snapshot.docs.map(
      doc => doc.data()
    )

    res.status(200).json({
      success: true,
      entries
    })
  } catch (error) {
    console.error('Error fetching entries by space:', error)
    res.status(500).json({
      error: 'Server error'
    })
  }
}

// GET recent entries (all spaces)
export const getRecentEntries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!

    const snapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(7)
      .get()

    const entries = snapshot.docs.map(
      doc => doc.data()
    )

    res.status(200).json({
      success: true,
      entries
    })
  } catch (error) {
    console.error('Error fetching recent entries:', error)
    res.status(500).json({
      error: 'Server error'
    })
  }
}

// UPDATE entry
export const updateEntry = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const entryId = req.params.entryId as string
    const { title, content } = req.body

    const entryRef = db
      .collection('entries')
      .doc(entryId)

    const entryDoc = await entryRef.get()

    if (!entryDoc.exists) {
      res.status(404).json({
        error: 'Entry not found'
      })
      return
    }

    const entryData = entryDoc.data()!

    if (entryData.userId !== userId) {
      res.status(403).json({
        error: 'Unauthorized'
      })
      return
    }

    // Capsule can only be edited once
    if (entryData.isCapsule &&
      entryData.editCount >= 1) {
      res.status(403).json({
        error: 'Capsule can only be edited once'
      })
      return
    }

    await entryRef.update({
      title: title || entryData.title,
      content: content || entryData.content,
      isEdited: true,
      editCount: entryData.editCount + 1,
      updatedAt: new Date().toISOString(),
    })

    const updated =
      (await entryRef.get()).data()

    res.status(200).json({
      success: true,
      entry: updated
    })
  } catch (error) {
    console.error('Error updating entry:', error)
    res.status(500).json({
      error: 'Server error'
    })
  }
}

// DELETE entry
export const deleteEntry = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const entryId = req.params.entryId as string

    const entryRef = db
      .collection('entries')
      .doc(entryId)

    const entryDoc = await entryRef.get()

    if (!entryDoc.exists) {
      res.status(404).json({
        error: 'Entry not found'
      })
      return
    }

    const entryData = entryDoc.data()

    if (entryData?.userId !== userId) {
      res.status(403).json({
        error: 'Unauthorized'
      })
      return
    }

    // Delete media from Cloudinary!
    if (entryData?.content) {
      await deleteEntryMedia(entryData.content)
    }

    // Then delete Firestore entry!
    await entryRef.delete()

    const { deleteEntryFromPinecone } = 
      require('../services/pineconeService')

    deleteEntryFromPinecone(userId, entryId)
      .catch((err: any) => 
        console.error('Delete err:', err)
      )

    res.status(200).json({
      success: true
    })
  } catch (error) {
    console.error('Error deleting entry:', error)
    res.status(500).json({
      error: 'Server error'
    })
  }
}

export const getEntryStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!

    const snapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .get()

    const entries = snapshot.docs.map(
      doc => doc.data()
    )

    const totalEntries = entries.length
    const totalCapsules = entries.filter(
      e => e.isCapsule
    ).length

    // Streak calculation:
    // Get user streak from Firestore
    const userDoc = await db
      .collection('users')
      .doc(userId)
      .get()
    const streak = 
      userDoc.data()?.streak || 0

    res.status(200).json({
      success: true,
      stats: {
        entries: totalEntries,
        capsules: totalCapsules,
        streak
      }
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

// GET unlocked capsules for notifications
export const getUnlockedCapsules = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const today = new Date()
      .toISOString()
      .split('T')[0]

    const snapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .where('isCapsule', '==', true)
      .get()

    const entries = snapshot.docs
      .map(doc => doc.data())

    // Find capsules that just unlocked 
    // (unlockDate <= today) and haven't shown notification
    const unlockedCapsules = entries.filter(
      e => {
        if (!e.unlockDate) return false
        if (e.notificationShown) 
          return false
        
        // Handle both formats:
        // Old: "2026-06-12T18:22:00.000Z"
        // New: "2026-06-12"
        const unlockDay = e.unlockDate
          .split('T')[0]
        
        return unlockDay <= today
      }
    )

    if (unlockedCapsules.length > 0) {
      await sendCapsuleNotification(userId);
      for (const capsule of unlockedCapsules) {
        await db.collection('entries').doc(capsule.id).update({
          notificationShown: true
        });
      }
    }

    res.status(200).json({
      success: true,
      unlockedCapsules
    })
  } catch (error) {
    console.error('Error fetching unlocked capsules:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

// MARK capsule notification as shown
export const markCapsuleNotificationShown = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!
    const entryId = req.params.entryId as string

    const entryRef = db
      .collection('entries')
      .doc(entryId)

    const doc = await entryRef.get()
    
    if (!doc.exists) {
      res.status(404).json({ error: 'Entry not found' })
      return
    }

    if (doc.data()?.userId !== userId) {
      res.status(403).json({ 
        error: 'Unauthorized' 
      })
      return
    }

    await entryRef.update({
      notificationShown: true
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error marking capsule notification as shown:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}

// GET all entries for user
export const getAllEntries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!

    const snapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const entries = snapshot.docs
      .map(doc => doc.data())

    res.status(200).json({
      success: true,
      entries
    })
  } catch (error) {
    console.error('Error fetching all entries:', error)
    res.status(500).json({ 
      error: 'Server error' 
    })
  }
}
