import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/authStore';
import SplashScreen from './components/SplashScreen/SplashScreen';
import LoginScreen from './components/LoginScreen/LoginScreen';
import SignupScreen from './components/SignupScreen/SignupScreen';
import HomeScreen from './components/HomeScreen/HomeScreen';
import CategoryScreen from './components/CategoryScreen/CategoryScreen';
import NewEntryScreen from './components/NewEntryScreen/NewEntryScreen';
import ViewEntryScreen from './components/ViewEntryScreen/ViewEntryScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import DisclaimerScreen from './components/DisclaimerScreen/DisclaimerScreen';
import SearchScreen from './components/SearchScreen';
import BottomNavBar from './components/shared/BottomNavBar/BottomNavBar';

import { Entry } from './services/entryService';

type Screen =
  | 'splash' | 'login' | 'signup'
  | 'home' | 'category'
  | 'newEntry' | 'viewEntry' | 'editEntry' | 'profile'
  | 'past' | 'crush' | 'disclaimer' | 'search';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'diary' | 'past' | 'crush'>('diary');
  const [selectedSpace, setSelectedSpace] = useState<{
    id: string;
    name: string;
    icon: string;
  } | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get fresh token
          const token = await firebaseUser.getIdToken();
          
          // Fetch user data from backend
          const API_URL = process.env.EXPO_PUBLIC_API_URL;
          const response = await axios.get(`${API_URL}/api/auth/user/${firebaseUser.uid}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const userData = response.data.user;
          
          // Set user in Zustand store
          setUser({
            uid: firebaseUser.uid,
            email: userData.email || firebaseUser.email || '',
            name: userData.name || '',
            token,
            photoURL: userData.photoURL || null,
          });
          
          setScreen('home');
        } catch (error) {
          console.log('Auto login error:', error);
          setScreen('splash');
        }
      } else {
        // No user logged in
        setScreen('splash');
        setUser(null);
      }
      setIsAuthLoading(false);
    });
    
    // Cleanup listener
    return () => unsubscribe();
  }, [setUser]);

  const handleTabChange = (tab: 'diary' | 'past' | 'crush') => {
    if (tab === 'diary') {
      setScreen('home');
      setActiveTab('diary');
    }
    if (tab === 'past') {
      setScreen('past');
      setActiveTab('past');
    }
    if (tab === 'crush') {
      setScreen('crush');
      setActiveTab('crush');
    }
  };

  const showBottomNav = [
    'home',
    'category',
    'viewEntry',
    'profile',
    'past',
    'crush'
  ].includes(screen) && screen !== 'disclaimer' && screen !== 'search';

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
          fontFamily: 'serif'
        }}>
          Loading Daisy...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: '#FAFAF8' }}
      edges={['bottom']}
    >
      <View style={styles.container}>
        {screen === 'splash' && (
          <SplashScreen
            onGetStarted={() => setScreen('signup')}
            onLogin={() => setScreen('login')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            onBack={() => setScreen('splash')}
            onCreateAccount={() => setScreen('signup')}
            onForgotPassword={() => console.log('Forgot password')}
            onGoogleLogin={() => console.log('Google login')}
            onContinue={() => {
              setScreen('home');
              setActiveTab('diary');
            }}
          />
        )}
        {screen === 'signup' && (
          <SignupScreen
            onBack={() => setScreen('login')}
            onSignIn={() => setScreen('login')}
            onGoogleSignup={() => console.log('Google signup')}
            onCreateAccount={() => {
              setScreen('home');
              setActiveTab('diary');
            }}
          />
        )}
        {screen === 'home' && (
          <HomeScreen
            onNavigate={(newScreen) => {
              setScreen(newScreen as Screen);
              if (newScreen === 'past') setActiveTab('past');
              if (newScreen === 'crush') setActiveTab('crush');
            }}
            onSearchPress={() => setScreen('search')}
            onSpacePress={(space) => {
              setSelectedSpace(space);
              setScreen('category');
              setActiveTab('diary');
            }}
            onViewEntry={(entry: Entry) => {
              setSelectedEntry(entry);
              setSelectedSpace({
                id: entry.spaceId,
                name: entry.spaceName,
                icon: 'bookmark-outline'
              });
              setScreen('viewEntry');
              setActiveTab('diary');
            }}
            onEditEntry={(entry: Entry) => {
              setSelectedEntry(entry);
              setSelectedSpace({
                id: entry.spaceId,
                name: entry.spaceName,
                icon: 'bookmark-outline'
              });
              setScreen('editEntry');
            }}
            onProfilePress={() => {
              setScreen('profile');
              setActiveTab('diary');
            }}
          />
        )}
        {screen === 'category' && (
          <CategoryScreen
            space={selectedSpace!}
            onBack={() => setScreen('home')}
            onSearchPress={() => setScreen('search')}
            onNewEntry={() => setScreen('newEntry')}
            onViewEntry={(entry: Entry) => {
              setSelectedEntry(entry);
              setScreen('viewEntry');
            }}
            onEditEntry={(entry: Entry) => {
              setSelectedEntry(entry);
              setSelectedSpace({
                id: entry.spaceId,
                name: entry.spaceName,
                icon: selectedSpace!.icon
              });
              setScreen('editEntry');
            }}
            onProfilePress={() => setScreen('profile')}
          />
        )}
        {screen === 'newEntry' && (
          <NewEntryScreen
            space={selectedSpace!}
            onBack={() => setScreen('category')}
            onSave={() => setScreen('category')}
            onNavigateHome={() => {
              setScreen('home');
              setActiveTab('diary');
            }}
          />
        )}
        {screen === 'viewEntry' && (
          <ViewEntryScreen
            entry={selectedEntry!}
            onBack={() => setScreen('category')}
            onEdit={(entry) => {
              setSelectedEntry(entry);
              setScreen('editEntry');
            }}
          />
        )}
        {screen === 'editEntry' && (
          <NewEntryScreen
            space={{
              id: selectedEntry!.spaceId,
              name: selectedEntry!.spaceName,
              icon: 'bookmark-outline'
            }}
            onBack={() => setScreen('viewEntry')}
            onSave={() => setScreen('category')}
            onNavigateHome={() => {
              setScreen('home');
              setActiveTab('diary');
            }}
            editEntry={selectedEntry!}
          />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            onBack={() => setScreen('home')}
            onLogout={() => setScreen('splash')}
            onDisclaimerPress={() => setScreen('disclaimer')}
          />
        )}
        {screen === 'disclaimer' && (
          <DisclaimerScreen
            onBack={() => setScreen('profile')}
          />
        )}
        {screen === 'search' && (
          <SearchScreen
            onBack={() => setScreen('home')}
            onViewEntry={(entry: Entry) => {
              setSelectedEntry(entry);
              setSelectedSpace({
                id: entry.spaceId,
                name: entry.spaceName,
                icon: 'bookmark-outline'
              });
              setScreen('viewEntry');
            }}
          />
        )}

        {showBottomNav && (
          <BottomNavBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

