import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { styles } from './ViewEntryScreen.styles';
import { Entry } from '../../services/entryService';
import FullImageViewer from '../shared/FullImageViewer/FullImageViewer';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DiaryStackParamList } from '../../navigation/types';
import { useEntriesStore } from '../../store/entriesStore';

type ViewEntryScreenRouteProp = RouteProp<DiaryStackParamList, 'ViewEntry'>;
type ViewEntryScreenNavigationProp = StackNavigationProp<DiaryStackParamList, 'ViewEntry'>;

const ViewEntryScreen: React.FC = () => {
  const route = useRoute<ViewEntryScreenRouteProp>();
  const navigation = useNavigation<ViewEntryScreenNavigationProp>();
  
  const { recentEntries, allEntries } = useEntriesStore();

  const entry = useMemo(() => {
    const fromRecent = recentEntries.find(e => e.id === route.params.entry.id);
    const fromAll = allEntries.find(e => e.id === route.params.entry.id);
    return fromRecent || fromAll || route.params.entry;
  }, [recentEntries, allEntries, route.params.entry]);

  const isCapsule = entry.isCapsule;
  const isLocked = isCapsule && new Date() < new Date(entry.unlockDate!);
  const isUnlocked = isCapsule && !isLocked;

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Full Image Viewer States
  const [selectedImage, setSelectedImage] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imagesToView, setImagesToView] = useState<string[]>([]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const playAudio = async (uri: string, id: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        if (playingId === id) {
          setPlayingId(null);
          return;
        }
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setPlayingId(id);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  const renderHeader = () => (
    <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{entry.spaceName}</Text>
        
        {entry.type !== 'doodle' && 
         entry.type !== 'audio' &&
         !(entry.isCapsule && 
           entry.editCount >= 1) ? (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => navigation.navigate('NewEntry', {
              spaceId: entry.spaceId,
              spaceName: entry.spaceName,
              spaceIcon: 'bookmark-outline',
              editEntry: entry,
            })}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={20} color="#2D5A1B" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
    </SafeAreaView>
  );

  const renderContent = () => {
    switch (entry.type) {
      case 'audio':
        try {
          const audios = JSON.parse(entry.content);
          return (
            <View>
              {audios.map((audio: { url: string; duration: number }, index: number) => (
                <View key={index} style={styles.audioCard}>
                  <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={() => playAudio(audio.url, `audio-${index}`)}
                  >
                    <Ionicons
                      name={playingId === `audio-${index}` ? 'pause' : 'play'}
                      size={18}
                      color="#2D5A1B"
                    />
                  </TouchableOpacity>
                  <View style={styles.audioInfo}>
                    <Text style={styles.audioName}>Audio {index + 1}</Text>
                    <Text style={styles.audioDuration}>
                      {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        } catch (e) {
          return <Text style={styles.bodyContent}>Error loading audio clips.</Text>;
        }

      case 'image':
        try {
          const data = JSON.parse(entry.content);
          const images = data.images || [];
          return (
            <View>
              <View style={styles.imageGrid}>
                {images.map((url: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedImage(url);
                      setSelectedImageIndex(index);
                      setImagesToView(images);
                      setShowImageViewer(true);
                    }}
                    activeOpacity={0.9}
                  >
                    <Image 
                      source={{ uri: url }} 
                      style={styles.gridImage} 
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {data.caption ? (
                <Text style={styles.imageCaption}>{data.caption}</Text>
              ) : null}
            </View>
          );
        } catch (e) {
          return <Text style={styles.bodyContent}>Error loading images.</Text>;
        }

      case 'doodle':
        const doodleUrls = (() => {
          try {
            const data = JSON.parse(entry.content);
            return Array.isArray(data) ? data : [entry.content];
          } catch {
            return entry.content ? [entry.content] : [];
          }
        })();

        if (doodleUrls.length === 0) {
          return (
            <View style={styles.placeholderContainer}>
              <Ionicons name="brush-outline" size={52} color="rgba(45,90,27,0.25)" />
              <Text style={styles.placeholderText}>Doodle not available</Text>
            </View>
          );
        }

        return (
          <View>
            {doodleUrls.map((uri: string, i: number) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setSelectedImage(uri);
                  setSelectedImageIndex(i);
                  setImagesToView(doodleUrls);
                  setShowImageViewer(true);
                }}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri }}
                  style={styles.doodleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return <Text style={styles.bodyContent}>{entry.content}</Text>;
    }
  };

  if (isLocked) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {renderHeader()}
        <View style={styles.lockedContainer}>
          <Ionicons 
            name="lock-closed" 
            size={52} 
            color="rgba(184,134,11,0.4)" 
          />
          <Text style={styles.lockedTitle}>This capsule is locked</Text>
          <Text style={styles.lockedSubtitle}>
            Opens on {formatDate(entry.unlockDate!)}
          </Text>
          <Text style={styles.lockedFooter}>Come back then 🌼</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView 
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isUnlocked && (
          <View style={styles.unlockedBanner}>
            <Ionicons name="lock-open-outline" size={16} color="#B8860B" />
            <View>
              <Text style={styles.bannerLabel}>This capsule has opened 🌼</Text>
              <Text style={styles.bannerDate}>Written on {formatDate(entry.createdAt)}</Text>
            </View>
          </View>
        )}

        <Text style={styles.title}>{entry.title || "Untitled Entry"}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.spaceTag}>
            <Text style={styles.spaceTagText}>{entry.spaceName}</Text>
          </View>
          <Text style={styles.metaDate}>{formatDate(entry.createdAt)}</Text>
          {entry.isEdited && (
            <Text style={styles.editedText}>Edited</Text>
          )}
        </View>

        <View style={styles.divider} />

        {renderContent()}
      </ScrollView>

      <FullImageViewer
        visible={showImageViewer}
        imageUri={selectedImage}
        currentIndex={selectedImageIndex}
        totalImages={imagesToView.length}
        onClose={() => setShowImageViewer(false)}
      />
    </View>
  );
};

export default ViewEntryScreen;
