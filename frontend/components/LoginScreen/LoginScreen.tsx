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
import { styles } from './LoginScreen.styles';
import en from '../../locales/en.json';
import { signInWithEmail } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const { request, promptAsync } = useGoogleAuth(() => {});

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
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
      Alert.alert(
        'Login Failed',
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
              <Feather name="x" size={22} color="#2D5A1B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{en.login.title}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{en.login.welcome}</Text>
            <Text style={styles.subtitle}>{en.login.subtitle}</Text>

            <View style={styles.inputContainer}>
              <View style={{ marginRight: 10 }}>
                <Feather name="mail" size={18} color="#888888" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={en.login.emailPlaceholder}
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
                placeholder={en.login.passwordPlaceholder}
                placeholderTextColor="#888"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => console.log('Forgot password')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>
                {en.login.forgotPassword}
              </Text>
            </TouchableOpacity>

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
                  {en.login.continue}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{en.login.or}</Text>
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
              <Text style={styles.googleButtonText}>{en.login.googleLogin}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.newHereText}>{en.login.newHere} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')} activeOpacity={0.7}>
              <Text style={styles.createAccountText}>{en.login.createAccount}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
