import React, { useState, useMemo } from 'react';
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
import { useAuthStore } from '../../store/authStore';
import en from '../../locales/en.json';
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

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onSpacePress: (space: {
    id: string;
    name: string;
    icon: string;
  }) => void;
  onViewEntry: (entry: Entry) => void;
  onEditEntry: (entry: Entry) => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigate, 
  onSpacePress,
  onViewEntry,
  onEditEntry,
  onSearchPress,
  onProfilePress
}) => {
  const { user } = useAuthStore();
  const [spaces, setSpaces] = useState<any[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [deletingSpaceId, setDeletingSpaceId] = useState<string | null>(null);
  
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
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
    loadData();
    checkUnlockedCapsules();
  }, []);

  const checkUnlockedCapsules = async () => {
    try {
      const capsules = await getUnlockedCapsules(user!.token);
      setUnlockedCapsules(capsules);
    } catch (error) {
      console.log('Capsule check error:', error);
    }
  };

  const loadData = async () => {
    try {
      setSpacesLoading(true);
      setRecentLoading(true);
      const [fetchedSpaces, fetchedRecent, fetchedStats] = await Promise.all([
        fetchSpaces(user!.token),
        getRecentEntries(user!.token),
        getEntryStats(user!.token)
      ]);
      setSpaces(fetchedSpaces);
      setRecentEntries(fetchedRecent);
      setStreak(fetchedStats.streak);
    } catch (error) {
      console.log('Error loading home data:', error);
    } finally {
      setSpacesLoading(false);
      setRecentLoading(false);
    }
  };

  const handleAddSpace = async () => {
    if (newSpaceName.trim()) {
      try {
        const newSpace = await addCustomSpace(
          user!.token,
          newSpaceName.trim(),
          selectedIconOption.name,
          selectedIconOption.color,
          `${selectedIconOption.color}26` // 15% opacity in hex (26)
        );
        setSpaces(prev => [...prev, newSpace]);
        setNewSpaceName('');
        setModalVisible(false);
      } catch (error) {
        console.log('Error adding space:', error);
      }
    }
  };

  const handleDeleteSpace = async (id: string) => {
    try {
      const spaceToDelete = spaces.find(s => s.id === id);
      if (!spaceToDelete) return;

      await removeSpace(
        user!.token,
        id,
        !!spaceToDelete.isDefault
      );
      
      setSpaces(prev => prev.filter(s => s.id !== id));
      if (selectedSpaceId === id) setSelectedSpaceId(null);
      setDeletingSpaceId(null);
    } catch (error) {
      console.log('Error deleting space:', error);
    }
  };

  const handleDeleteEntry = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteEntry(user!.token, deleteConfirmId);
      setRecentEntries(prev => prev.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setLongPressedId(null);
    } catch (error) {
      Alert.alert('Error', 'Could not delete entry');
    }
  };

  const handleDismissCapsule = async (entryId: string) => {
    try {
      await markNotificationShown(user!.token, entryId);
      setUnlockedCapsules(prev => prev.filter(c => c.id !== entryId));
    } catch (error) {
      console.log('Mark shown error:', error);
    }
  };

  const handleViewCapsule = (entry: Entry) => {
    onViewEntry(entry);
  };

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
    if (hour < 12) return en.home.greeting_morning;
    if (hour < 17) return en.home.greeting_afternoon;
    return en.home.greeting_evening;
  }, []);

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

  if (spacesLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#2D5A1B" size="large" />
      </View>
    );
  }

  const renderPage = ({ item }: { item: any[] }) => (
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
              onSpacePress(space);
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
  );

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
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
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
                <Text style={{ fontSize: 11, color: '#2D5A1B', marginTop: 4 }}>
                  🔥 {streak} day streak!
                </Text>
              )}
            </View>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{en.home.title}</Text>
            </View>
            <TouchableOpacity 
              style={styles.headerRight}
              onPress={() => onProfilePress()}
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingTop}>{en.home.whatsOnMind}</Text>
            <Text style={styles.greetingBottom}>{en.home.chooseSpace}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.spacesTitle}>{en.home.yourSpaces}</Text>
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
              <Text style={styles.sectionTitle}>{en.home.recent}</Text>
              <TouchableOpacity
                onPress={onSearchPress}
                style={styles.searchBtn}
              >
                <Ionicons 
                  name='search-outline'
                  size={16} 
                  color='#4A7C2A'
                />
                <Text style={styles.searchBtnText}>
                  {en.category.search}
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
                    onViewEntry(entry);
                  }
                },
                onLongPress: () => setLongPressedId(entry.id),
                showActions: longPressedId === entry.id,
                onEdit: () => onEditEntry(entry),
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
                <Text style={styles.emptyTitle}>{en.home.emptyTitle}</Text>
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
              <Text style={styles.modalTitle}>{en.home.addSpace}</Text>
              <Text style={styles.modalSubtitle}>{en.home.addSpaceSub}</Text>
              
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
                placeholder={en.home.spaceName}
                placeholderTextColor="#888"
                value={newSpaceName}
                onChangeText={setNewSpaceName}
                autoFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButton}>{en.home.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleAddSpace}>
                  <Text style={styles.addButtonText}>{en.home.addSpaceBtn}</Text>
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

