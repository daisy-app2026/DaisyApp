import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { useEffect } from 'react'
import { signInWithGoogle } 
  from '../services/authService'

// Configure once!
GoogleSignin.configure({
  webClientId: process.env
    .EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
})

export const useGoogleAuth = () => {
  const handleGoogleSignIn = 
    async () => {
      try {
        await GoogleSignin
          .hasPlayServices()
        
        const userInfo = 
          await GoogleSignin.signIn()
        
        const idToken = 
          userInfo.data?.idToken
        
        if (!idToken) {
          throw new Error(
            'No ID token!'
          )
        }

        // Sign in with Firebase!
        await signInWithGoogle(idToken)
        
      } catch (error: any) {
        if (
          error.code === 
          statusCodes.SIGN_IN_CANCELLED
        ) {
          console.log('User cancelled!')
        } else {
          console.log(
            'Google sign in error:',
            error
          )
        }
      }
    }

  return { handleGoogleSignIn }
}
