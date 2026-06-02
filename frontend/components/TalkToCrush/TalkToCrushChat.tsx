import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  BackHandler,
  Keyboard,
  KeyboardEvent,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToCrushStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import {
  sendTalkToCrushMessage,
  getTalkToCrushSession,
  TalkToCrushMessage,
  TalkToCrushSession,
} from '../../services/talkToCrushService';
import { useTalkToCrushStore } from '../../store/talkToCrushStore';
import { styles } from './TalkToCrushChat.styles';
import { getPersonIcon } from '../../utils/personIcon';

const TypingIndicator: React.FC = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.aiBubble}>
      <Text style={styles.typingText}>
        typing{dots}
      </Text>
    </View>
  );
};

const TalkToCrushChat: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToCrushStackParamList>>();
  const route = useRoute<RouteProp<TalkToCrushStackParamList, 'TalkToCrushChat'>>();

  const { sessionId, crushName, initialMessages } = route.params;
  const name = crushName || 'My Crush';
  const { user } = useAuthStore();

  const personIcon = useMemo(() => getPersonIcon(name), [name]);

  const [currentSession, setCurrentSession] = useState<TalkToCrushSession | null>(null);
  const { updateSession, setPending } = useTalkToCrushStore();

  const [messages, setMessages] = useState<TalkToCrushMessage[]>(
    initialMessages || []
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const count = messages.filter((msg) => {
      if (!msg.isUser) return false;
      const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
      return msgDate === today;
    }).length;
    setDailyCount(count);
  }, [messages]);

  const remaining = Math.max(0, 5 - dailyCount);

  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        Animated.timing(keyboardHeight, {
          toValue: Platform.OS === 'android'
            ? e.endCoordinates.height + 24
            : e.endCoordinates.height,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const hideSubscription = Keyboard.addListener(
      hideEvent,
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  const loadCurrentSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await getTalkToCrushSession(sessionId);
      setCurrentSession(session);
      setMessages(session.messages || []);
    } catch (error) {
      console.log('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadCurrentSession();
  }, [loadCurrentSession]);

  const handleBack = useCallback(() => {
    navigation.replace('TalkToCrushHome');
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBack();
        return true;
      }
    );
    return () => backHandler.remove();
  }, [handleBack]);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });
    
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(255,255,255,0.92)',
          borderTopWidth: 1,
          paddingBottom: 16,
          paddingTop: 8,
          height: 72,
          elevation: 8,
          shadowColor: '#2D5A1B',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        }
      });
    };
  }, [navigation]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);
    setPending(sessionId, true);

    const tempUserMsg: TalkToCrushMessage = {
      id: `temp_${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    const typingMsg: TalkToCrushMessage = {
      id: 'typing',
      text: '...',
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const { userMessage, aiMessage } = await sendTalkToCrushMessage(
        sessionId,
        messageText
      );

      setPending(sessionId, false);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== 'typing' && m.id !== tempUserMsg.id),
        userMessage,
        aiMessage,
      ]);

      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages: [
            ...messages.filter((m) => m.id !== 'typing' && m.id !== tempUserMsg.id),
            userMessage,
            aiMessage,
          ],
          updatedAt: new Date().toISOString(),
        };
        setCurrentSession(updatedSession);
        
        setTimeout(() => {
          updateSession(updatedSession);
        }, 0);
      }
    } catch (error: any) {
      console.log('Send error:', error);
      setPending(sessionId, false);
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'));
      
      const errorCode = error?.response?.data?.error;
      if (errorCode === 'DAILY_LIMIT_REACHED') {
        setDailyCount(5);
        return;
      }
      
      Alert.alert('Error', en.talkToCrush.errors.sendMessage);
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, sessionId, currentSession, updateSession, setPending, messages]);

  const renderItem = useCallback(({ item }: { item: TalkToCrushMessage }) => {
    if (item.id === 'typing') {
      return <TypingIndicator />;
    }

    const bubbleStyle = item.isUser ? styles.userBubble : styles.aiBubble;
    const textStyle = item.isUser ? styles.userText : styles.aiText;

    return (
      <View style={bubbleStyle}>
        <Text style={textStyle}>{item.text}</Text>
      </View>
    );
  }, []);

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
        <View style={styles.headerOrb1} />
        <View style={styles.headerOrb2} />
        <SafeAreaView 
          edges={['top']}
          style={styles.topSafe}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color="#1A3A0F" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerCenter}>
              <View style={[
                styles.avatarCircle,
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
              <Text style={styles.personName}>{name}</Text>
            </View>
            <View style={styles.headerRight}>
              {remaining > 0 ? (
                <View style={styles.limitBadge}>
                  <Text style={styles.limitText}>
                    {remaining} left
                  </Text>
                </View>
              ) : (
                <View style={styles.limitBadgeEmpty}>
                  <Text style={styles.limitTextEmpty}>
                    No msgs left
                  </Text>
                </View>
              )}
            </View>
          </View>
  
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{en.talkToCrush.guidedReflection}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5A1B" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          inverted={true}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
        />
      )}

      <Animated.View
        style={[
          styles.inputArea,
          { marginBottom: keyboardHeight }
        ]}
      >
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={remaining === 0 ? "Daily limit reached..." : en.talkToCrush.inputPlaceholder}
          placeholderTextColor='#CCCCCC'
          multiline={true}
          underlineColorAndroid='transparent'
          editable={!isSending && remaining > 0}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: 
              inputText.trim() && remaining > 0
                ? '#2D5A1B'
                : 'rgba(45,90,27,0.15)'
            }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending || remaining === 0}
          activeOpacity={0.8}
        >
          <Ionicons
            name='arrow-forward'
            size={20}
            color={inputText.trim() && remaining > 0
              ? 'white' 
              : 'rgba(45,90,27,0.4)'
            }
          />
        </TouchableOpacity>
      </Animated.View>
      {remaining === 0 && (
        <SafeAreaView edges={['bottom']} style={styles.limitReached}>
          <Text style={styles.limitReachedText}>
            Daily limit reached. Come back tomorrow! 🌼
          </Text>
        </SafeAreaView>
      )}
    </View>
  );
};

export default TalkToCrushChat;
