import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import en from '../../locales/en.json';
import { styles } from './NewEntryScreen.styles';
import { createEntry, updateEntry, Entry } from '../../services/entryService';
import { useAuthStore } from '../../store/authStore';
import AudioRecorder from './AudioRecorder';
import ImageUploader from './ImageUploader';
import DoodleCanvas, { DoodleCanvasRef } from './DoodleCanvas';
import axios from 'axios';
import CustomModal from '../shared/CustomModal/CustomModal';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiaryStackParamList } from '../../navigation/types';
import { useEntriesStore } from '../../store/entriesStore';

type NewEntryScreenRouteProp = RouteProp<DiaryStackParamList, 'NewEntry'>;
type NewEntryScreenNavigationProp = StackNavigationProp<DiaryStackParamList, 'NewEntry'>;

type Tab = 'text' | 'audio' | 'image' | 'doodle';
type CapsuleDuration = '1mo' | '6mo' | '1yr' | 'custom';

const NewEntryScreen: React.FC = () => {
  const route = useRoute<NewEntryScreenRouteProp>();
  const navigation = useNavigation<NewEntryScreenNavigationProp>();
  const { spaceId, spaceName, spaceIcon, editEntry } = route.params;

  const { user } = useAuthStore();
  
  const [title, setTitle] = useState(editEntry?.title || '');
  const [content, setContent] = useState(editEntry?.content || '');
  const [activeTab, setActiveTab] = useState<Tab>((editEntry?.type as Tab) || 'text');
  const [isCapsule, setIsCapsule] = useState(editEntry?.isCapsule || false);
  const [capsuleDuration, setCapsuleDuration] = useState<CapsuleDuration>(
    (editEntry?.capsuleDuration as CapsuleDuration) || '6mo'
  );
  
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState<Date>(
    editEntry?.unlockDate ? new Date(editEntry.unlockDate) : new Date()
  );
  
  // Formatting state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [listType, setListType] = useState<'none' | 'bullet' | 'number'>('none');
  const [lineCount, setLineCount] = useState(1);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Modal states
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavAction, setPendingNavAction] = useState<(() => void) | null>(null);
  const isSavingRef = useRef(false);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const [audioRecordings, setAudioRecordings] = useState<{ uri: string; duration: number; id: string }[]>([]);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [imageCaption, setImageCaption] = useState('');
  const [hasDoodle, setHasDoodle] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const doodleRef = useRef<DoodleCanvasRef>(null);

  const isEditMode = !!editEntry;
  const currentTab = isEditMode ? (editEntry.type as Tab) : activeTab;

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  // FIX 4: Parse existing data for edit mode
  const existingImageData = isEditMode && editEntry?.type === 'image'
    ? (() => {
        try { 
          return JSON.parse(editEntry.content);
        } catch { return null; }
      })()
    : null;

  const existingAudioData = isEditMode && editEntry?.type === 'audio'
    ? (() => {
        try {
          const urls = JSON.parse(editEntry.content);
          return urls.map((audio: { url: string; duration: number }, i: number) => ({
            uri: audio.url,
            duration: audio.duration,
            id: `existing_${i}`
          }));
        } catch { return []; }
      })()
    : [];

  const hasUnsavedChanges = (() => {
    switch (activeTab) {
      case 'text':
        return title.trim().length > 0 || content.trim().length > 0;
      case 'audio':
        return title.trim().length > 0 || audioRecordings.length > 0;
      case 'image':
        return title.trim().length > 0 || imageUris.length > 0;
      case 'doodle':
        return title.trim().length > 0 || hasDoodle;
      default:
        return false;
    }
  })();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasUnsavedChanges || isSavingRef.current) return;

      e.preventDefault();

      setShowUnsavedModal(true);
      setPendingNavAction(() => () => navigation.dispatch(e.data.action));
    });
    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTextChange = (text: string) => {
    if (listType === 'bullet') {
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine === '' && 
          lines.length > 1 &&
          lines[lines.length - 2] === '• ') {
        // Remove empty bullet
        lines.splice(-2, 2);
        setContent(lines.join('\n'));
        return;
      }
      if (text.endsWith('\n')) {
        setContent(text + '• ');
        return;
      }
    }
    if (listType === 'number') {
      if (text.endsWith('\n')) {
        setContent(text + `${lineCount + 1}. `);
        setLineCount(prev => prev + 1);
        return;
      }
    }
    setContent(text);
  };

  const applyFormatting = (type: 'bold' | 'italic' | 'underline' | 'strike') => {
    let tag = '';
    switch (type) {
      case 'bold': tag = '**'; break;
      case 'italic': tag = '*'; break;
      case 'underline': tag = '__'; break; // Using markdown standard for underline
      case 'strike': tag = '~~'; break;
    }

    const { start, end } = selection;
    if (start !== end) {
      const selectedText = content.substring(start, end);
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);
      
      const newText = `${beforeText}${tag}${selectedText}${tag}${afterText}`;
      setContent(newText);
    }

    // Always toggle state for global visual feedback as requested
    if (type === 'bold') setIsBold(!isBold);
    if (type === 'italic') setIsItalic(!isItalic);
    if (type === 'underline') setIsUnderline(!isUnderline);
    if (type === 'strike') setIsStrike(!isStrike);
  };

  // Animation for toggle
  const toggleAnim = useRef(new Animated.Value(editEntry?.isCapsule ? 1 : 0)).current;
  const capsuleOptionsAnim = useRef(new Animated.Value(editEntry?.isCapsule ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(toggleAnim, {
      toValue: isCapsule ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();

    Animated.timing(capsuleOptionsAnim, {
      toValue: isCapsule ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isCapsule]);

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  const capsuleHeight = capsuleOptionsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], 
  });

  const getUnlockDate = (): string => {
    if (capsuleDuration === 'custom') {
      return customDate.toISOString();
    }
    const date = new Date();
    if (capsuleDuration === '1mo') {
      date.setMonth(date.getMonth() + 1);
    } else if (capsuleDuration === '6mo') {
      date.setMonth(date.getMonth() + 6);
    } else if (capsuleDuration === '1yr') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString();
  };

  const calculateDisplayUnlockDate = () => {
    const dateStr = getUnlockDate();
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const uploadAudioToCloudinary = async (uri: string): Promise<string> => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'audio.m4a',
    } as any);
    formData.append('upload_preset', uploadPreset!);
    formData.append('resource_type', 'video');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.secure_url;
  };

  const uploadImageToCloudinary = async (uri: string): Promise<string> => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('upload_preset', uploadPreset!);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data.secure_url;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert(en.newEntry.titleRequired, en.newEntry.titleRequiredMsg);
      return;
    }

    if (activeTab === 'text' && !content.trim()) {
      showAlert(en.newEntry.emptyAlert, en.newEntry.emptyAlertMsg);
      return;
    }

    if (activeTab === 'audio' && audioRecordings.length === 0) {
      showAlert('No Audio', 'Please record at least one audio clip.');
      return;
    }

    if (activeTab === 'image' && imageUris.length === 0) {
      showAlert('No Images', 'Please select at least one image.');
      return;
    }

    if (activeTab === 'doodle' && !hasDoodle) {
      showAlert('Empty Canvas', 'Please draw something before saving.');
      return;
    }

    try {
      setLoading(true);
      isSavingRef.current = true;

      const unlockDate = isCapsule ? getUnlockDate() : null;
      let finalContent = content;

      if (activeTab === 'audio') {
        const urls = await Promise.all(
          audioRecordings.map(async (rec) => {
            const url = await uploadAudioToCloudinary(rec.uri);
            return { url, duration: rec.duration };
          })
        );
        finalContent = JSON.stringify(urls);
      } else if (activeTab === 'image') {
        const urls = await Promise.all(
          imageUris.map((uri) => uploadImageToCloudinary(uri))
        );
        finalContent = JSON.stringify({
          images: urls,
          caption: imageCaption
        });
      } else if (activeTab === 'doodle') {
        const localUris = await doodleRef.current?.capture();
        if (localUris && localUris.length > 0) {
          const cloudUrls = await Promise.all(
            localUris.map((uri) => uploadImageToCloudinary(uri))
          );
          finalContent = JSON.stringify(cloudUrls);
        }
      }

      let updatedEntry: Entry | null = null;
      if (editEntry) {
        updatedEntry = await updateEntry(editEntry.id, {
          title,
          content: finalContent,
        });
      } else {
        await createEntry({
          title,
          content: finalContent,
          type: currentTab,
          spaceId: spaceId,
          spaceName: spaceName,
          isCapsule,
          capsuleDuration: isCapsule ? capsuleDuration : null,
          unlockDate,
        });
      }

      if (editEntry && updatedEntry) {
        // Update store
        useEntriesStore.getState().updateEntryInCache(updatedEntry);

        // Navigate back with updated data
        navigation.navigate('ViewEntry', {
          entry: updatedEntry
        });
      } else {
        useEntriesStore.getState().invalidateCache();
        useEntriesStore.getState().invalidateSpaceCache(spaceId);
        navigation.goBack();
      }
    } catch (error) {
      isSavingRef.current = false;
      console.error('Save error:', error);
      showAlert('Error', 'Could not save entry. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'text':
        return (
          <TextInput
            style={[
              styles.textInput,
              isBold && { fontWeight: 'bold' },
              isItalic && { fontStyle: 'italic' },
              isUnderline && { textDecorationLine: 'underline' },
              isStrike && { textDecorationLine: isUnderline ? 'underline line-through' : 'line-through' },
              { textAlign: alignment }
            ]}
            multiline
            placeholder={en.newEntry.textPlaceholder}
            placeholderTextColor="#CCCCCC"
            value={content}
            onChangeText={handleTextChange}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            textAlignVertical="top"
            underlineColorAndroid='transparent'
          />
        );
      case 'audio':
        return (
          <AudioRecorder 
            onAudiosChange={setAudioRecordings} 
            existingAudios={existingAudioData}
          />
        );
      case 'image':
        return (
          <ImageUploader 
            onImagesChange={(urls, caption) => {
              setImageUris(urls);
              setImageCaption(caption);
            }} 
            existingImages={existingImageData?.images || []}
            existingCaption={existingImageData?.caption || ''}
          />
        );
      case 'doodle':
        return (
          <DoodleCanvas 
            ref={doodleRef} 
            onDoodleCapture={(uris) => setHasDoodle(uris.length > 0)}
            onDrawingStart={() => setIsDrawingActive(true)}
            onDrawingEnd={() => setIsDrawingActive(false)}
          />
        );
      default:
        return null;
    }
  };

  const renderToolbar = () => {
    const showToolbar = (activeTab === 'text' && !isEditMode) || (isEditMode && editEntry?.type === 'text');
    if (!showToolbar) return null;

    return (
      <View style={{ marginBottom: 12 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.toolbarContainer}
        >
          {/* Row 1: Style */}
          <TouchableOpacity 
            style={[styles.toolbarButton, isBold && styles.activeToolbarButton]} 
            onPress={() => applyFormatting('bold')}
          >
            <Text style={styles.boldIcon}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, isItalic && styles.activeToolbarButton]} 
            onPress={() => applyFormatting('italic')}
          >
            <Text style={styles.italicIcon}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, isUnderline && styles.activeToolbarButton]} 
            onPress={() => applyFormatting('underline')}
          >
            <Text style={styles.underlineIcon}>U</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, isStrike && styles.activeToolbarButton]} 
            onPress={() => applyFormatting('strike')}
          >
            <Text style={styles.strikeIcon}>S</Text>
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          {/* Row 2: Alignment */}
          <TouchableOpacity 
            style={[styles.toolbarButton, alignment === 'left' && styles.activeToolbarButton]} 
            onPress={() => setAlignment('left')}
          >
            <Ionicons name="reorder-three-outline" size={20} color="#1A2E0F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, alignment === 'center' && styles.activeToolbarButton]} 
            onPress={() => setAlignment('center')}
          >
            <Ionicons name="reorder-two-outline" size={20} color="#1A2E0F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, alignment === 'right' && styles.activeToolbarButton]} 
            onPress={() => setAlignment('right')}
          >
            <Ionicons name="menu-outline" size={20} color="#1A2E0F" />
          </TouchableOpacity>

          <View style={styles.toolbarDivider} />

          {/* Row 3: List */}
          <TouchableOpacity 
            style={[styles.toolbarButton, listType === 'bullet' && styles.activeToolbarButton]} 
            onPress={() => setListType(listType === 'bullet' ? 'none' : 'bullet')}
          >
            <Ionicons name="list-outline" size={20} color="#1A2E0F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, listType === 'number' && styles.activeToolbarButton]} 
            onPress={() => {
              setListType(listType === 'number' ? 'none' : 'number');
              if (listType !== 'number') setLineCount(1);
            }}
          >
            <Ionicons name="list-circle-outline" size={20} color="#1A2E0F" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const TabChip = ({ id, label, icon }: { id: Tab; label: string; icon: any }) => {
    const isActive = activeTab === id;
    return (
      <TouchableOpacity
        style={[styles.tabChip, isActive && styles.activeTabChip]}
        onPress={() => setActiveTab(id)}
        activeOpacity={0.7}
        disabled={!!editEntry} // Disable format change on edit
      >
        <Ionicons name={icon} size={14} color={isActive ? '#FFFFFF' : '#4A7C2A'} />
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const DurationChip = ({ id, label }: { id: CapsuleDuration; label: string }) => {
    const isActive = capsuleDuration === id;
    return (
      <TouchableOpacity
        style={[styles.durationChip, isActive && styles.activeDurationChip]}
        onPress={() => {
          setCapsuleDuration(id);
          if (id === 'custom') {
            setShowDatePicker(true);
          }
        }}
        activeOpacity={0.7}
        disabled={!!editEntry}
      >
        <Text style={[styles.durationChipText, isActive && styles.activeDurationChipText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {editEntry ? 'Edit Entry' : en.newEntry.title}
          </Text>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            activeOpacity={0.7}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#2D5A1B" />
            ) : (
              <Ionicons name="checkmark" size={20} color="#2D5A1B" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          scrollEnabled={!isDrawingActive}
        >
          <TextInput
            style={[styles.titleInput, { fontStyle: 'italic' }]}
            placeholder={en.newEntry.titlePlaceholder}
            placeholderTextColor="#AAAAAA"
            value={title}
            onChangeText={setTitle}
            underlineColorAndroid='transparent'
          />
          
          {!isEditMode && (
            <View style={styles.tabsRow}>
              <TabChip id="text" label={en.newEntry.text} icon="document-text-outline" />
              <TabChip id="audio" label={en.newEntry.audio} icon="mic-outline" />
              <TabChip id="image" label={en.newEntry.image} icon="image-outline" />
              <TabChip id="doodle" label={en.newEntry.doodle} icon="pencil-outline" />
            </View>
          )}

          {renderContent()}

          {renderToolbar()}

          {!isEditMode && (
            <>
              {/* Memory Capsule Section */}
              <View style={styles.capsuleSection}>
                <TouchableOpacity 
                  style={styles.capsuleToggle}
                  activeOpacity={0.9}
                  onPress={() => !editEntry && setIsCapsule(!isCapsule)}
                  disabled={!!editEntry}
                >
                  <View style={styles.capsuleToggleLeft}>
                    <Ionicons name="lock-closed-outline" size={18} color="#B8860B" />
                    <View style={styles.capsuleToggleTextColumn}>
                      <Text style={styles.capsuleTitle}>{en.newEntry.capsuleTitle}</Text>
                      <Text style={styles.capsuleSubtitle}>{en.newEntry.capsuleSubtitle}</Text>
                    </View>
                  </View>

                  <View style={[styles.switchTrack, isCapsule && styles.switchTrackActive]}>
                    <Animated.View style={[styles.switchThumb, { transform: [{ translateX }] }]} />
                  </View>
                </TouchableOpacity>

                {isCapsule && (
                  <Animated.View style={[styles.capsuleOptions, { maxHeight: capsuleHeight }]}>
                    <View style={styles.durationRow}>
                      <DurationChip id="1mo" label={en.newEntry['1mo']} />
                      <DurationChip id="6mo" label={en.newEntry['6mo']} />
                      <DurationChip id="1yr" label={en.newEntry['1yr']} />
                      <DurationChip id="custom" label={en.newEntry.custom} />
                    </View>

                    <Text style={styles.unlockDateText}>
                      Opens: {calculateDisplayUnlockDate()}
                    </Text>
                  </Animated.View>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={customDate}
                  mode="date"
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setCustomDate(date);
                  }}
                />
              )}

              {isCapsule && (
                <TouchableOpacity 
                   style={styles.saveCapsuleButton}
                  activeOpacity={0.8}
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="lock-closed" size={16} color="white" />
                      <Text style={styles.saveCapsuleText}>{en.newEntry.lock}</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Popups */}
      <Modal
        visible={showUnsavedModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.unsavedModalCard}>
            <Text style={styles.unsavedModalTitle}>Unsaved Changes</Text>
            <Text style={styles.unsavedModalMessage}>Do you want to save your entry before leaving?</Text>
            
            <View style={styles.unsavedModalButtons}>
              <TouchableOpacity 
                style={styles.unsavedCancelBtn}
                onPress={() => setShowUnsavedModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.unsavedCancelText}>Keep Writing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.unsavedDiscardBtn}
                onPress={() => {
                  setShowUnsavedModal(false);
                  pendingNavAction?.();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.unsavedDiscardText}>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.unsavedSaveBtn}
                onPress={async () => {
                  setShowUnsavedModal(false);
                  await handleSave();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.unsavedSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type="alert"
        confirmText="OK"
        onConfirm={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </View>
  );
};

export default NewEntryScreen;
