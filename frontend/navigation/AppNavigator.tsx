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
import { LinearGradient } from 'expo-linear-gradient'
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

const springTransitionSpec = {
  open: {
    animation: 'spring' as const,
    config: {
      stiffness: 1000,
      damping: 80,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }
  },
  close: {
    animation: 'spring' as const,
    config: {
      stiffness: 1000,
      damping: 80,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    }
  }
}

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator 
    screenOptions={{ 
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      transitionSpec: springTransitionSpec,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
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
      transitionSpec: springTransitionSpec,
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
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: springTransitionSpec,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: springTransitionSpec,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
const customTabBarStyle = {
  backgroundColor: 'transparent',
  borderTopWidth: 0,
  height: 82,
  paddingBottom: 12,
  paddingTop: 8,
  elevation: 0,
  shadowColor: '#F9E65C',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.4,
  shadowRadius: 25,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  overflow: 'hidden' as const,
};

// Main Tab Navigator
const MainNavigator = () => (
  <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: false,
        tabBarShowLabel: false,
        tabBarStyle: customTabBarStyle,
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              '#F8E769',
              '#ECD446',
              '#DDBA28'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          color: '#1A3A0F',
        },
        tabBarActiveTintColor: '#1A3A0F',
        tabBarInactiveTintColor: 'rgba(26,58,15,0.45)',
        tabBarIconStyle: {
          width: 36,
          height: 36,
        },
        tabBarIcon: ({ focused }) => {
          let iconName: any

          if (route.name === 'DiaryTab') {
            iconName = focused 
              ? 'book' : 'book-outline'
          } else if (
            route.name === 'TalkToPastTab'
          ) {
            iconName = focused
              ? 'time'
              : 'time-outline'
          } else if (
            route.name === 'TalkToCrushTab'
          ) {
            iconName = focused 
              ? 'heart' : 'heart-outline'
          }

          return (
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: focused
                ? '#FFFFFF'
                : 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: focused
                ? '#000000'
                : 'transparent',
              shadowOffset: focused
                ? { width: 0, height: 8 }
                : { width: 0, height: 0 },
              shadowOpacity: focused
                ? 0.12
                : 0,
              shadowRadius: focused
                ? 20
                : 0,
              elevation: focused ? 8 : 0,
              borderWidth: focused ? 0 : 1,
              borderColor: focused
                ? 'transparent'
                : 'rgba(255,255,255,0.4)',
            }}>
              <Ionicons 
                name={iconName} 
                size={26} 
                color={focused 
                  ? '#D4A514' 
                  : 'rgba(26,58,15,0.5)'
                } 
              />
            </View>
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
              : customTabBarStyle
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
            tabBarLabel: 'Past',
            tabBarStyle: isChat ? {
              display: 'none' as const,
              position: 'absolute' as const,
            } : customTabBarStyle
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
            tabBarLabel: 'Crush',
            tabBarStyle: isChat ? {
              display: 'none' as const,
              position: 'absolute' as const,
            } : customTabBarStyle
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
  </View>
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
