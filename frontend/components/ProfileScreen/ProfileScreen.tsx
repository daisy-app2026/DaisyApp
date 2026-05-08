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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './ProfileScreen.styles';
import { useAuthStore } from '../../store/authStore';
import { logOut, updateUserName } from '../../services/authService';
import axios from 'axios';
import en from '../../locales/en.json';
import CustomModal from '../shared/CustomModal/CustomModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onDisclaimerPress: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onLogout: onLogoutProp,
  onDisclaimerPress,
}) => {
  const { user, updateName, updatePhotoURL, logout: clearStore } = useAuthStore();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [stats, setStats] = useState({
    entries: 0,
    capsules: 0,
    streak: 0,
  });

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

  const t = en.profile;

  useEffect(() => {
    fetchStats();
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/entries/stats`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        const photoURL = await uploadProfilePhoto(user!.token, result.assets[0].uri);
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
      await updateUserName(user!.token, trimmed);
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
    onLogoutProp();
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'es', name: 'Spanish', native: 'Español' },
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFAF8"
      />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <View style={{ width: 36 }} />
      </View>

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
            <Text style={styles.statNumber}>{stats.entries}</Text>
            <Text style={styles.statLabel}>{t.entries}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.capsules}</Text>
            <Text style={styles.statLabel}>{t.capsules}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {stats.streak} {stats.streak > 0 ? '🔥' : ''}
            </Text>
            <Text style={styles.statLabel}>{t.streak}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('notifications')}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(245, 220, 50, 0.15)' }]}>
              <Ionicons name="notifications-outline" size={18} color="#B8860B" />
            </View>
            <Text style={styles.menuItemText}>{t.notifications}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(45, 90, 27, 0.10)' }]}>
              <Ionicons name="globe-outline" size={18} color="#2D5A1B" />
            </View>
            <Text style={styles.menuItemText}>{t.changeLanguage}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => console.log('payment')}>
            <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(45, 90, 27, 0.10)' }]}>
              <Ionicons name="card-outline" size={18} color="#2D5A1B" />
            </View>
            <Text style={styles.menuItemText}>{t.payment}</Text>
            <Ionicons name="chevron-forward" size={18} color="#BBBBBB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onDisclaimerPress}>
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

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => setShowLanguageModal(false)} />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.chooseLanguage}</Text>
            <View style={styles.languageList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageRow}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <Text style={[styles.languageName, lang.code === 'en' && styles.activeLanguageText]}>
                    {lang.name} ({lang.native})
                  </Text>
                  {lang.code === 'en' ? (
                    <Ionicons name="checkmark-circle" size={20} color="#2D5A1B" />
                  ) : (
                    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#DDD' }} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.comingSoon}>{t.comingSoon}</Text>
          </View>
          <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={() => setShowLanguageModal(false)} />
        </View>
      </Modal>


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
    </SafeAreaView>
  );
};

export default ProfileScreen;
