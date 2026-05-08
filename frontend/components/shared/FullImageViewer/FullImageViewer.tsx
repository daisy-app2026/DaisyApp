import React, { useRef } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './FullImageViewer.styles';

interface FullImageViewerProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  currentIndex?: number;
  totalImages?: number;
}

const FullImageViewer: React.FC<FullImageViewerProps> = ({
  visible,
  imageUri,
  onClose,
  currentIndex,
  totalImages,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 80) {
          onClose();
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.95)" />
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color="white" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [{ translateY: pan.y }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </Animated.View>

        {totalImages && totalImages > 1 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {(currentIndex ?? 0) + 1} / {totalImages}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default FullImageViewer;
