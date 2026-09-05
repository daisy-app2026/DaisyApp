import { useState } from 'react'
import * as AppleAuthentication from 'expo-apple-authentication'
import {
  OAuthProvider,
  signInWithCredential
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { registerUser } from '../services/authService'

export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false)

  const signInWithApple = async () => {
    try {
      setLoading(true)

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      const provider = new OAuthProvider('apple.com')
      
      const oAuthCredential = provider.credential({
        idToken: credential.identityToken!,
        rawNonce: credential.authorizationCode!,
      })

      const result = await signInWithCredential(
        auth,
        oAuthCredential
      )

      const user = result.user

      const name = 
        credential.fullName?.givenName
          ? `${credential.fullName.givenName} ${credential.fullName.familyName || ''}`.trim()
          : user.displayName || 
            user.email?.split('@')[0] || 
            'User'

      await registerUser({
        uid: user.uid,
        email: user.email || '',
        name,
        photoURL: user.photoURL || '',
      })

    } catch (error: unknown) {
      const err = error as { code?: string }
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        console.log('Apple sign in error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return { 
    signInWithApple, 
    loading 
  }
}
