import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import en from '../../locales/en.json';
import { styles } from './CategoryScreen.styles';
import EntryCard from '../shared/EntryCard/EntryCard';
import CapsuleCard from '../shared/CapsuleCard/CapsuleCard';
import { getEntriesBySpace, deleteEntry, Entry } from '../../services/entryService';

interface CategoryScreenProps {
  space: {
    id: string;
    name: string;
    icon: string;
  };
  onBack: () => void;
  onNewEntry: () => void;
  onViewEntry: (entry: Entry) => void;
  onEditEntry: (entry: Entry) => void;
  onRefresh?: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
}

const CategoryScreen: React.FC<CategoryScreenProps> = ({
  space,
  onBack,
  onNewEntry,
  onViewEntry,
  onEditEntry,
  onRefresh,
  onSearchPress,
  onProfilePress,
}) => {
  const { user } = useAuthStore();
  
  if (!space) return null;
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [longPressedId, setLongPressedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const avatarInitial = React.useMemo(() => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  }, [user?.name]);

  useEffect(() => {
    loadEntries();
  }, [space.id]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getEntriesBySpace(user!.token, space.id);
      setEntries(data);
    } catch (error) {
      console.log('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteEntry(user!.token, deleteConfirmId);
      setEntries(prev => prev.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setLongPressedId(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      Alert.alert('Error', 'Could not delete entry');
    }
  };

  // Removed internal EntryCard component in favor of shared ones

  return (
    <TouchableWithoutFeedback onPress={() => setLongPressedId(null)}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{space.name}</Text>
            
            <TouchableOpacity 
              style={styles.avatar} 
              onPress={onProfilePress}
              activeOpacity={0.7}
            >
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarText}>{avatarInitial}</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <TouchableOpacity 
            style={styles.newEntryBtn}
            onPress={onNewEntry}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color="#2D5A1B" />
            <Text style={styles.newEntryBtnText}>{en.category.startNewEntry}</Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{en.category.allEntries}</Text>
            <TouchableOpacity 
              style={styles.searchBtn}
              onPress={onSearchPress}
            >
              <Ionicons name="search-outline" size={18} color="#4A7C2A" />
              <Text style={styles.searchText}>{en.category.search}</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#2D5A1B" style={{ marginTop: 40 }} />
          ) : entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="create-outline" size={52} color="rgba(45,90,27,0.25)" />
              <Text style={styles.emptyTitle}>{en.category.noEntries}</Text>
              <Text style={styles.emptySubtitle}>
                {en.category.noEntriesSubtitle.replace('entries', `${space.name} entries`)}
              </Text>
            </View>
          ) : (
            entries.map(entry => {
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

              return isCapsule ? (
                <CapsuleCard key={entry.id} {...commonProps} />
              ) : (
                <EntryCard key={entry.id} {...commonProps} />
              );
            })
          )}
        </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!deleteConfirmId}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Entry?</Text>
            <Text style={styles.modalSubtitle}>This action cannot be undone.</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setDeleteConfirmId(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalDelete}
                onPress={handleDelete}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default CategoryScreen;
