import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  registerUser, 
  getUser,
  updateUserName,
  updateProfilePhoto,
  checkEmail,
  getLanguage,
  updateLanguage,
  getAppConfig,
  deleteMyAccount
} from '../controllers/authController';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

const emailCheckLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests' }
});

router.post('/register', verifyToken, registerUser);
router.get('/user/:uid', verifyToken, getUser);
router.put('/update-name', verifyToken, updateUserName);
router.put('/update-photo', verifyToken, updateProfilePhoto);
router.post('/check-email', emailCheckLimiter, checkEmail);
router.get('/language', verifyToken, getLanguage);
router.put('/update-language', verifyToken, updateLanguage);
router.get('/config', getAppConfig);
router.delete('/account', verifyToken, deleteMyAccount);

export default router;
