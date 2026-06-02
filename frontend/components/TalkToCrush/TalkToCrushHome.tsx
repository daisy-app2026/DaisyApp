import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToCrushStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import { getTalkToCrushSessions, deleteTalkToCrushSession, TalkToCrushSession } from '../../services/talkToCrushService';
import { useTalkToCrushStore } from '../../store/talkToCrushStore';
import { styles } from './TalkToCrushHome.styles';
import { getPersonIcon } from '../../utils/personIcon';
import { LinearGradient } from 'expo-linear-gradient';

const TalkToCrushHome: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToCrushStackParamList>>();
  const { user } = useAuthStore();

  const {
    sessions,
    isLoaded,
    setSessions,
    deleteSession: removeFromStore,
  } = useTalkToCrushStore();

  const [loading, setLoading] = useState(!isLoaded);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadSessions = async () => {
    try {
      if (!isLoaded) {
        setLoading(true);
      }
      const data = await getTalkToCrushSessions();
      setSessions(data || []);
    } catch (error) {
      console.log('Sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [isLoaded])
  );

  const handleProfilePress = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'DiaryTab',
        params: {
          screen: 'Profile',
        },
      })
    );
  }, [navigation]);

  const handleStartNew = useCallback(() => {
    navigation.navigate('TalkToCrushIntro');
  }, [navigation]);

  const handleCardPress = (session: TalkToCrushSession) => {
    navigation.navigate('TalkToCrushChat', {
      sessionId: session.id,
      crushName: session.crushName,
      answers: session.answers,
      initialMessages: session.messages,
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleting(true);
      await deleteTalkToCrushSession(deleteConfirmId);
      removeFromStore(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (error) {
      Alert.alert('Error', en.talkToCrush.errors.deleteSession);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#2D5A1B" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
        {/* Curved highlight orb 1 */}
        <View style={styles.headerOrb1} />
        
        {/* Curved highlight orb 2 */}
        <View style={styles.headerOrb2} />
        
        {/* Actual header content */}
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{en.talkToCrush.homeTitle}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.profileBtn}
                onPress={handleProfilePress}
                activeOpacity={0.8}
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileInitial}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={52} color="rgba(45,90,27,0.25)" />
          <Text style={styles.emptyTitle}>{en.talkToCrush.noChats}</Text>
          <Text style={styles.emptySubtitle}>{en.talkToCrush.noChatsSubtitle}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.pastReflectionsSection}>
            {sessions.map((session) => {
              const formattedDate = new Date(session.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              const personIcon = getPersonIcon(session.crushName);

              return (
                <TouchableOpacity
                  key={session.id}
                  style={styles.sessionCard}
                  onPress={() => handleCardPress(session)}
                  onLongPress={() => setDeleteConfirmId(session.id)}
                  delayLongPress={500}
                  activeOpacity={0.8}
                >
                  {/* Avatar */}
                  <View style={[
                    styles.avatar,
                    { 
                      backgroundColor: personIcon.bgColor,
                      borderColor: personIcon.color + '33',
                    }
                  ]}>
                    <Ionicons
                      name={personIcon.icon as any}
                      size={22}
                      color={personIcon.color}
                    />
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <Text style={styles.personName}>{session.crushName}</Text>
                    </View>

                    {/* Last Message Preview */}
                    {session.messages && session.messages.length > 0 && (
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {session.messages[session.messages.length - 1]?.text || ''}
                      </Text>
                    )}

                    {/* Date */}
                    <Text style={styles.date}>{formattedDate}</Text>
                  </View>

                  {/* Arrow */}
                  <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.bottomLabel}>
            {sessions.length >= 2 
              ? "Chat limit reached (2/2). Delete a chat to start a new one." 
              : `Chat count: ${sessions.length}/2 • ${en.talkToCrush.eachFresh}`
            }
          </Text>
        </ScrollView>
      )}

      <TouchableOpacity
        style={[
          styles.plusButton,
          sessions.length >= 2 && styles.plusButtonDisabled
        ]}
        onPress={handleStartNew}
        disabled={sessions.length >= 2}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal visible={!!deleteConfirmId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{en.talkToCrush.deleteModal.title}</Text>
            <Text style={styles.modalMessage}>{en.talkToCrush.deleteModal.message}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteConfirmId(null)}
              >
                <Text style={styles.cancelText}>{en.talkToCrush.deleteModal.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.confirmText}>{en.talkToCrush.deleteModal.confirm}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TalkToCrushHome;
