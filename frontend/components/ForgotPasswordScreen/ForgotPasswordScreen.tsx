import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { useLanguageStore } from '../../store/languageStore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { styles } from './ForgotPasswordScreen.styles';
import { getFreshToken } from '../../utils/getToken';
import axios from 'axios';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'ForgotPassword'>>();
  const { t: en } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const t = en.forgotPassword;

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError(t.errors.emptyEmail);
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError(t.errors.invalidEmail);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleReset = async () => {
    if (!validateEmail()) return;

    try {
      setLoading(true);

      // First check if user exists!
      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      try {
        const response = await axios.post<{ exists: boolean }>(
          `${API_URL}/api/auth/check-email`,
          { email: email.trim() }
        );

        if (!response.data.exists) {
          setEmailError(
            'No account found with this email. Please create an account first.'
          );
          return;
        }
      } catch (checkError) {
        // If check fails, proceed anyway
        console.log('Check error:', checkError);
      }

      // Send reset email
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(true);
    } catch (error: unknown) {
      const err = error as { code?: string };
      const code = err?.code || '';

      if (code === 'auth/user-not-found') {
        setEmailError(
          'No account found with this email. Please create an account first.'
        );
      } else if (code === 'auth/invalid-email') {
        setEmailError(
          'Please enter a valid email address'
        );
      } else if (code === 'auth/too-many-requests') {
        setEmailError(
          'Too many attempts. Please try again later.'
        );
      } else {
        setEmailError(
          'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient
        colors={[
          '#F9E65C',
          '#F2DB4A',
          '#E3C437'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerOrb1} />
        <View style={styles.headerOrb2} />
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#1A3A0F" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {!success ? (
            <>
              {/* Icon */}
              <View style={styles.iconCircle}>
                <Ionicons name="lock-open-outline" size={36} color="#2D5A1B" />
              </View>

              {/* Title */}
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.emailLabel}</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    emailError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={emailError ? '#E85555' : '#2D5A1B'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    placeholder={t.emailPlaceholder}
                    placeholderTextColor="#CCCCCC"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                  />
                </View>

                {emailError ? (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#E85555" />
                    <Text style={styles.errorText}>{emailError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitDisabled,
                ]}
                onPress={handleReset}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitText}>{t.sendButton}</Text>
                )}
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={14} color="#2D5A1B" />
                <Text style={styles.backToLoginText}>{t.backToLogin}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Success State */}
              <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#2D5A1B" />
              </View>

              <Text style={styles.title}>{t.successTitle}</Text>
              <Text style={styles.subtitle}>{t.successSubtitle}</Text>
              <Text style={styles.emailDisplay}>{email}</Text>
              <Text style={styles.successNote}>{t.successNote}</Text>

              {/* Back to Login Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <Text style={styles.submitText}>{t.backToLogin}</Text>
              </TouchableOpacity>

              {/* Resend */}
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>{t.tryDifferent}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPasswordScreen;
