import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../../store/authStore';
import en from '../../locales/en.json';
import { styles } from './SearchScreen.styles';
import { getAllEntries, Entry } from '../../services/entryService';
import EntryCard from '../shared/EntryCard/EntryCard';
import CapsuleCard from '../shared/CapsuleCard/CapsuleCard';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiaryStackParamList } from '../../navigation/types';
import { useEntriesStore } from '../../store/entriesStore';

type SearchScreenNavigationProp = StackNavigationProp<DiaryStackParamList, 'Search'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');

  const {
    allEntries,
    setAllEntries,
    isAllLoaded,
  } = useEntriesStore();

  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(!isAllLoaded);
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'capsule'>('all');
  const [filterEntryType, setFilterEntryType] = useState<'all' | 'text' | 'audio' | 'image' | 'doodle'>('all');
  const [filterSpace, setFilterSpace] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<Date | null>(null);
  const [filterDateTo, setFilterDateTo] = useState<Date | null>(null);
  const [showDateFromPicker, setShowDateFromPicker] = useState(false);
  const [showDateToPicker, setShowDateToPicker] = useState(false);

  const modalAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (!isAllLoaded) {
      loadAllEntries();
    } else {
      setFilteredEntries(allEntries);
      setLoading(false);
    }
  }, [isAllLoaded]);

  useEffect(() => {
    if (showFilter) {
      Animated.spring(modalAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showFilter]);

  const loadAllEntries = async () => {
    try {
      setLoading(true);
      const entries = await getAllEntries();
      setAllEntries(entries);
      setFilteredEntries(entries);
    } catch (error) {
      console.log('Search load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applySearchAndFilter();
  }, [query, filterType, filterEntryType, filterSpace, filterDateFrom, filterDateTo, allEntries]);

  const applySearchAndFilter = () => {
    let results = [...allEntries];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter((entry) => {
        const titleMatch = entry.title?.toLowerCase().includes(q);
        
        let contentMatch = false;
        if (entry.type === 'text') {
          contentMatch = entry.content?.toLowerCase().includes(q);
        } else if (entry.type === 'image') {
          try {
            const data = JSON.parse(entry.content);
            contentMatch = data.caption?.toLowerCase().includes(q) || false;
          } catch {
            contentMatch = entry.content?.toLowerCase().includes(q);
          }
        } else if (entry.type === 'audio' || entry.type === 'doodle') {
          // Content is usually metadata/JSON for these
          contentMatch = false;
        }

        return titleMatch || contentMatch;
      });
    }

    // Filter by category (Normal vs Capsule)
    if (filterType === 'normal') {
      results = results.filter((e) => !e.isCapsule);
    } else if (filterType === 'capsule') {
      results = results.filter((e) => e.isCapsule);
    }

    // Filter by format (text, audio, image, doodle)
    if (filterEntryType !== 'all') {
      results = results.filter((e) => e.type === filterEntryType);
    }

    // Filter by space
    if (filterSpace !== 'all') {
      results = results.filter((e) => e.spaceId === filterSpace);
    }

    // Filter by date range
    if (filterDateFrom) {
      const fromStart = new Date(filterDateFrom);
      fromStart.setHours(0, 0, 0, 0);
      results = results.filter((e) => new Date(e.createdAt) >= fromStart);
    }
    if (filterDateTo) {
      const toEnd = new Date(filterDateTo);
      toEnd.setHours(23, 59, 59, 999);
      results = results.filter((e) => new Date(e.createdAt) <= toEnd);
    }

    setFilteredEntries(results);
  };

  const spaces = useMemo(() => {
    const spaceMap = new Map();
    allEntries.forEach((e) => {
      if (!spaceMap.has(e.spaceId)) {
        spaceMap.set(e.spaceId, e.spaceName);
      }
    });
    return Array.from(spaceMap.entries()).map(([id, name]) => ({ id, name }));
  }, [allEntries]);

  const resetFilters = () => {
    setFilterType('all');
    setFilterEntryType('all');
    setFilterSpace('all');
    setFilterDateFrom(null);
    setFilterDateTo(null);
  };

  const isFilterActive = useMemo(() => {
    return (
      filterType !== 'all' ||
      filterEntryType !== 'all' ||
      filterSpace !== 'all' ||
      filterDateFrom !== null ||
      filterDateTo !== null
    );
  }, [filterType, filterEntryType, filterSpace, filterDateFrom, filterDateTo]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#2D5A1B" style={{ marginRight: 8, opacity: 0.5 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={en.search.placeholder}
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setShowFilter(true)}
          >
            <Ionicons name="options-outline" size={22} color="#2D5A1B" />
            {isFilterActive && <View style={styles.activeFilterDot} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Body */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsList}
      >
        <Text style={styles.resultsCount}>
          {filteredEntries.length} {en.search.results}
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2D5A1B" size="large" />
          </View>
        ) : filteredEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={52} color="rgba(45,90,27,0.25)" />
            <Text style={styles.emptyTitle}>{en.search.noResults}</Text>
            <Text style={styles.emptySubtitle}>{en.search.noResultsSub}</Text>
          </View>
        ) : (
          filteredEntries.map((entry) => {
            const commonProps = {
              entry,
              onPress: () => navigation.navigate('ViewEntry', { entry }),
              onLongPress: () => {},
              onEdit: () => {},
              onDelete: () => {},
              showActions: false,
            };

            return entry.isCapsule ? (
              <View key={entry.id} style={{ marginBottom: 12 }}>
                <CapsuleCard {...commonProps} />
              </View>
            ) : (
              <View key={entry.id} style={{ marginBottom: 12 }}>
                <EntryCard {...commonProps} />
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent
        animationType="none"
        onRequestClose={() => setShowFilter(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilter(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.modalCard,
                  { transform: [{ translateY: modalAnim }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{en.search.filter}</Text>
                  <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                    <Text style={styles.resetText}>{en.search.reset}</Text>
                  </TouchableOpacity>
                </View>

                {/* Section 1: Entry Type */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>{en.search.entryType}</Text>
                  <View style={styles.chipRow}>
                    {(['all', 'normal', 'capsule'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.chip, filterType === type && styles.activeChip]}
                        onPress={() => setFilterType(type)}
                      >
                        <Text style={[styles.chipText, filterType === type && styles.activeChipText]}>
                          {en.search[type]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Section 2: Format */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>{en.search.format}</Text>
                  <View style={styles.chipRow}>
                    {(['all', 'text', 'audio', 'image', 'doodle'] as const).map((format) => (
                      <TouchableOpacity
                        key={format}
                        style={[styles.chip, filterEntryType === format && styles.activeChip]}
                        onPress={() => setFilterEntryType(format)}
                      >
                        <Text style={[styles.chipText, filterEntryType === format && styles.activeChipText]}>
                          {en.search[format]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Section 3: Spaces */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>{en.search.space}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipRow}>
                      <TouchableOpacity
                        style={[styles.chip, filterSpace === 'all' && styles.activeChip]}
                        onPress={() => setFilterSpace('all')}
                      >
                        <Text style={[styles.chipText, filterSpace === 'all' && styles.activeChipText]}>
                          {en.search.all}
                        </Text>
                      </TouchableOpacity>
                      {spaces.map((s) => (
                        <TouchableOpacity
                          key={s.id}
                          style={[styles.chip, filterSpace === s.id && styles.activeChip]}
                          onPress={() => setFilterSpace(s.id)}
                        >
                          <Text style={[styles.chipText, filterSpace === s.id && styles.activeChipText]}>
                            {s.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                {/* Section 4: Date Range */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>{en.search.dateRange}</Text>
                  <View style={styles.dateGrid}>
                    <TouchableOpacity 
                      style={styles.datePickerBtn}
                      onPress={() => setShowDateFromPicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {filterDateFrom ? formatDate(filterDateFrom) : en.search.fromDate}
                      </Text>
                      <Ionicons name="calendar-outline" size={16} color="#2D5A1B" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.datePickerBtn}
                      onPress={() => setShowDateToPicker(true)}
                    >
                      <Text style={styles.dateText}>
                        {filterDateTo ? formatDate(filterDateTo) : en.search.toDate}
                      </Text>
                      <Ionicons name="calendar-outline" size={16} color="#2D5A1B" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => setShowFilter(false)}
                >
                  <Text style={styles.applyButtonText}>{en.search.apply}</Text>
                </TouchableOpacity>

                {showDateFromPicker && (
                  <DateTimePicker
                    value={filterDateFrom || new Date()}
                    mode="date"
                    onChange={(e, date) => {
                      setShowDateFromPicker(false);
                      if (date) setFilterDateFrom(date);
                    }}
                  />
                )}
                {showDateToPicker && (
                  <DateTimePicker
                    value={filterDateTo || new Date()}
                    mode="date"
                    onChange={(e, date) => {
                      setShowDateToPicker(false);
                      if (date) setFilterDateTo(date);
                    }}
                  />
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SearchScreen;
