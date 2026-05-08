import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { signInWithGoogleCredential } 
  from '../services/authService'
import { useAuthStore } from '../store/authStore'

WebBrowser.maybeCompleteAuthSession()

export const useGoogleAuth = (
  onSuccess: () => void
) => {
  const { setUser, setLoading } = useAuthStore()

  const [request, response, promptAsync] = 
    Google.useAuthRequest({
      webClientId: process.env
        .EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env
        .EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env
        .EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    })

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params
      handleGoogleSignIn(id_token)
    }
  }, [response])

  const handleGoogleSignIn = async (
    idToken: string
  ) => {
    try {
      setLoading(true)
      const { user, token } = 
        await signInWithGoogleCredential(idToken)
      setUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        token,
      })
      onSuccess()
    } catch (error) {
      console.log('Google sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { request, promptAsync }
}
