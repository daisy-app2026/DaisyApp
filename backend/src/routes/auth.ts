import { Router } from 'express';
import { 
  registerUser, 
  getUser,
  updateUserName,
  updateProfilePhoto
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/register', registerUser);
router.get('/user/:uid', verifyToken, getUser);
router.put('/update-name', verifyToken, updateUserName);
router.put('/update-photo', verifyToken, updateProfilePhoto);

export default router;
