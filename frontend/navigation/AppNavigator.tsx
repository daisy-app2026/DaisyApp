import React, { useState, useEffect } from 'react'
import { 
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useNavigation
} from '@react-navigation/native'
import { 
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack'
import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs'
import { View, ActivityIndicator, Easing } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/authStore'
import { getTalkToPastSessions } from '../services/talkToPastService'
import { useTalkToPastStore } from '../store/talkToPastStore'

// Auth Screens
import SplashScreen from '../components/SplashScreen/SplashScreen'
import LoginScreen from '../components/LoginScreen/LoginScreen'
import SignupScreen from '../components/SignupScreen/SignupScreen'
import ForgotPasswordScreen from '../components/ForgotPasswordScreen/ForgotPasswordScreen'

// Diary Screens
import HomeScreen from '../components/HomeScreen/HomeScreen'
import CategoryScreen from '../components/CategoryScreen/CategoryScreen'
import NewEntryScreen from '../components/NewEntryScreen/NewEntryScreen'
import ViewEntryScreen from '../components/ViewEntryScreen/ViewEntryScreen'
import SearchScreen from '../components/SearchScreen/SearchScreen'
import ProfileScreen from '../components/ProfileScreen/ProfileScreen'
import DisclaimerScreen from '../components/DisclaimerScreen/DisclaimerScreen'

// Talk to Past Screens
import TalkToPastHome from '../components/TalkToPast/TalkToPastHome'
import TalkToPastIntro from '../components/TalkToPast/TalkToPastIntro'
import TalkToPastSection from '../components/TalkToPast/TalkToPastSection'
import TalkToPastChat from '../components/TalkToPast/TalkToPastChat'

// Talk to Crush Screens
import TalkToCrushHome from '../components/TalkToCrush/TalkToCrushHome'
import TalkToCrushIntro from '../components/TalkToCrush/TalkToCrushIntro'
import TalkToCrushSection from '../components/TalkToCrush/TalkToCrushSection'
import TalkToCrushChat from '../components/TalkToCrush/TalkToCrushChat'
import { getTalkToCrushSessions } from '../services/talkToCrushService'
import { useTalkToCrushStore } from '../store/talkToCrushStore'

import {
  AuthStackParamList,
  DiaryStackParamList,
  MainTabParamList,
  TalkToPastStackParamList,
  TalkToCrushStackParamList,
} from './types'

const AuthStack = createStackNavigator<AuthStackParamList>()
const DiaryStack = createStackNavigator<DiaryStackParamList>()
const Tab = createBottomTabNavigator<MainTabParamList>()

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen 
      name='Splash' 
      component={SplashScreen} 
    />
    <AuthStack.Screen 
      name='Login' 
      component={LoginScreen} 
    />
    <AuthStack.Screen 
      name='Signup' 
      component={SignupScreen} 
    />
    <AuthStack.Screen 
      name='ForgotPassword' 
      component={ForgotPasswordScreen} 
    />
  </AuthStack.Navigator>
)

// Diary Stack Navigator
const DiaryNavigator = () => (
  <DiaryStack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      transitionSpec: {
        open: {
          animation: 'timing',
          config: {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }
        },
        close: {
          animation: 'timing',
          config: {
            duration: 180,
            easing: Easing.in(Easing.ease),
          }
        }
      },
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <DiaryStack.Screen 
      name='Home' 
      component={HomeScreen} 
    />
    <DiaryStack.Screen 
      name='Category' 
      component={CategoryScreen} 
    />
    <DiaryStack.Screen 
      name='NewEntry' 
      component={NewEntryScreen} 
    />
    <DiaryStack.Screen 
      name='ViewEntry' 
      component={ViewEntryScreen} 
    />
    <DiaryStack.Screen 
      name='Search' 
      component={SearchScreen} 
    />
    <DiaryStack.Screen 
      name='Profile' 
      component={ProfileScreen} 
    />
    <DiaryStack.Screen 
      name='Disclaimer' 
      component={DisclaimerScreen} 
    />
  </DiaryStack.Navigator>
)

const TalkToPastStack = createStackNavigator<TalkToPastStackParamList>()

const TalkToPastNavigator = () => {
  const { 
    sessions,
    isLoaded,
    setSessions,
    hasCreatedSession,
  } = useTalkToPastStore()
  
  const [checking, setChecking] = useState(!isLoaded)

  useEffect(() => {
    if (!isLoaded) {
      checkSessions()
    }
  }, [])

  const checkSessions = async () => {
    try {
      const data = await getTalkToPastSessions()
      setSessions(data || [])
    } catch (error) {
      console.log('Check sessions:', error)
      setSessions([])
    } finally {
      setChecking(false)
    }
  }

  const navigatorKey = 
    hasCreatedSession || sessions.length > 0
      ? 'ttp-home'
      : 'ttp-intro'

  const initialRoute = 
    hasCreatedSession || sessions.length > 0
      ? 'TalkToPastHome'
      : 'TalkToPastIntro'

  // Show loading ONLY first time!
  if (checking) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFAF8',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator
          color='#2D5A1B'
          size='large'
        />
      </View>
    )
  }

  return (
    <TalkToPastStack.Navigator
      key={navigatorKey}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
        presentation: 'card',
        detachPreviousScreen: true,
      }}
      initialRouteName={initialRoute}
    >
      <TalkToPastStack.Screen
        name='TalkToPastIntro'
        component={TalkToPastIntro}
      />
      <TalkToPastStack.Screen
        name='TalkToPastHome'
        component={TalkToPastHome}
      />
      <TalkToPastStack.Screen
        name='TalkToPastSection'
        component={TalkToPastSection}
      />
      <TalkToPastStack.Screen
        name='TalkToPastChat'
        component={TalkToPastChat}
      />
    </TalkToPastStack.Navigator>
  )
}

