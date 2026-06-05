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
import * as SplashScreen from 'expo-splash-screen'
import { useConfigStore } from './store/configStore'

// Keep native splash screen visible while app is loading
SplashScreen.preventAutoHideAsync().catch(console.warn)
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
import { useLanguageStore, initLanguageStore } from './store/languageStore'
import { getFreshToken } from './utils/getToken'
import { registerForPushNotifications } from './services/notificationService'


export default function App() {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [appReady, setAppReady] = useState(false)

  const { setRecentEntries, setStats } = useEntriesStore()
  const { setSpaces } = useSpacesStore()
  const { setSessions: setTTPSessions } = useTalkToPastStore()
  const { setSessions: setTTCSessions } = useTalkToCrushStore()
  const { setLanguage } = useLanguageStore()
  const { setConfig } = useConfigStore()

  const { user, isAuthenticated, isLoading, setUser, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthLoading && appReady) {
      SplashScreen.hideAsync().catch(console.warn)
    }
  }, [isAuthLoading, appReady])

  const preloadData = async () => {
    if (!isAuthenticated || !user) {
      setAppReady(true)
      return
    }

    // Register push notifications!
    registerForPushNotifications()
      .then(token => {
        if (token) {
          console.log(
            'Push registered:', token
          )
        }
      })
      .catch(console.log)

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

        // User language
        getFreshToken().then(token =>
          axios.get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/auth/language`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        ).then(response => {
          if (response.data?.language) {
            setLanguage(response.data.language)
          }
        }).catch(err => {
          console.log('Language preload error:', err)
        }),

        // Config
        axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/auth/config`
        ).then(res => {
          setConfig(res.data)
        }).catch(() => {}),
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
    initLanguageStore()
    // Preload config for unauthenticated screens
    axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/api/auth/config`
    ).then(res => {
      setConfig(res.data)
    }).catch(() => {})

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

            if (userData.language) {
              setLanguage(userData.language)
            }
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

  if (!appReady || isAuthLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#1A3A0F'
      }} />
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
