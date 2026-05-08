import { Router } from 'express'
import { 
  getSpaces,
  addSpace,
  deleteSpace
} from '../controllers/spacesController'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

router.get('/', verifyToken, getSpaces)
router.post('/add', verifyToken, addSpace)
router.delete('/delete', verifyToken, deleteSpace)

export default router
