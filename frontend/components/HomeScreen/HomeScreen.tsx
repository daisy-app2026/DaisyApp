import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { useLanguageStore } from '../../store/languageStore';
import { styles } from './HomeScreen.styles';

import SpaceCircle from '../shared/SpaceCircle/SpaceCircle';
import EntryCard from '../shared/EntryCard/EntryCard';
import CapsuleCard from '../shared/CapsuleCard/CapsuleCard';
import { 
  fetchSpaces, 
  addCustomSpace,
  removeSpace 
} from '../../services/spaceService';
import { 
  getRecentEntries, 
  getEntryStats,
  getUnlockedCapsules,
  markNotificationShown,
  deleteEntry, 
  Entry 
} from '../../services/entryService';
import CapsuleNotification from '../shared/CapsuleNotification/CapsuleNotification';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 4;

type Screen = 
  | 'splash' 
  | 'login' 
  | 'signup' 
  | 'home' 
  | 'category' 
  | 'newEntry'
  | 'viewEntry'
  | 'editEntry'
  | 'profile'
  | 'past'
  | 'crush';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiaryStackParamList } from '../../navigation/types';
import { useEntriesStore } from '../../store/entriesStore';
import { useSpacesStore } from '../../store/spacesStore';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<DiaryStackParamList, 'Home'>>();
  const { t } = useLanguageStore();
  const { user } = useAuthStore();

  const { 
    recentEntries, 
    setRecentEntries,
    isRecentLoaded,
  } = useEntriesStore();

  const {
    spaces,
    setSpaces,
    isLoaded: isSpacesLoaded,
    addSpace: addSpaceToStore,
    removeSpace: removeSpaceFromStore,
  } = useSpacesStore();

  const [spacesLoading, setSpacesLoading] = useState(!isSpacesLoaded);
  const [recentLoading, setRecentLoading] = useState(!isRecentLoaded);

  const [activePage, setActivePage] = useState(0);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [deletingSpaceId, setDeletingSpaceId] = useState<string | null>(null);
  
  const [longPressedId, setLongPressedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [unlockedCapsules, setUnlockedCapsules] = useState<Entry[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  
  const ICON_OPTIONS = [
    { name: 'moon', color: '#6366F1' },
    { name: 'musical-notes', color: '#EC4899' },
    { name: 'leaf', color: '#10B981' },
    { name: 'star', color: '#F59E0B' },
    { name: 'flame', color: '#EF4444' },
    { name: 'heart', color: '#EC4899' },
    { name: 'book', color: '#8B5CF6' },
    { name: 'camera', color: '#3B82F6' },
    { name: 'airplane', color: '#06B6D4' },
    { name: 'bicycle', color: '#10B981' },
    { name: 'game-controller', color: '#8B5CF6' },
    { name: 'cafe', color: '#92400E' },
  ];

  const [selectedIconOption, setSelectedIconOption] = useState(ICON_OPTIONS[0]);

  // Load spaces and recent entries on mount
  React.useEffect(() => {
    if (!isSpacesLoaded || !isRecentLoaded) {
      loadData();
    } else {
      setSpacesLoading(false);
      setRecentLoading(false);
    }
    checkUnlockedCapsules();
  }, [isSpacesLoaded, isRecentLoaded]);

  const checkUnlockedCapsules = async () => {
    try {
      const capsules = await getUnlockedCapsules();
      setUnlockedCapsules(capsules);
    } catch (error) {
      console.log('Capsule check error:', error);
    }
  };

  const loadData = async () => {
    try {
      const spacesPromise = isSpacesLoaded ? Promise.resolve(spaces) : fetchSpaces();
      const recentPromise = isRecentLoaded ? Promise.resolve(recentEntries) : getRecentEntries();

      if (!isSpacesLoaded) setSpacesLoading(true);
      if (!isRecentLoaded) setRecentLoading(true);

      const [fetchedSpaces, fetchedRecent, fetchedStats] = await Promise.all([
        spacesPromise,
        recentPromise,
        getEntryStats()
      ]);

      if (!isSpacesLoaded) setSpaces(fetchedSpaces);
      if (!isRecentLoaded) setRecentEntries(fetchedRecent);
      setStreak(fetchedStats.streak);
    } catch (error) {
      console.log('Error loading home data:', error);
    } finally {
      setSpacesLoading(false);
      setRecentLoading(false);
    }
  };

  const handleAddSpace = async () => {
    if (!newSpaceName.trim()) return;

    const name = newSpaceName.trim();
    const icon = selectedIconOption.name;
    const iconBg = selectedIconOption.color;
    const iconBgLight = `${selectedIconOption.color}26`; // 15% opacity in hex (26)

    // Create temp space immediately
    const tempSpace = {
      id: `temp_${Date.now()}`,
      name,
      icon,
      iconBg,
      iconBgLight,
      isDefault: false,
    };

    // Add to store immediately (no lag!)
    addSpaceToStore(tempSpace);

    // Close modal immediately (no lag!)
    setModalVisible(false);
    setNewSpaceName('');

    // Then API call in background
    try {
      const newSpace = await addCustomSpace(
        name,
        icon,
        iconBg,
        iconBgLight
      );
      // Replace temp with real space
      removeSpaceFromStore(tempSpace.id);
      addSpaceToStore(newSpace);
    } catch (error) {
      // Remove temp if failed
      removeSpaceFromStore(tempSpace.id);
      // Show error
      Alert.alert('Error', 'Could not add space');
    }
  };

  const handleDeleteSpace = useCallback(async (id: string) => {
    try {
      const spaceToDelete = spaces.find(s => s.id === id);
      if (!spaceToDelete) return;

      await removeSpace(
        id,
        !!spaceToDelete.isDefault
      );
      
      removeSpaceFromStore(id);
      if (selectedSpaceId === id) setSelectedSpaceId(null);
      setDeletingSpaceId(null);
    } catch (error) {
      console.log('Error deleting space:', error);
    }
  }, [spaces, removeSpaceFromStore, selectedSpaceId]);

  const handleDeleteEntry = useCallback(async () => {
    if (!deleteConfirmId) return;
    try {
      const entryToDelete = recentEntries.find(e => e.id === deleteConfirmId);
      await deleteEntry(deleteConfirmId);
      setRecentEntries(recentEntries.filter(e => e.id !== deleteConfirmId));
      if (entryToDelete) {
        useEntriesStore.getState().invalidateSpaceCache(entryToDelete.spaceId);
      }
      setDeleteConfirmId(null);
      setLongPressedId(null);
    } catch (error) {
      Alert.alert('Error', 'Could not delete entry');
    }
  }, [deleteConfirmId, recentEntries]);

  const handleDismissCapsule = useCallback(async (entryId: string) => {
    try {
      await markNotificationShown(entryId);
      setUnlockedCapsules(prev => prev.filter(c => c.id !== entryId));
    } catch (error) {
      console.log('Mark shown error:', error);
    }
  }, []);

  const handleViewCapsule = useCallback((entry: Entry) => {
    navigation.navigate('ViewEntry', { entry });
  }, [navigation]);

  const paginatedItems = useMemo(() => {
    const allItems = [...spaces, { id: 'add', name: 'Create own', isAdd: true }];
    const pages = [];
    for (let i = 0; i < allItems.length; i += ITEMS_PER_PAGE) {
      pages.push(allItems.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [spaces]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t.home.greeting_morning;
    if (hour < 17) return t.home.greeting_afternoon;
    return t.home.greeting_evening;
  }, [t]);

  const firstName = useMemo(() => {
    return user?.name?.split(' ')[0]?.split('_')[0] || 'there';
  }, [user?.name]);

  const nameStyle = useMemo(() => {
    if (firstName.length > 8) return styles.userNameSmall;
    if (firstName.length > 6) return styles.userNameMedium;
    return styles.userNameLarge;
  }, [firstName]);

  const avatarInitial = useMemo(() => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  }, [user?.name]);

  const renderPage = useCallback(({ item }: { item: any[] }) => (
    <View style={styles.page}>
      {item.map((space) => (
        <SpaceCircle
          key={space.id}
          name={space.name}
          icon={space.icon}
          iconBg={space.iconBg}
          iconBgLight={space.iconBgLight}
          isAdd={space.isAdd}
          isSelected={selectedSpaceId === space.id}
          showDelete={deletingSpaceId === space.id}
          onPress={() => {
            if (deletingSpaceId) {
              setDeletingSpaceId(null);
            } else if (space.isAdd) {
              setModalVisible(true);
            } else {
              setSelectedSpaceId(space.id);
              navigation.navigate('Category', {
                spaceId: space.id,
                spaceName: space.name,
                spaceIcon: space.icon,
                spaceIconBg: space.iconBg,
                spaceIconBgLight: space.iconBgLight,
              });
            }
          }}
          onLongPress={() => {
            setDeletingSpaceId(space.id);
          }}
          onDelete={() => handleDeleteSpace(space.id)}
        />
      ))}
      {item.length < ITEMS_PER_PAGE && 
        Array(ITEMS_PER_PAGE - item.length).fill(0).map((_, i) => (
          <View key={`empty-${i}`} style={{ width: 82 }} />
        ))
      }
    </View>
  ), [selectedSpaceId, deletingSpaceId, navigation, handleDeleteSpace]);

  if (spacesLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#2D5A1B" size="large" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      setDeletingSpaceId(null);
      setLongPressedId(null);
    }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {unlockedCapsules.length > 0 && (
          <CapsuleNotification
            capsules={unlockedCapsules}
            onDismiss={handleDismissCapsule}
            onView={handleViewCapsule}
          />
        )}
        
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
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text 
                  style={[styles.userName, nameStyle]} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  {firstName}
                </Text>
                {streak > 1 && (
                  <Text style={{ fontSize: 11, color: '#1A3A0F', marginTop: 4 }}>
                    🔥 {streak} day streak!
                  </Text>
                )}
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{t.home.title}</Text>
              </View>
              <TouchableOpacity 
                style={styles.headerRight}
                onPress={() => navigation.navigate('Profile')}
              >
                <View style={styles.avatar}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>{avatarInitial}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTop}>{t.home.whatsOnMind}</Text>
            <Text style={styles.greetingBottom}>{t.home.chooseSpace}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.spacesTitle}>{t.home.yourSpaces}</Text>
            </View>
            
            <View style={styles.spacesContainer}>
              <FlatList
                data={paginatedItems}
                renderItem={renderPage}
                keyExtractor={(_, index) => `page-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const offset = e.nativeEvent.contentOffset.x;
                  const pageNum = Math.round(offset / (width - 32));
                  setActivePage(pageNum);
                }}
                scrollEventThrottle={16}
              />
              
              <View style={styles.paginationDots}>
                {paginatedItems.map((_, index) => (
                  <View 
                    key={index} 
                    style={[styles.dot, activePage === index && styles.activeDot]} 
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.home.recent}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={styles.searchBtn}
              >
                <Ionicons 
                  name='search-outline'
                  size={16} 
                  color='#4A7C2A'
                />
                <Text style={styles.searchBtnText}>
                  {t.category.search}
                </Text>
              </TouchableOpacity>
            </View>

            {recentLoading ? (
              <ActivityIndicator color="#2D5A1B" size="small" style={{ marginTop: 20 }} />
            ) : recentEntries.length > 0 ? (
              recentEntries.map((entry) => {
              const isCapsule = entry.isCapsule;
              const commonProps = {
                entry,
                onPress: () => {
                  if (longPressedId === entry.id) {
                    setLongPressedId(null);
                  } else {
                    navigation.navigate('ViewEntry', { entry });
                  }
                },
                onLongPress: () => setLongPressedId(entry.id),
                showActions: longPressedId === entry.id,
                onEdit: () => navigation.navigate('NewEntry', {
                  spaceId: entry.spaceId,
                  spaceName: entry.spaceName,
                  spaceIcon: 'bookmark-outline',
                  editEntry: entry,
                }),
                onDelete: () => setDeleteConfirmId(entry.id),
                isEditDisabled: entry.type === 'doodle' || (isCapsule && entry.editCount >= 1),
              };

              return (
                <View 
                  key={entry.id} 
                  style={{ marginHorizontal: 16, marginBottom: 8 }}
                >
                  {isCapsule ? (
                    <CapsuleCard {...commonProps} />
                  ) : (
                    <EntryCard {...commonProps} />
                  )}
                </View>
              );
            })
          ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌼</Text>
                <Text style={styles.emptyTitle}>{t.home.emptyTitle}</Text>
                <Text style={styles.emptySubtitle}>
                  Tap a space above to write your first entry 🌿
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={!!deleteConfirmId}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              marginHorizontal: 32,
              width: width * 0.8,
            }}>
              <Text style={{
                fontFamily: 'serif',
                fontSize: 18,
                fontWeight: '700',
                color: '#1A2E0F',
                marginBottom: 6,
              }}>Delete Entry?</Text>
              <Text style={{
                fontSize: 13,
                color: '#888888',
                marginBottom: 24,
              }}>This action cannot be undone.</Text>
              
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <TouchableOpacity 
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 25,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    alignItems: 'center',
                  }}
                  onPress={() => setDeleteConfirmId(null)}
                >
                  <Text style={{
                    color: '#888888',
                    fontSize: 14,
                    fontWeight: '600',
                  }}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{
                    flex: 1,
                    backgroundColor: '#E85555',
                    borderRadius: 25,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                  onPress={handleDeleteEntry}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: '600',
                  }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Space Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.home.addSpace}</Text>
              <Text style={styles.modalSubtitle}>{t.home.addSpaceSub}</Text>
              
              <View style={styles.emojiRow}>
                {ICON_OPTIONS.map((icon) => {
                  const isSelected = selectedIconOption.name === icon.name;
                  return (
                    <TouchableOpacity
                      key={icon.name}
                      style={[
                        styles.emojiOption, 
                        { 
                          backgroundColor: isSelected ? icon.color : `${icon.color}26` 
                        },
                        isSelected && { borderColor: icon.color, borderWidth: 2 }
                      ]}
                      onPress={() => setSelectedIconOption(icon)}
                    >
                      <Ionicons 
                        name={icon.name as any} 
                        size={20} 
                        color={isSelected ? 'white' : icon.color} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.input}
                placeholder={t.home.spaceName}
                placeholderTextColor="#888"
                value={newSpaceName}
                onChangeText={setNewSpaceName}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButton}>{t.home.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleAddSpace}>
                  <Text style={styles.addButtonText}>{t.home.addSpaceBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HomeScreen;

