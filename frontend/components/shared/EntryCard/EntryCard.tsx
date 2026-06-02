import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { styles } from './EntryCard.styles';
import { Entry } from '../../../services/entryService';

interface EntryCardProps {
  entry: Entry;
  onPress: () => void;
  onLongPress: () => void;
  showActions: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isEditDisabled?: boolean;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onPress,
  onLongPress,
  showActions,
  onEdit,
  onDelete,
  isEditDisabled = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const formattedDate = new Date(entry?.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const parseContent = (content: string, type: string) => {
    try {
      if (type === 'image' || type === 'audio') {
        return JSON.parse(content);
      }
    } catch {
      return null;
    }
    return content;
  };

  const playAudio = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        if (isPlaying) {
          setIsPlaying(false);
          setSound(null);
          return;
        }
      }
      const { sound: s } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(s);
      setIsPlaying(true);
      s.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };

  const renderPreview = () => {
    const data = parseContent(entry.content, entry.type);
    
    switch (entry.type) {
      case 'image':
        return (
          <View style={styles.contentRow}>
            {data?.images?.[0] && (
              <Image source={{ uri: data.images[0] }} style={styles.previewImage} resizeMode="cover" />
            )}
            <Text style={[styles.preview, { flex: 1 }]} numberOfLines={2}>
              {data?.caption || 'Image entry'}
            </Text>
          </View>
        );
      case 'audio':
        const audioList = Array.isArray(data) ? data : [];
        return (
          <View style={styles.audioPreview}>
            <TouchableOpacity 
              style={styles.playBtn}
              onPress={() => audioList[0]?.url && playAudio(audioList[0].url)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'}
                size={14} 
                color='#2D5A1B'
              />
            </TouchableOpacity>
            <Text style={styles.audioCount}>
              {audioList.length} recording{audioList.length !== 1 ? 's' : ''}
            </Text>
          </View>
        );
      case 'doodle':
        console.log('Doodle content:', entry.content);
        const doodleUrl = (() => {
          try {
            const parsed = JSON.parse(entry.content);
            return Array.isArray(parsed) ? parsed[0] : entry.content;
          } catch {
            return entry.content;
          }
        })();
        return (
          <View style={styles.contentRow}>
            {doodleUrl && (
              <Image source={{ uri: doodleUrl }} style={styles.previewImage} resizeMode="cover" />
            )}
            <Text style={[styles.preview, { flex: 1 }]} numberOfLines={2}>
              {'Doodle entry'}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={styles.preview} numberOfLines={1}>
            {(entry?.content || "").substring(0, 50)}...
          </Text>
        );
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={400}
      >
        <Text style={styles.title}>{entry?.title || "Untitled Entry"}</Text>
        
        {renderPreview()}

        <View style={styles.tagsRow}>
          <View style={styles.spaceTag}>
            <Text style={styles.spaceTagText}>{entry?.spaceName || ""}</Text>
          </View>
          <View style={styles.dateTag}>
            <Text style={styles.dateTagText}>{formattedDate}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, isEditDisabled && styles.actionBtnDisabled]}
            onPress={onEdit}
            disabled={isEditDisabled}
          >
            <Ionicons
              name="create-outline"
              size={15}
              color={isEditDisabled ? "#AAAAAA" : "#2D5A1B"}
            />
            <Text style={[styles.actionText, isEditDisabled && styles.actionTextDisabled]}>
              {isEditDisabled 
                ? (entry.type === 'doodle' ? "Cannot edit doodle" : "Already Edited") 
                : "Edit"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={15} color="#E85555" />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(EntryCard);
