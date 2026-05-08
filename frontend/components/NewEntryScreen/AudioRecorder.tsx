import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AudioRecorder.styles';

interface AudioRecorderProps {
  onAudiosChange: (recordings: { uri: string; duration: number; id: string }[]) => void;
  existingAudios?: { uri: string; duration: number; id: string }[];
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudiosChange, existingAudios }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{
    uri: string;
    duration: number;
    id: string;
  }[]>([]);

  useEffect(() => {
    if (existingAudios?.length) {
      setRecordings(existingAudios);
    }
  }, []);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation for recording button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      pulseAnim.setValue(1);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimer(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    onAudiosChange(recordings);
  }, [recordings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();

      if (uri) {
        setRecordings((prev) => [
          ...prev,
          {
            uri,
            duration: Math.floor((status.durationMillis || 0) / 1000),
            id: Date.now().toString(),
          },
        ]);
      }
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
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
      console.error('Failed to play audio', err);
      Alert.alert('Error', 'Could not play audio.');
    }
  };

  const removeRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    if (playingId === id && sound) {
      sound.unloadAsync();
      setSound(null);
      setPlayingId(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.recorderContent}>
      <View style={styles.recordButtonContainer}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.recordButtonText, isRecording && styles.recordingButtonText]}>
          {isRecording ? 'Recording... tap to stop' : 'Tap to record'}
        </Text>
      </View>

      {isRecording && (
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
      )}

      <View style={styles.recordingsList}>
        {recordings.map((rec, index) => (
          <View key={rec.id} style={styles.recordingCard}>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={() => playAudio(rec.uri, rec.id)}
            >
              <Ionicons
                name={playingId === rec.id ? 'pause' : 'play'}
                size={18}
                color="#2D5A1B"
              />
            </TouchableOpacity>

            <View style={styles.recordingInfo}>
              <Text style={styles.recordingName}>Audio {index + 1}</Text>
              <Text style={styles.recordingDuration}>{formatTime(rec.duration)}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeRecording(rec.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#E85555" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AudioRecorder;
