import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, Text } from 'react-native'
import { onAuthStateChanged } from '@firebase/auth'
import { auth } from './config/firebase'
import { useAuthStore } from './store/authStore'
import axios from 'axios'
import AppNavigator from './navigation/AppNavigator'
import { 
  GestureHandlerRootView 
} from 'react-native-gesture-handler'
import { 
  SafeAreaProvider 
} from 'react-native-safe-area-context'

export default function App() {
  const [isAuthLoading, setIsAuthLoading] = 
    useState(true)
  const { setUser, logout } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = 
              await firebaseUser.getIdToken()
            const API_URL = 
              process.env.EXPO_PUBLIC_API_URL

            const response = await axios.get(
              `${API_URL}/api/auth/user/${firebaseUser.uid}`,
              {
                headers: {
                  Authorization: 
                    `Bearer ${token}`
                }
              }
            )
            const userData = response.data.user

            setUser({
              uid: firebaseUser.uid,
              email: userData.email || 
                firebaseUser.email || '',
              name: userData.name || '',
              token,
              photoURL: 
                userData.photoURL || null,
            })
          } catch (error) {
            console.log('Auto login error:', error)
            logout()
          }
        } else {
          logout()
        }
        setIsAuthLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  if (isAuthLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFAF8',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator
          size='large'
          color='#2D5A1B'
        />
        <Text style={{
          marginTop: 12,
          fontSize: 13,
          color: '#888888',
        }}>
          Loading Daisy...
        </Text>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
