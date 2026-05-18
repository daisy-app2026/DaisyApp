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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToPastStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import {
  sendTalkToPastMessage,
  getTalkToPastSession,
  TalkToPastMessage,
  TalkToPastSession,
} from '../../services/talkToPastService';
import { useTalkToPastStore } from '../../store/talkToPastStore';
import { styles } from './TalkToPastChat.styles';
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

const TalkToPastChat: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToPastStackParamList>>();
  const route = useRoute<RouteProp<TalkToPastStackParamList, 'TalkToPastChat'>>();

  const { sessionId, personName, initialMessages } = route.params;
  const name = personName || 'Someone';
  const { user } = useAuthStore();

  const personIcon = useMemo(() => getPersonIcon(name), [name]);

  const [currentSession, setCurrentSession] = useState<TalkToPastSession | null>(null);
  const { updateSession, setPending } = useTalkToPastStore();

  const [messages, setMessages] = useState<TalkToPastMessage[]>(
    initialMessages || []
  );
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
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
      const session = await getTalkToPastSession(sessionId);
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
    navigation.replace('TalkToPastHome');
  }, [navigation]);

  useEffect(() => {
    const backHandler = 
      BackHandler.addEventListener(
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
    setPendingMessage(messageText);
    setPending(sessionId, true);

    // Add user message immediately (optimistic update)
    const tempUserMsg: TalkToPastMessage = {
      id: `temp_${Date.now()}`,
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Show typing indicator
    const typingMsg: TalkToPastMessage = {
      id: 'typing',
      text: '...',
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      const { userMessage, aiMessage } = await sendTalkToPastMessage(
        sessionId,
        messageText
      );

      setPending(sessionId, false);
      setPendingMessage(null);

      // Replace temp and typing with real messages
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
        
        // Defer store update to next tick to avoid setState during render error
        setTimeout(() => {
          updateSession(updatedSession);
        }, 0);
      }
    } catch (error) {
      console.log('Send error:', error);
      setPending(sessionId, false);
      setPendingMessage(null);
      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== 'typing'));
      Alert.alert('Error', 'Could not send message. Try again!');
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, sessionId, currentSession, updateSession, setPending]);

  const renderItem = useCallback(({ item }: { item: TalkToPastMessage }) => {
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
      
      <SafeAreaView 
        edges={['top']}
        style={styles.topSafe}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#1A2E0F" />
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
          <View style={styles.headerRight} />
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{en.talkToPast.guidedReflection}</Text>
        </View>
      </SafeAreaView>

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

      {/* Input moves up with keyboard! */}
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
          placeholder="What are you thinking..."
          placeholderTextColor='#CCCCCC'
          multiline={true}
          underlineColorAndroid='transparent'
          editable={!isSending}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: 
              inputText.trim()
                ? '#2D5A1B'
                : 'rgba(45,90,27,0.15)'
            }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
          activeOpacity={0.8}
        >
          <Ionicons
            name='arrow-forward'
            size={20}
            color={inputText.trim() 
              ? 'white' 
              : 'rgba(45,90,27,0.4)'
            }
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default TalkToPastChat;
