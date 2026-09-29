import { Request, Response } from 'express'
import { db } from '../config/firebase'
import crypto from 'crypto'
import axios from 'axios'

const verifyPaddleWebhook = (req: Request): boolean => {
  const secret = process.env.PADDLE_WEBHOOK_SECRET || ''
  if (!secret) {
    console.warn('PADDLE_WEBHOOK_SECRET is not set. Skipping signature verification in development.')
    return true
  }

  const signature = req.headers['paddle-signature'] as string
  if (!signature) return false

  try {
    const parts = signature.split(';')
    let ts = ''
    let h1 = ''

    for (const part of parts) {
      const [key, val] = part.split('=')
      if (key === 'ts') ts = val
      if (key === 'h1') h1 = val
    }

    if (!ts || !h1) return false

    const MAX_AGE = 5 * 60 * 1000
    const webhookAge = Date.now() - (parseInt(ts) * 1000)

    if (isNaN(webhookAge) || webhookAge > MAX_AGE) {
      return false
    }

    const rawBody = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body))

    const payload = `${ts}:${rawBody}`
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return hash === h1
  } catch (error) {
    console.error('Error verifying Paddle signature:', error)
    return false
  }
}

const getPlanFromPriceId = (priceId: string): 'basic' | 'pro' => {
  const basicIds = [
    process.env.PADDLE_BASIC_MONTHLY_ID,
    process.env.PADDLE_BASIC_YEARLY_ID,
  ].filter(Boolean) as string[]

  return basicIds.includes(priceId) ? 'basic' : 'pro'
}

const getPlanLimits = (plan: 'basic' | 'pro' | 'free') => {
  const limits = {
    free: { 
      messageLimit: 30, 
      chatLimit: 3 
    },
    basic: { 
      messageLimit: 150, 
      chatLimit: 10 
    },
    pro: { 
      messageLimit: 500, 
      chatLimit: 15 
    },
  }
  return limits[plan]
}

export const handlePaddleWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!verifyPaddleWebhook(req)) {
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    const rawBodyString = Buffer.isBuffer(req.body)
      ? req.body.toString('utf8')
      : (typeof req.body === 'string' ? req.body : null)

    const event = rawBodyString ? JSON.parse(rawBodyString) : req.body
    const eventType = event.event_type || event.alert_name
    const data = event.data || event

    console.log('Paddle webhook:', eventType)

    const customData = 
      data?.custom_data || 
      data?.items?.[0]?.price?.custom_data || 
      {}
    
    let userId = customData.userId || customData.user_id

    // Fallback: Find user by customer email if custom_data userId is missing
    if (!userId) {
      const customerEmail = data?.customer?.email || data?.user_email || data?.email
      if (customerEmail) {
        const userSnap = await db.collection('users').where('email', '==', customerEmail).limit(1).get()
        if (!userSnap.empty) {
          userId = userSnap.docs[0].id
        }
      }
    }

    if (!userId) {
      console.log('No userId found in custom_data or by customer email lookup!')
      res.status(200).json({ ok: true })
      return
    }

    const priceId = 
      data?.items?.[0]?.price?.id ||
      data?.price_id ||
      ''

    const userRef = db.collection('users').doc(userId)

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.activated': {
        const plan = getPlanFromPriceId(priceId)
        const limits = getPlanLimits(plan)
        const messageResetAt = data.next_billed_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        
        await userRef.update({
          plan,
          ...limits,
          messageResetAt,
          paddleSubscriptionId: data.id || null,
          planActivatedAt: new Date().toISOString(),
          planExpiresAt: data.next_billed_at || null,
          planPaymentFailed: false,
        })
        
        console.log(`User ${userId} upgraded to ${plan}!`)

        try {
          const userSnap = await userRef.get()
          const pushToken = userSnap.data()?.pushToken

          if (pushToken && typeof pushToken === 'string' && pushToken.startsWith('ExponentPushToken')) {
            const planTitle = plan === 'basic' ? '🌼 Welcome to Daisy Basic!' : '🌼 Welcome to Daisy Pro!'
            await axios.post('https://exp.host/--/api/v2/push/send', {
              to: pushToken,
              title: planTitle,
              body: 'Your plan has been upgraded. Enjoy your new limits!',
              data: { screen: 'Profile' },
            })
            console.log(`Push notification sent to user ${userId} for ${plan} plan upgrade!`)
          }
        } catch (pushErr) {
          console.error('Failed to send upgrade push notification:', pushErr)
        }

        break
      }

      case 'subscription.updated': {
        const plan = getPlanFromPriceId(priceId)
        const limits = getPlanLimits(plan)
        const messageResetAt = data.next_billed_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        
        await userRef.update({
          plan,
          ...limits,
          messageResetAt,
          planExpiresAt: data.next_billed_at || null,
        })
        break
      }

      case 'subscription.canceled':
      case 'subscription.cancelled': {
        const messageResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        await userRef.update({
          plan: 'free',
          ...getPlanLimits('free'),
          messageResetAt,
          paddleSubscriptionId: null,
          planExpiresAt: null,
          planCancelledAt: new Date().toISOString(),
        })
        
        console.log(`User ${userId} cancelled!`)
        break
      }

      case 'subscription.past_due':
      case 'transaction.payment_failed': {
        await userRef.update({
          planPaymentFailed: true,
          planPaymentFailedAt: new Date().toISOString(),
        })
        break
      }

      case 'transaction.completed': {
        await userRef.update({
          planPaymentFailed: false,
          lastPaymentAt: new Date().toISOString(),
        })
        break
      }

      default:
        console.log('Unhandled event:', eventType)
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook failed' })
  }
}

export const cancelSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' })
      return
    }

    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const userData = userDoc.data()
    const subscriptionId = userData?.paddleSubscriptionId

    const freeLimits = getPlanLimits('free')
    const messageResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    if (!subscriptionId) {
      await db.collection('users').doc(userId).update({
        plan: 'free',
        ...freeLimits,
        messageResetAt,
        paddleSubscriptionId: null,
        planCancelledAt: new Date().toISOString(),
      })
      res.status(200).json({ success: true, message: 'Subscription cancelled' })
      return
    }

    const apiKey = process.env.PADDLE_API_KEY
    if (apiKey) {
      const isSandbox = apiKey.startsWith('test_') || process.env.PADDLE_ENV === 'sandbox'
      const baseUrl = isSandbox 
        ? 'https://sandbox-api.paddle.com' 
        : 'https://api.paddle.com'

      await axios.post(
        `${baseUrl}/subscriptions/${subscriptionId}/cancel`,
        { effective_from: 'next_billing_period' },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )
    }

    await db.collection('users').doc(userId).update({
      plan: 'free',
      ...freeLimits,
      messageResetAt,
      paddleSubscriptionId: null,
      planCancelledAt: new Date().toISOString(),
    })

    res.status(200).json({ success: true, message: 'Subscription cancelled' })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ error: 'Failed to cancel subscription' })
  }
}
