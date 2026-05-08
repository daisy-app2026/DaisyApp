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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { styles } from './SignupScreen.styles';
import en from '../../locales/en.json';
import { signUpWithEmail } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Signup'>>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const { request, promptAsync } = useGoogleAuth(() => {});

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        'Error',
        'Password must be at least 6 characters'
      );
      return;
    }
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
      Alert.alert(
        'Signup Failed',
        error.message || 'Something went wrong'
      );
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
            <Text style={styles.headerTitle}>{en.signup.title}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{en.signup.welcome}</Text>
            <Text style={styles.subtitle}>{en.signup.subtitle}</Text>

            <View style={styles.inputContainer}>
              <View style={{ marginRight: 10 }}>
                <Feather name="user" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={en.signup.namePlaceholder}
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={{ marginRight: 10 }}>
                <Feather name="mail" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={en.signup.emailPlaceholder}
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={{ marginRight: 10 }}>
                <Feather name="lock" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={en.signup.passwordPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={{ marginRight: 10 }}>
                <Feather name="lock" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={en.signup.confirmPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

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
                  {en.signup.createButton}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{en.signup.or}</Text>
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
              <Text style={styles.googleButtonText}>{en.signup.googleSignup}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.haveAccountText}>{en.signup.haveAccount} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.signInText}>{en.signup.signIn}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