const TalkToCrushStack = createStackNavigator<TalkToCrushStackParamList>()

const TalkToCrushNavigator = () => {
  const { 
    sessions, 
    isLoaded, 
    setSessions,
    hasCreatedSession,
  } = useTalkToCrushStore()
  
  const [checking, setChecking] = useState(!isLoaded)

  useEffect(() => {
    if (!isLoaded) {
      checkSessions()
    }
  }, [])

  const checkSessions = async () => {
    try {
      const data = await getTalkToCrushSessions()
      setSessions(data || [])
    } catch {
      setSessions([])
    } finally {
      setChecking(false)
    }
  }

  const navigatorKey = 
    hasCreatedSession || sessions.length > 0
      ? 'ttc-home'
      : 'ttc-intro'

  const initialRoute = 
    hasCreatedSession || sessions.length > 0
      ? 'TalkToCrushHome'
      : 'TalkToCrushIntro'

  if (checking) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFAF8',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator
          color='#2D5A1B'
          size='large'
        />
      </View>
    )
  }

  return (
    <TalkToCrushStack.Navigator
      key={navigatorKey}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
      }}
      initialRouteName={initialRoute}
    >
      <TalkToCrushStack.Screen
        name='TalkToCrushIntro'
        component={TalkToCrushIntro}
      />
      <TalkToCrushStack.Screen
        name='TalkToCrushHome'
        component={TalkToCrushHome}
      />
      <TalkToCrushStack.Screen
        name='TalkToCrushSection'
        component={TalkToCrushSection}
      />
      <TalkToCrushStack.Screen
        name='TalkToCrushChat'
        component={TalkToCrushChat}
      />
    </TalkToCrushStack.Navigator>
  )
}

// Main Tab Navigator
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: 'rgba(255,255,255,0.92)',
        borderTopWidth: 1,
        paddingBottom: 16,
        paddingTop: 8,
        height: 72,
        elevation: 8,
        shadowColor: '#2D5A1B',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      tabBarActiveTintColor: '#2D5A1B',
      tabBarInactiveTintColor: 'rgba(26,46,15,0.28)',
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 2,
      },
      tabBarIconStyle: {
        marginTop: 4,
      },
      tabBarIcon: ({ focused, color }) => {
        let iconName: any

        if (route.name === 'DiaryTab') {
          iconName = focused 
            ? 'book' : 'book-outline'
        } else if (
          route.name === 'TalkToPastTab'
        ) {
          iconName = focused
            ? 'chatbubble-ellipses'
            : 'chatbubble-ellipses-outline'
        } else if (
          route.name === 'TalkToCrushTab'
        ) {
          iconName = focused 
            ? 'heart' : 'heart-outline'
        }

        return (
          <Ionicons 
            name={iconName} 
            size={24} 
            color={color} 
          />
        )
      },
    })}
  >
    <Tab.Screen
      name='DiaryTab'
      component={DiaryNavigator}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        return {
          tabBarLabel: 'Diary',
          tabBarStyle: routeName === 'NewEntry'
            ? { display: 'none' as const }
            : {
                backgroundColor: '#FFFFFF',
                borderTopColor: 'rgba(255,255,255,0.92)',
                borderTopWidth: 1,
                paddingBottom: 16,
                paddingTop: 8,
                height: 72,
                elevation: 8,
                shadowColor: '#2D5A1B',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
              }
        };
      }}
    />
    <Tab.Screen
      name='TalkToPastTab'
      component={TalkToPastNavigator}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const isChat = routeName === 'TalkToPastChat';
        
        return {
          tabBarLabel: 'Talk to Past',
          tabBarStyle: isChat ? {
            display: 'none',
            position: 'absolute',
          } : {
            backgroundColor: '#FFFFFF',
            borderTopColor: 'rgba(255,255,255,0.92)',
            borderTopWidth: 1,
            paddingBottom: 16,
            paddingTop: 8,
            height: 72,
            elevation: 8,
            shadowColor: '#2D5A1B',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }
        };
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          const isFocused = navigation.isFocused();
          if (isFocused) {
            e.preventDefault();
          }
        }
      })}
    />
    <Tab.Screen
      name='TalkToCrushTab'
      component={TalkToCrushNavigator}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const isChat = routeName === 'TalkToCrushChat';
        
        return {
          tabBarLabel: 'Talk to Crush',
          tabBarStyle: isChat ? {
            display: 'none',
            position: 'absolute',
          } : {
            backgroundColor: '#FFFFFF',
            borderTopColor: 'rgba(255,255,255,0.92)',
            borderTopWidth: 1,
            paddingBottom: 16,
            paddingTop: 8,
            height: 72,
            elevation: 8,
            shadowColor: '#2D5A1B',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }
        };
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          const isFocused = navigation.isFocused();
          if (isFocused) {
            e.preventDefault();
          }
        }
      })}
    />
  </Tab.Navigator>
)

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <NavigationContainer>
      {isAuthenticated 
        ? <MainNavigator /> 
        : <AuthNavigator />
      }
    </NavigationContainer>
  )
}

export default AppNavigator
