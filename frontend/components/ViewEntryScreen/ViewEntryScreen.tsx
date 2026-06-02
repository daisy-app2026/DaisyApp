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
import { LinearGradient } from 'expo-linear-gradient';
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

  const freshEntry = useMemo(() => {
    return recentEntries.find(
      e => e.id === route.params.entry.id
    ) || allEntries.find(
      e => e.id === route.params.entry.id
    ) || route.params.entry
  }, [recentEntries, allEntries, route.params.entry.id]);

  const isCapsule = freshEntry.isCapsule;
  const isLocked = isCapsule && new Date() < new Date(freshEntry.unlockDate!);
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
      <View style={styles.headerOrb1} />
      <View style={styles.headerOrb2} />
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#1A3A0F" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{freshEntry.spaceName}</Text>
          
          {freshEntry.type !== 'doodle' && 
           freshEntry.type !== 'audio' &&
           !(freshEntry.isCapsule && 
             freshEntry.editCount >= 1) ? (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('NewEntry', {
                spaceId: freshEntry.spaceId,
                spaceName: freshEntry.spaceName,
                spaceIcon: 'bookmark-outline',
                editEntry: freshEntry,
              })}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#1A3A0F" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );

  const renderContent = () => {
    switch (freshEntry.type) {
      case 'audio':
        try {
          const audios = JSON.parse(freshEntry.content);
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
          const data = JSON.parse(freshEntry.content);
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
            const data = JSON.parse(freshEntry.content);
            return Array.isArray(data) ? data : [freshEntry.content];
          } catch {
            return freshEntry.content ? [freshEntry.content] : [];
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
        return <Text style={styles.bodyContent}>{freshEntry.content}</Text>;
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
            Opens on {formatDate(freshEntry.unlockDate!)}
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
              <Text style={styles.bannerDate}>Written on {formatDate(freshEntry.createdAt)}</Text>
            </View>
          </View>
        )}

        <Text style={styles.title}>{freshEntry.title || "Untitled Entry"}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.spaceTag}>
            <Text style={styles.spaceTagText}>{freshEntry.spaceName}</Text>
          </View>
          <Text style={styles.metaDate}>{formatDate(freshEntry.createdAt)}</Text>
          {freshEntry.isEdited && (
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
