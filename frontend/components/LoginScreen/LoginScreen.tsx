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
import { styles } from './LoginScreen.styles';
import { useLanguageStore } from '../../store/languageStore';
import { signInWithEmail } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();
  const { t } = useLanguageStore();
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const { setUser } = useAuthStore();
  const { request, promptAsync } = useGoogleAuth(() => {});

  const validateForm = () => {
    let isValid = true;
    
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    
    if (!email.trim()) {
      setEmailError('Please enter your email');
      isValid = false;
    }
    
    if (!password.trim()) {
      setPasswordError('Please enter your password');
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const { user, token, name, email: fetchedEmail, photoURL } = await signInWithEmail(email, password);
      setUser({
        uid: user.uid,
        email: fetchedEmail,
        name: name,
        token,
        photoURL: photoURL || null,
      });
    } catch (error: any) {
      const code = error?.code || '';
      
      if (code === 'auth/user-not-found' ||
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential') {
        setGeneralError('Incorrect email or password. Please try again.');
      } else if (code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address');
      } else if (code === 'auth/too-many-requests') {
        setGeneralError('Too many attempts. Please try again later.');
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
              <Feather name="x" size={22} color="#2D5A1B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.login.title}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{t.login.welcome}</Text>
            <Text style={styles.subtitle}>{t.login.subtitle}</Text>

            <View style={[styles.inputContainer, emailError ? styles.errorInput : null]}>
              <View style={{ marginRight: 10 }}>
                <Feather name="mail" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t.login.emailPlaceholder}
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
                placeholder={t.login.passwordPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry={true}
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

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>
                {t.login.forgotPassword}
              </Text>
            </TouchableOpacity>

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
              style={[styles.continueButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueButtonText}>
                  {t.login.continue}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t.login.or}</Text>
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
              <Text style={styles.googleButtonText}>{t.login.googleLogin}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.newHereText}>{t.login.newHere} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.createAccountText}>{t.login.createAccount}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
