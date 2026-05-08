import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './CapsuleNotification.styles';
import { Entry } from '../../../services/entryService';

interface CapsuleNotificationProps {
  capsules: Entry[];
  onDismiss: (entryId: string) => void;
  onView: (entry: Entry) => void;
}

const CapsuleNotification: React.FC<CapsuleNotificationProps> = ({ 
  capsules, 
  onDismiss, 
  onView 
}) => {
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const currentCapsule = capsules[0];

  useEffect(() => {
    if (currentCapsule) {
      // Slide Down
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Auto Dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentCapsule]);

  const handleDismiss = () => {
    // Slide Up
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(currentCapsule.id);
    });
  };

  if (!currentCapsule) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open" size={24} color="#7A5800" />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>Capsule Unlocked! 🌼</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentCapsule.title || 'Untitled Space'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => onView(currentCapsule)}
          >
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleDismiss}
          >
            <Ionicons name="close" size={18} color="#7A5800" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default CapsuleNotification;
