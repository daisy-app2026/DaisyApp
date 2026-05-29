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

import LoadingSplash from './components/LoadingSplash/LoadingSplash'
import { useEntriesStore } from './store/entriesStore'
import { useSpacesStore } from './store/spacesStore'
import { useTalkToPastStore } from './store/talkToPastStore'
import { useTalkToCrushStore } from './store/talkToCrushStore'
import { 
  getRecentEntries,
  getEntryStats
} from './services/entryService'
import { fetchSpaces } from './services/spaceService'
import { getTalkToPastSessions } from './services/talkToPastService'
import { getTalkToCrushSessions } from './services/talkToCrushService'

export default function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [appReady, setAppReady] = useState(false)

  const { setRecentEntries, setStats } = useEntriesStore()
  const { setSpaces } = useSpacesStore()
  const { setSessions: setTTPSessions } = useTalkToPastStore()
  const { setSessions: setTTCSessions } = useTalkToCrushStore()

  const { user, isAuthenticated, isLoading, setUser, logout } = useAuthStore()

  const preloadData = async () => {
    if (!isAuthenticated || !user) {
      setAppReady(true)
      return
    }

    try {
      // Load EVERYTHING in parallel!
      const preloadPromise = Promise.allSettled([
        // Spaces
        fetchSpaces().then(spaces => {
          setSpaces(spaces)
        }),
        
        // Recent entries
        getRecentEntries().then(entries => {
          setRecentEntries(entries)
        }),

        // Stats
        getEntryStats().then(stats => {
          if (stats) {
            setStats({
              totalEntries: stats.entries || 0,
              totalCapsules: stats.capsules || 0,
              currentStreak: stats.streak || 0
            })
          }
        }),

        // Talk to Past sessions
        getTalkToPastSessions().then(
          sessions => {
            setTTPSessions(sessions || [])
          }
        ),

        // Talk to Crush sessions
        getTalkToCrushSessions().then(
          sessions => {
            setTTCSessions(sessions || [])
          }
        ),
      ])

      // Max wait time 3 seconds
      const timeoutPromise = new Promise(
        resolve => setTimeout(resolve, 3000)
      )

      await Promise.race([
        preloadPromise,
        timeoutPromise
      ])
    } catch (error) {
      console.log('Preload error:', error)
    } finally {
      setAppReady(true)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken()
            const API_URL = process.env.EXPO_PUBLIC_API_URL

            const response = await axios.get(
              `${API_URL}/api/auth/user/${firebaseUser.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
            const userData = response.data.user

            setUser({
              uid: firebaseUser.uid,
              email: userData.email || firebaseUser.email || '',
              name: userData.name || '',
              token,
              photoURL: userData.photoURL || null,
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

  useEffect(() => {
    if (isAuthenticated && user) {
      preloadData()
    } else if (!isAuthLoading && !isLoading) {
      setAppReady(true)
    }
  }, [isAuthenticated, user, isAuthLoading, isLoading])

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
        {/* Show splash while loading! */}
        {isAuthenticated && !appReady ? (
          <LoadingSplash />
        ) : (
          <AppNavigator />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
