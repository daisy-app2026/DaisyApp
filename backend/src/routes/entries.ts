import { Router } from 'express'
import {
  createEntry,
  getEntriesBySpace,
  getRecentEntries,
  updateEntry,
  deleteEntry,
  getEntryStats,
  getUnlockedCapsules,
  markCapsuleNotificationShown,
  getAllEntries,
} from '../controllers/entriesController'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

router.post('/create', verifyToken, createEntry)
router.get('/space/:spaceId', verifyToken, getEntriesBySpace)
router.get('/recent', verifyToken, getRecentEntries)
router.get('/stats', verifyToken, getEntryStats)
router.put('/update/:entryId', verifyToken, updateEntry)
router.delete('/delete/:entryId', verifyToken, deleteEntry)
router.get('/unlocked-capsules', verifyToken, getUnlockedCapsules)
router.put('/mark-shown/:entryId', verifyToken, markCapsuleNotificationShown)
router.get('/all', verifyToken, getAllEntries)

export default router
