import { Response } from 'express'
import { AuthRequest } from '../middleware/verifyToken'
import crypto from 'crypto'

export const getCloudinarySignature = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (!apiKey || !apiSecret || !cloudName) {
      res.status(500).json({ error: 'Cloudinary not configured' })
      return
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = `daisy/${req.userId}`
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
      .createHash('sha256')
      .update(paramsToSign + apiSecret)
      .digest('hex')

    res.status(200).json({ signature, timestamp, cloudName, apiKey, folder })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate signature' })
  }
}
