import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './SpaceCircle.styles';

interface SpaceCircleProps {
  name: string;
  icon?: string;
  iconBg?: string;
  iconBgLight?: string;
  isAdd?: boolean;
  isSelected?: boolean;
  showDelete?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
}

const SpaceCircle: React.FC<SpaceCircleProps> = ({ 
  name, 
  icon = 'bookmark-outline',
  iconBg = '#2D5A1B',
  iconBgLight = 'rgba(45,90,27,0.15)',
  isAdd, 
  isSelected,
  showDelete, 
  onPress, 
  onLongPress, 
  onDelete 
}) => {
  const iconColor = isSelected ? '#B8860B' : '#2D5A1B';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.wrapper}
    >
      <View 
        style={[
          styles.outerCircle, 
          { backgroundColor: iconBgLight },
          isSelected && { 
            borderWidth: 2.5, 
            borderColor: iconBg,
          },
          isAdd && styles.createCircle,
          { shadowColor: iconBg }
        ]}
      >
        {showDelete && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={onDelete} 
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={12} color="white" />
          </TouchableOpacity>
        )}
        
        {isAdd ? (
          <Ionicons name="add" size={28} color="#2D5A1B" />
        ) : (
          <View 
            style={[
              styles.innerCircle, 
              { 
                backgroundColor: iconBg,
                shadowColor: iconBg,
              }
            ]}
          >
            <Ionicons 
              name={icon as any} 
              size={22} 
              color="#FFFFFF" 
            />
          </View>
        )}
      </View>
      <Text style={[styles.name, isAdd && { marginTop: 8 }]} numberOfLines={1}>
        {isAdd ? 'Create own' : name}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(SpaceCircle);
