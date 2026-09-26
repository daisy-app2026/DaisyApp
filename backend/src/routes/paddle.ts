import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { handlePaddleWebhook, cancelSubscription } from '../controllers/paddleController'

const router = Router()

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  validate: {
    xForwardedForHeader: false
  }
})

router.post(
  '/webhook',
  webhookLimiter,
  handlePaddleWebhook
)

router.post('/cancel', cancelSubscription)

export default router
