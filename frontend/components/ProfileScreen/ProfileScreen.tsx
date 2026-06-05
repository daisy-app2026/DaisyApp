import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  StatusBar,
  I18nManager,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './ProfileScreen.styles';
import { useAuthStore } from '../../store/authStore';
import { useEntriesStore } from '../../store/entriesStore';
import { logOut, updateUserName } from '../../services/authService';
import { getEntryStats } from '../../services/entryService';
import axios from 'axios';
import { useLanguageStore } from '../../store/languageStore';
import { getFreshToken } from '../../utils/getToken';
import CustomModal from '../shared/CustomModal/CustomModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiaryStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<DiaryStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, updateName, updatePhotoURL, logout: clearStore } = useAuthStore();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  
  const { 
    stats,
    isStatsLoaded,
    setStats
  } = useEntriesStore();
  const [statsLoading, setStatsLoading] = useState(false);

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const { language, setLanguage, t: translations } = useLanguageStore();
  const t = translations.profile;

  useEffect(() => {
    loadStats();
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const loadStats = async () => {
    try {
      // Show cached stats immediately!
      if (isStatsLoaded && stats) {
        // Already have stats, 
        // no loading state!
        // Refresh in background:
        refreshStats();
        return;
      }
      
      // First time: show loading
      setStatsLoading(true);
      const data = await getEntryStats();
      setStats({
        totalEntries: data.entries,
        totalCapsules: data.capsules,
        currentStreak: data.streak
      });
    } catch (error) {
      console.log('Stats error:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      // Silent refresh - no loading!
      const data = await getEntryStats();
      setStats({
        totalEntries: data.entries,
        totalCapsules: data.capsules,
        currentStreak: data.streak
      });
    } catch (error) {
      console.log('Refresh error:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        setPhotoLoading(true);
        const { uploadProfilePhoto } = await import('../../services/authService');
        const photoURL = await uploadProfilePhoto(result.assets[0].uri);
        updatePhotoURL(photoURL);
      } catch (error) {
        showAlert('Error', 'Could not upload photo');
      } finally {
        setPhotoLoading(false);
      }
    }
  };

  const isValidName = (text: string) => {
    return /^[a-zA-Z\s]*$/.test(text);
  };

  const handleSaveName = async () => {
    const trimmed = newName.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      showAlert('Error', 'Name cannot be empty');
      return;
    }
    setNameLoading(true);
    try {
      await updateUserName(trimmed);
      updateName(trimmed);
      setEditingName(false);
    } catch (error) {
      showAlert('Error', 'Could not update name. Try again!');
    } finally {
      setNameLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logOut();
    clearStore();
  };

  const handleLanguageChange = async (lang: 'en' | 'de' | 'ar') => {
    try {
      setLanguage(lang);
      
      const targetRTL = lang === 'ar';
      if (I18nManager.isRTL !== targetRTL) {
        I18nManager.forceRTL(targetRTL);
        I18nManager.allowRTL(targetRTL);
        
        const alertTitle = lang === 'ar' ? 'تغيير اللغة' : (lang === 'de' ? 'Sprache geändert' : 'Language Changed');
        const alertMsg = lang === 'ar'
          ? 'يرجى إعادة تشغيل التطبيق لتطبيق اتجاه اللغة العربية (RTL) بشكل صحيح.'
          : (lang === 'de' ? 'Bitte starte die App neu, um das Layout anzupassen.' : 'Please restart the app to apply the layout changes properly.');
        
        showAlert(alertTitle, alertMsg);
      }

      const token = await getFreshToken();
      await axios.put(
        `${API_URL}/api/auth/update-language`,
        { language: lang },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.log('Language save error:', error);
    }
  };


  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
  ];

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    : new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFAF8"
      />
      {/* Header */}
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
        {/* Curved highlight orb 1 */}
        <View style={styles.headerOrb1} />
        
        {/* Curved highlight orb 2 */}
        <View style={styles.headerOrb2} />
        
        {/* Actual header content */}
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#1A3A0F" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <View style={{ width: 36 }} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={[styles.content, styles.mainContent]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} style={styles.photoContainer} disabled={photoLoading}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{user?.name?.charAt(0).toUpperCase() || 'D'}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              {photoLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="camera-outline" size={12} color="white" />
              )}
            </View>
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                value={newName}
                onChangeText={(text) => {
                  if (isValidName(text)) {
                    setNewName(text);
                  }
                }}
                style={styles.nameInput}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleSaveName}
              />
              <TouchableOpacity onPress={handleSaveName}>
                <Ionicons name="checkmark-circle" size={24} color="#2D5A1B" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingName(false)}>
                <Ionicons name="close-circle" size={24} color="#E85555" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setNewName(user?.name || '');
                  setEditingName(true);
                }}
              >
                <Ionicons name="pencil-outline" size={16} color="#4A7C2A" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t.memberSince} {memberSince}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statsValue}>{stats?.totalEntries ?? '0'}</Text>
            <Text style={styles.statLabel}>{t.entries}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statsValue}>{stats?.totalCapsules ?? '0'}</Text>
            <Text style={styles.statLabel}>{t.capsules}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statsValue}>
              {stats?.currentStreak ?? '0'}{(stats?.currentStreak || 0) > 0 ? ' 🔥' : ''}
            </Text>
            <Text style={styles.statLabel}>{t.streak}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>

          {/* Language Selection Card */}
          <View style={styles.languageSection}>
            <Text style={styles.languageSectionTitle}>{t.language}</Text>
            <View style={styles.languageOptions}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageChange(lang.code as 'en' | 'de' | 'ar')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>
                    {lang.code === 'en' ? '🇬🇧' : lang.code === 'de' ? '🇩🇪' : '🇸🇦'}
                  </Text>
                  <Text
                    style={[
                      styles.languageLabel,
                      language === lang.code && styles.languageLabelActive,
                    ]}
                  >
                    {lang.native}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Payment - Coming Soon
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('payment')}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(45, 90, 27, 0.10)' }]}>
              <Ionicons name="card-outline" size={18} color="#2D5A1B" />
            </View>
            <Text style={styles.menuItemText}>{t.payment}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>
          */}

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Disclaimer')}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(45, 90, 27, 0.10)' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#2D5A1B" />
            </View>
            <Text style={styles.menuItemText}>{t.disclaimer}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(232, 85, 85, 0.10)' }]}>
              <Ionicons name="log-out-outline" size={18} color="#E85555" />
            </View>
            <Text style={[styles.menuItemText, styles.logoutText]}>{t.logout}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>
        </View>
      </ScrollView>



      {/* Logout Modal */}
      <CustomModal
        visible={showLogoutModal}
        title={t.logoutTitle}
        message={t.logoutMessage}
        cancelText={t.cancel}
        confirmText={t.logoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />

      {/* Alert Modal */}
      <CustomModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type="alert"
        onConfirm={() => setAlertConfig({ ...alertConfig, visible: false })}
        confirmText="OK"
      />
    </View>
  );
};

export default ProfileScreen;
