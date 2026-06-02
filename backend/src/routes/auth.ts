import { Router } from 'express';
import { 
  registerUser, 
  getUser,
  updateUserName,
  updateProfilePhoto,
  checkEmail,
  getLanguage,
  updateLanguage
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/register', registerUser);
router.get('/user/:uid', verifyToken, getUser);
router.put('/update-name', verifyToken, updateUserName);
router.put('/update-photo', verifyToken, updateProfilePhoto);
router.post('/check-email', checkEmail);
router.get('/language', verifyToken, getLanguage);
router.put('/update-language', verifyToken, updateLanguage);

export default router;
