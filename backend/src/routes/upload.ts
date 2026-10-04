import { Router } from 'express'
import { getCloudinarySignature } from '../controllers/uploadController'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()
router.get('/signature', verifyToken, getCloudinarySignature)
export default router
