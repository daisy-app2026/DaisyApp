import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import { styles } from './SplashScreen.styles';
import en from '../../locales/en.json';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Run animations in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />
      <Animated.View style={[styles.root, { opacity: fadeAnim }]}>

        <View style={styles.container}>
          {/* Logo Circle */}
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* App Name */}
          <Text style={styles.appName}>{en.splash.appName}</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>{en.splash.tagline}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.getStartedButtonText}>
                {en.splash.getStarted}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>
                {en.splash.haveAccount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;
