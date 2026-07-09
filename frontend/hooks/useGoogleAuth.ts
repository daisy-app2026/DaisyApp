import { useCallback, useState } from 'react'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { 
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { registerUser } from '../services/authService'
import { Alert } from 'react-native'

// Configure Google Sign In!
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  accountName: '',
})

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false)

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true)

      // Check Play Services!
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      })

      // Clear any cached session so the account picker always shows
      try {
        await GoogleSignin.signOut()
      } catch {
        // ignore — user might not have had a session
      }

      // Show account picker! ✅
      const signInResult = await GoogleSignin.signIn()

      // Get ID token!
      const idToken = signInResult.data?.idToken

      if (!idToken) {
        throw new Error('No ID token!')
      }

      // Firebase credential!
      const credential = GoogleAuthProvider.credential(idToken)

      // Sign in to Firebase!
      const result = await signInWithCredential(auth, credential)

      const user = result.user

      // Register in backend!
      await registerUser({
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        photoURL: user.photoURL || '',
      })

    } catch (error) {
      const err = error as { code?: string; message?: string }
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled!')
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log('Already in progress!')
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available!')
      } else {
        console.log('Google sign in error:', error)
        Alert.alert('Sign in failed', 'Could not sign in with Google. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { 
    signInWithGoogle,
    loading 
  }
}
