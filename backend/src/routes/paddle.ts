import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { handlePaddleWebhook, cancelSubscription } from '../controllers/paddleController'
import { verifyToken } from '../middleware/verifyToken'

const router = Router()

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  validate: {
    xForwardedForHeader: false
  }
})

router.post(
  '/',
  webhookLimiter,
  handlePaddleWebhook
)

router.post('/cancel', verifyToken, cancelSubscription)

export default router
