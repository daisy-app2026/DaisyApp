import React from 'react'
import { 
  NavigationContainer 
} from '@react-navigation/native'
import { 
  createStackNavigator,
  CardStyleInterpolators
} from '@react-navigation/stack'
import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../store/authStore'

// Auth Screens
import SplashScreen from '../components/SplashScreen/SplashScreen'
import LoginScreen from '../components/LoginScreen/LoginScreen'
import SignupScreen from '../components/SignupScreen/SignupScreen'

// Diary Screens
import HomeScreen from '../components/HomeScreen/HomeScreen'
import CategoryScreen from '../components/CategoryScreen/CategoryScreen'
import NewEntryScreen from '../components/NewEntryScreen/NewEntryScreen'
import ViewEntryScreen from '../components/ViewEntryScreen/ViewEntryScreen'
import SearchScreen from '../components/SearchScreen/SearchScreen'
import ProfileScreen from '../components/ProfileScreen/ProfileScreen'
import DisclaimerScreen from '../components/DisclaimerScreen/DisclaimerScreen'

import {
  AuthStackParamList,
  DiaryStackParamList,
  MainTabParamList,
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
  </AuthStack.Navigator>
)

// Diary Stack Navigator
const DiaryNavigator = () => (
  <DiaryStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: true,
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

// Placeholder screens for tabs
const TalkToPastPlaceholder = () => null
const TalkToCrushPlaceholder = () => null

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
      options={{ tabBarLabel: 'Diary' }}
    />
    <Tab.Screen
      name='TalkToPastTab'
      component={TalkToPastPlaceholder}
      options={{ tabBarLabel: 'Talk to Past' }}
    />
    <Tab.Screen
      name='TalkToCrushTab'
      component={TalkToCrushPlaceholder}
      options={{ tabBarLabel: 'Talk to Crush' }}
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
