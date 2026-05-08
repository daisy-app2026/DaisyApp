import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './CapsuleCard.styles';
import { Entry } from '../../../services/entryService';

interface CapsuleCardProps {
  entry: Entry;
  onPress: () => void;
  onLongPress: () => void;
  showActions: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isEditDisabled?: boolean;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({
  entry,
  onPress,
  onLongPress,
  showActions,
  onEdit,
  onDelete,
  isEditDisabled = false,
}) => {
  const formattedUnlockDate = entry?.unlockDate 
    ? new Date(entry.unlockDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown';

  const formattedCreatedAt = new Date(entry?.createdAt || Date.now()).toLocaleDateString('en-US', {
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

  const renderPreview = () => {
    const data = parseContent(entry.content, entry.type);
    
    switch (entry.type) {
      case 'image':
        return (
          <View style={styles.contentRow}>
            {data?.images?.[0] && (
              <Image source={{ uri: data.images[0] }} style={styles.previewImage} resizeMode="cover" />
            )}
            <Text style={[styles.subtitle, { flex: 1, marginBottom: 0 }]} numberOfLines={1}>
              {data?.caption || 'Image entry'}
            </Text>
          </View>
        );
      case 'audio':
        const audioList = Array.isArray(data) ? data : [];
        return (
          <View style={styles.audioPreview}>
            <Ionicons name="musical-notes-outline" size={16} color="#2D5A1B" style={{ marginRight: 8 }} />
            <Text style={styles.audioCount}>
              {audioList.length} recording{audioList.length !== 1 ? 's' : ''}
            </Text>
          </View>
        );
      case 'doodle':
        return (
          <View style={styles.contentRow}>
            <Image source={{ uri: entry.content }} style={styles.previewImage} resizeMode="cover" />
            <Text style={styles.subtitle}>Doodle entry</Text>
          </View>
        );
      default:
        return (
          <Text style={styles.subtitle} numberOfLines={1}>
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>CAPSULE</Text>
        </View>

        <View style={styles.titleRow}>
          <Ionicons name="lock-closed" size={14} color="#B8860B" />
          <Text style={styles.title}>{entry?.title || "Untitled Entry"}</Text>
        </View>

        <Text style={styles.subtitle}>
          Opens {formattedUnlockDate} · Memory Capsule
        </Text>

        {renderPreview()}

        <View style={styles.tagsRow}>
          <View style={styles.lockedTag}>
            <Ionicons name="lock-closed" size={10} color="#7A5800" />
            <Text style={styles.lockedText}>Locked</Text>
          </View>
          <View style={styles.dateTag}>
            <Text style={styles.dateTagText}>{formattedCreatedAt}</Text>
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

export default CapsuleCard;
