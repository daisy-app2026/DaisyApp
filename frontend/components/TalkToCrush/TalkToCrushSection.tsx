import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToCrushStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import { createTalkToCrushSession, testConnection } from '../../services/talkToCrushService';
import { useTalkToCrushStore } from '../../store/talkToCrushStore';
import { styles } from './TalkToCrushSection.styles';

const TalkToCrushSection: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToCrushStackParamList>>();
  const route = useRoute<RouteProp<TalkToCrushStackParamList, 'TalkToCrushSection'>>();

  const { sectionNumber } = route.params;
  const { addSession } = useTalkToCrushStore();

  const scrollRef = useRef<ScrollView>(null);

  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>(() => {
    const existing = route.params.answers || {};
    return existing[`section${sectionNumber}`] || {};
  });

  const [crushName, setCrushName] = useState(route.params.crushName || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        animated: false
      });
    }, 100);
  }, [sectionNumber]);

  // Sync state if route params change
  useEffect(() => {
    const existing = route.params.answers || {};
    setCurrentAnswers(existing[`section${sectionNumber}`] || {});
    setCrushName(route.params.crushName || '');
  }, [route.params.answers, route.params.crushName, sectionNumber]);

  const handleBack = useCallback(() => {
    if (sectionNumber === 1) {
      navigation.navigate('TalkToCrushIntro');
    } else {
      navigation.navigate('TalkToCrushSection', {
        sectionNumber: (sectionNumber - 1) as 1 | 2 | 3,
        crushName,
        answers: route.params.answers,
      });
    }
  }, [navigation, sectionNumber, crushName, route.params.answers]);

  // Handle hardware back press on Android
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

  const isNextDisabled = useMemo(() => {
    if (sectionNumber === 1) {
      return (
        !currentAnswers.crushName?.trim() ||
        !currentAnswers.howMet?.trim() ||
        !currentAnswers.stage?.trim() ||
        !currentAnswers.attachmentStyle?.trim()
      );
    }
    if (sectionNumber === 2) {
      return (
        !currentAnswers.needHelp ||
        currentAnswers.needHelp.length === 0 ||
        !currentAnswers.currentVibe?.trim() ||
        !currentAnswers.biggestFear?.trim()
      );
    }
    if (sectionNumber === 3) {
      return (
        !currentAnswers.situation?.trim() ||
        !currentAnswers.wishSay?.trim() ||
        !currentAnswers.wantedOutcome?.trim()
      );
    }
    return true;
  }, [sectionNumber, currentAnswers]);

  const handleTextChange = useCallback((text: string, key: string) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [key]: text,
    }));
    if (key === 'crushName') {
      setCrushName(text);
    }
  }, []);

  const handleOptionPress = useCallback((key: string, option: string) => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [key]: option,
    }));
  }, []);

  const handleMultiOptionPress = useCallback((key: string, option: string) => {
    setCurrentAnswers((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(option)
        ? current.filter((o: string) => o !== option)
        : [...current, option];
      return {
        ...prev,
        [key]: updated,
      };
    });
  }, []);

  const handleFinish = async (allAnswers: Record<string, any>) => {
    try {
      setSaving(true);
      
      // Test connection first!
      console.log('Testing connection...')
      const isConnected = await testConnection()
      
      if (!isConnected) {
        Alert.alert(
          'Connection Error',
          'Cannot reach server. Check your connection!'
        )
        return
      }
      
      console.log('Connection OK! Creating session...')
      
      const finalCrushName = 
        allAnswers.section1?.crushName ||
        crushName ||
        'My Crush';
      
      console.log('Final answers:', allAnswers);
      console.log('Crush name:', finalCrushName);
      
      const session = await createTalkToCrushSession(
        finalCrushName,
        allAnswers
      );
      
      addSession(session);
      
      navigation.navigate('TalkToCrushChat', {
        sessionId: session.id,
        crushName: session.crushName,
        answers: session.answers,
        initialMessages: [],
      });
    } catch (error: any) {
      console.log('Error details:', error)
      console.log('Error message:', error?.message)
      console.log('Error response:', error?.response?.data)
      console.log('Error status:', error?.response?.status)
      
      Alert.alert(
        'Error Details',
        `Status: ${error?.response?.status || 'No response'}
Message: ${error?.message || 'Unknown'}
Data: ${JSON.stringify(error?.response?.data) || 'None'}`
      )
    } finally {
      setSaving(false);
    }
  };

  const handleContinue = useCallback(async () => {
    if (isNextDisabled || saving) return;

    const nextAnswers = {
      ...route.params.answers,
      [`section${sectionNumber}`]: currentAnswers,
    };

    if (sectionNumber < 3) {
      navigation.navigate('TalkToCrushSection', {
        sectionNumber: (sectionNumber + 1) as 1 | 2 | 3,
        crushName,
        answers: nextAnswers,
      });
    } else {
      await handleFinish(nextAnswers);
    }
  }, [navigation, sectionNumber, crushName, currentAnswers, route.params.answers, isNextDisabled, saving]);

  const renderStepper = useCallback(() => {
    const steps = [1, 2, 3];
    const labels = [
      en.talkToCrush.section1.title,
      en.talkToCrush.section2.title,
      en.talkToCrush.section3.title,
    ];
    return (
      <View style={styles.progressBarContainer}>
        {steps.map((step, idx) => {
          const isCompleted = sectionNumber > step;
          const isCurrent = sectionNumber === step;

          const pillStyle = isCompleted
            ? styles.stepPillCompleted
            : isCurrent
            ? styles.stepPillCurrent
            : styles.stepPillFuture;

          return (
            <View key={step} style={styles.stepCol}>
              <View style={[styles.stepPill, pillStyle]} />
              <View style={isCurrent ? styles.dotIndicatorContainer : { height: 6 }}>
                {isCurrent && <View style={styles.stepActiveDot} />}
              </View>
              <Text style={styles.stepLabel} numberOfLines={1}>
                {labels[idx]}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }, [sectionNumber]);

  const continueButtonStyle = useMemo(() => {
    if (isNextDisabled || saving) {
      return [styles.continueButton, styles.continueButtonDisabled];
    }
    return [styles.continueButton, styles.continueButtonActive];
  }, [isNextDisabled, saving]);

  // Section Headers
  const sectionMeta = useMemo(() => {
    if (sectionNumber === 1) {
      return {
        title: en.talkToCrush.section1.title,
        subtitle: en.talkToCrush.section1.subtitle,
        description: en.talkToCrush.section1.description,
        headers: en.talkToCrush.sectionHeaders['1of3'],
      };
    }
    if (sectionNumber === 2) {
      return {
        title: en.talkToCrush.section2.title,
        subtitle: en.talkToCrush.section2.subtitle,
        description: en.talkToCrush.section2.description,
        headers: en.talkToCrush.sectionHeaders['2of3'],
      };
    }
    return {
      title: en.talkToCrush.section3.title,
      subtitle: en.talkToCrush.section3.subtitle,
      description: en.talkToCrush.section3.description,
      headers: en.talkToCrush.sectionHeaders['3of3'],
    };
  }, [sectionNumber]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
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
            <Text style={styles.headerTitle}>{sectionMeta.title}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.stepText}>{sectionMeta.headers}</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderStepper()}

          <View style={styles.sectionHeaderCard}>
            <Text style={styles.sectionHeaderTitle}>
              {sectionMeta.title}
            </Text>
            <Text style={styles.sectionHeaderSubtitle}>
              {sectionMeta.subtitle}
            </Text>
          </View>

          <Text style={styles.descriptionText}>
            {sectionMeta.description}
          </Text>

          {/* Section 1 Render */}
          {sectionNumber === 1 && (
            <View>
              {/* Question 1 - Text */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section1.q1Label}</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 48 }]}
                  placeholder={en.talkToCrush.section1.q1Placeholder}
                  placeholderTextColor="#CCCCCC"
                  value={currentAnswers.crushName || ''}
                  onChangeText={(text) => handleTextChange(text, 'crushName')}
                  editable={!saving}
                />
              </View>

              {/* Question 2 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section1.q2Label}</Text>
                {en.talkToCrush.section1.q2Options.map((opt) => {
                  const isSel = currentAnswers.howMet === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('howMet', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Question 3 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section1.q3Label}</Text>
                {en.talkToCrush.section1.q3Options.map((opt) => {
                  const isSel = currentAnswers.stage === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('stage', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Question 4 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section1.q4Label}</Text>
                {en.talkToCrush.section1.q4Options.map((opt) => {
                  const isSel = currentAnswers.attachmentStyle === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('attachmentStyle', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Section 2 Render */}
          {sectionNumber === 2 && (
            <View>
              {/* Question 1 - Multiselect */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section2.q1Label}</Text>
                <Text style={styles.questionSublabel}>{en.talkToCrush.section2.q1Sublabel}</Text>
                {en.talkToCrush.section2.q1Options.map((opt) => {
                  const isSel = (currentAnswers.needHelp || []).includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleMultiOptionPress('needHelp', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Question 2 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section2.q2Label}</Text>
                {en.talkToCrush.section2.q2Options.map((opt) => {
                  const isSel = currentAnswers.currentVibe === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('currentVibe', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Question 3 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section2.q3Label}</Text>
                {en.talkToCrush.section2.q3Options.map((opt) => {
                  const isSel = currentAnswers.biggestFear === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('biggestFear', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Section 3 Render */}
          {sectionNumber === 3 && (
            <View>
              {/* Question 1 - Textarea */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section3.q1Label}</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 120 }]}
                  placeholder={en.talkToCrush.section3.q1Placeholder}
                  placeholderTextColor="#CCCCCC"
                  multiline
                  value={currentAnswers.situation || ''}
                  onChangeText={(text) => handleTextChange(text, 'situation')}
                  editable={!saving}
                />
              </View>

              {/* Question 2 - Text */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section3.q2Label}</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 48 }]}
                  placeholder={en.talkToCrush.section3.q2Placeholder}
                  placeholderTextColor="#CCCCCC"
                  value={currentAnswers.wishSay || ''}
                  onChangeText={(text) => handleTextChange(text, 'wishSay')}
                  editable={!saving}
                />
              </View>

              {/* Question 3 - Single Option */}
              <View style={styles.questionBlock}>
                <Text style={styles.questionLabel}>{en.talkToCrush.section3.q3Label}</Text>
                {en.talkToCrush.section3.q3Options.map((opt) => {
                  const isSel = currentAnswers.wantedOutcome === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.optionCard, isSel && styles.optionCardSelected]}
                      onPress={() => handleOptionPress('wantedOutcome', opt)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>
                        {opt}
                      </Text>
                      {isSel && <Ionicons name="checkmark-circle" size={18} color="#2D5A1B" />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={continueButtonStyle}
            onPress={handleContinue}
            disabled={isNextDisabled || saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>
                {sectionNumber === 3
                  ? en.talkToCrush.startChat
                  : en.talkToCrush.continue}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TalkToCrushSection;
