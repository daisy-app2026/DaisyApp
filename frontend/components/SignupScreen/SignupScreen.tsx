import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { styles } from './SignupScreen.styles';
import { useLanguageStore } from '../../store/languageStore';
import { signUpWithEmail } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Signup'>>();
  const { t } = useLanguageStore();
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const { setUser } = useAuthStore();
  const { request, promptAsync } = useGoogleAuth(() => {});

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }
    
    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password.trim()) {
      setPasswordError('Please enter a password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const { user, token } = await signUpWithEmail(email, password, name);
      setUser({
        uid: user.uid,
        email: user.email,
        name: name,
        token,
      });
    } catch (error: any) {
      const code = error?.code || '';
      
      if (code === 'auth/email-already-in-use') {
        setEmailError('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address');
      } else if (code === 'auth/weak-password') {
        setPasswordError('Password must be at least 6 characters');
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#2D5A1B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.signup.title}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{t.signup.welcome}</Text>
            <Text style={styles.subtitle}>{t.signup.subtitle}</Text>

            <View style={[styles.inputContainer, nameError ? styles.errorInput : null]}>
              <View style={{ marginRight: 10 }}>
                <Feather name="user" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.signup.namePlaceholder}
                placeholderTextColor="#888"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                  setGeneralError('');
                }}
              />
            </View>
            {nameError ? (
              <View style={styles.errorContainer}>
                <Ionicons 
                  name='alert-circle-outline'
                  size={14}
                  color='#E85555'
                />
                <Text style={styles.errorText}>
                  {nameError}
                </Text>
              </View>
            ) : null}

            <View style={[styles.inputContainer, emailError ? styles.errorInput : null]}>
              <View style={{ marginRight: 10 }}>
                <Feather name="mail" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.signup.emailPlaceholder}
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  setGeneralError('');
                }}
              />
            </View>
            {emailError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name='alert-circle-outline'
                  size={14}
                  color='#E85555'
                />
                <Text style={styles.errorText}>
                  {emailError}
                </Text>
              </View>
            ) : null}

            <View style={[styles.inputContainer, passwordError ? styles.errorInput : null]}>
              <View style={{ marginRight: 10 }}>
                <Feather name="lock" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.signup.passwordPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                  setGeneralError('');
                }}
              />
            </View>
            {passwordError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name='alert-circle-outline'
                  size={14}
                  color='#E85555'
                />
                <Text style={styles.errorText}>
                  {passwordError}
                </Text>
              </View>
            ) : null}

            <View style={[styles.inputContainer, passwordError ? styles.errorInput : null]}>
              <View style={{ marginRight: 10 }}>
                <Feather name="lock" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.signup.confirmPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordError('');
                  setGeneralError('');
                }}
              />
            </View>

            {generalError ? (
              <View style={styles.generalError}>
                <Ionicons
                  name='alert-circle-outline'
                  size={14}
                  color='#E85555'
                />
                <Text style={styles.generalErrorText}>
                  {generalError}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.createButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>
                  {t.signup.createButton}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t.signup.or}</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.75}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <View style={{ marginRight: 10 }}>
                <FontAwesome name="google" size={18} color="#2D5A1B" />
              </View>
              <Text style={styles.googleButtonText}>{t.signup.googleSignup}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.haveAccountText}>{t.signup.haveAccount} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.signInText}>{t.signup.signIn}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
