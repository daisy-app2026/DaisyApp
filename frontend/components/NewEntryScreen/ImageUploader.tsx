import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ImageUploader.styles';
import CustomModal from '../shared/CustomModal/CustomModal';
import FullImageViewer from '../shared/FullImageViewer/FullImageViewer';

interface ImageUploaderProps {
  onImagesChange: (imageUrls: string[], caption: string) => void;
  existingImages?: string[];
  existingCaption?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesChange,
  existingImages,
  existingCaption
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');

  // Full Image Viewer States
  const [selectedImage, setSelectedImage] = useState('');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Formatting state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Modal state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    if (existingImages?.length) {
      setImages(existingImages);
    }
    if (existingCaption) {
      setCaption(existingCaption);
    }
  }, []);

  useEffect(() => {
    onImagesChange(images, caption);
  }, [images, caption]);

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      showAlert('Maximum 5 images allowed!', 'You can upload up to 5 images per entry.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission Denied', 'We need access to your gallery to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const applyFormatting = (type: 'bold' | 'italic' | 'underline' | 'strike') => {
    let tag = '';
    switch (type) {
      case 'bold': tag = '**'; break;
      case 'italic': tag = '*'; break;
      case 'underline': tag = '__'; break;
      case 'strike': tag = '~~'; break;
    }

    const { start, end } = selection;
    if (start !== end) {
      const selectedText = caption.substring(start, end);
      const beforeText = caption.substring(0, start);
      const afterText = caption.substring(end);
      setCaption(`${beforeText}${tag}${selectedText}${tag}${afterText}`);
    }

    if (type === 'bold') setIsBold(!isBold);
    if (type === 'italic') setIsItalic(!isItalic);
    if (type === 'underline') setIsUnderline(!isUnderline);
    if (type === 'strike') setIsStrike(!isStrike);
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbarContainer}>
        <TouchableOpacity style={[styles.toolbarButton, isBold && styles.activeToolbarButton]} onPress={() => applyFormatting('bold')}>
          <Text style={styles.boldIcon}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarButton, isItalic && styles.activeToolbarButton]} onPress={() => applyFormatting('italic')}>
          <Text style={styles.italicIcon}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarButton, isUnderline && styles.activeToolbarButton]} onPress={() => applyFormatting('underline')}>
          <Text style={styles.underlineIcon}>U</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarButton, isStrike && styles.activeToolbarButton]} onPress={() => applyFormatting('strike')}>
          <Text style={styles.strikeIcon}>S</Text>
        </TouchableOpacity>

        <View style={styles.toolbarDivider} />

        <TouchableOpacity style={[styles.toolbarButton, alignment === 'left' && styles.activeToolbarButton]} onPress={() => setAlignment('left')}>
          <Ionicons name="reorder-three-outline" size={20} color="#1A2E0F" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarButton, alignment === 'center' && styles.activeToolbarButton]} onPress={() => setAlignment('center')}>
          <Ionicons name="reorder-two-outline" size={20} color="#1A2E0F" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarButton, alignment === 'right' && styles.activeToolbarButton]} onPress={() => setAlignment('right')}>
          <Ionicons name="menu-outline" size={20} color="#1A2E0F" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {images.length < 5 && (
        <TouchableOpacity style={styles.addButton} onPress={pickImage} activeOpacity={0.7}>
          <Ionicons
            name="image-outline"
            size={32}
            color="rgba(45,90,27,0.4)"
          />
          <Text style={styles.addButtonText}>Add Image ({images.length}/5)</Text>
        </TouchableOpacity>
      )}

      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.imageWrapper}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setSelectedImage(uri);
                setSelectedImageIndex(index);
                setShowImageViewer(true);
              }}
            >
              <Image source={{ uri }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeImage(index)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TextInput
        style={[
          styles.captionInput,
          isBold && { fontWeight: 'bold' },
          isItalic && { fontStyle: 'italic' },
          isUnderline && { textDecorationLine: 'underline' },
          isStrike && { textDecorationLine: isUnderline ? 'underline line-through' : 'line-through' },
          { textAlign: alignment }
        ]}
        multiline
        placeholder="Write something about these images... (optional)"
        placeholderTextColor="#888888"
        underlineColorAndroid='transparent'
        value={caption}
        onChangeText={setCaption}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
      />

      {renderToolbar()}

      <CustomModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type="alert"
        onConfirm={() => setAlertConfig({ ...alertConfig, visible: false })}
        confirmText="OK"
      />

      <FullImageViewer
        visible={showImageViewer}
        imageUri={selectedImage}
        currentIndex={selectedImageIndex}
        totalImages={images.length}
        onClose={() => setShowImageViewer(false)}
      />
    </ScrollView>
  );
};

export default ImageUploader;
