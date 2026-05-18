import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
import { TalkToPastStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import { createTalkToPastSession } from '../../services/talkToPastService';
import { useTalkToPastStore } from '../../store/talkToPastStore';
import { styles } from './TalkToPastSection.styles';

const sections = [
  {
    number: 1,
    title: 'About Them',
    subtitle: 'Stay close to what you truly experienced.',
    description: 'Describe the person the contact ended with.',
    questions: [
      'Who were they in your life?',
      'What stood out about them — both good and difficult?',
      'How did they usually make you feel?',
      'Who were you when you were with them?',
    ],
    placeholders: [
      'My ex-boyfriend of 2 years...',
      'He was funny but also unpredictable...',
      'Anxious, but also loved...',
      'I felt like I was always the caretaker...',
    ],
    buttonText: 'Continue →',
    nextSection: 2 as const,
  },
  {
    number: 2,
    title: 'How It Ended',
    subtitle: 'No need to judge, just notice.',
    description: 'Take a moment to revisit the ending.',
    questions: [
      'Who ended the relationship or contact?',
      'What did they say or do?',
      'What did you say or do?',
      'What did you feel inside at the time?',
      'How did you cope?',
      'What helped you through it?',
      'What made it harder?',
    ],
    placeholders: [
      'They did, suddenly...',
      'They stopped responding...',
      'I tried to reach out...',
      'Sad, angry, helpless...',
      'I talked to friends...',
      'Time and journaling...',
      'The silence was hard...',
    ],
    buttonText: 'Continue →',
    nextSection: 3 as const,
  },
  {
    number: 3,
    title: 'What I Never Said',
    subtitle: 'Speak to them directly. Use "you."',
    description: null,
    prompts: [
      '"Something I should have told you is..."',
      '"I appreciated you for..."',
      '"I was hurt when..."',
      '"I wish I had said..."',
    ],
    questions: [
      'Write what you never got to say...',
    ],
    placeholders: [
      'I appreciated you for making me laugh even on dark days...',
    ],
    buttonText: 'Continue →',
    nextSection: 4 as const,
  },
  {
    number: 4,
    title: 'Imagine the Meeting',
    subtitle: 'A gentle "what-if" to explore your feelings today.',
    description: 'Play pretend.',
    questions: [
      'Where would you meet?',
      'What would you wear?',
      'What would you order? What might they order?',
      'What would you ask them?',
      'Based on what you know about them, what do you think they would say?',
    ],
    placeholders: [
      'A quiet café we used to go to...',
      'Something comfortable, like myself...',
      'Coffee. They would order tea...',
      'How are you? Are you happy?',
      'I think they would say they are sorry...',
    ],
    buttonText: 'Start Conversation →',
    nextSection: null,
  },
];

const TalkToPastSection: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToPastStackParamList>>();
  const route = useRoute<RouteProp<TalkToPastStackParamList, 'TalkToPastSection'>>();

  const { sectionNumber } = route.params;
  const { user } = useAuthStore();
  const { addSession } = useTalkToPastStore();

  const [answers, setAnswers] = useState<Record<string, string>>(
    route.params.answers || {}
  );

  const [personName, setPersonName] = useState(
    route.params.personName || ''
  );

  const [saving, setSaving] = useState(false);

  // Sync state if route params change
  useEffect(() => {
    if (route.params.answers) {
      setAnswers(route.params.answers);
    }
    if (route.params.personName) {
      setPersonName(route.params.personName);
    }
  }, [route.params.answers, route.params.personName]);

  const currentSection = useMemo(() => {
    return sections[sectionNumber - 1];
  }, [sectionNumber]);

  const handleBack = () => {
    const { sectionNumber } = route.params

    if (sectionNumber === 1) {
      navigation.navigate('TalkToPastIntro')
    } else {
      navigation.navigate(
        'TalkToPastSection',
        {
          sectionNumber: 
            (sectionNumber - 1) as 1|2|3|4,
          personName: route.params.personName,
          answers: route.params.answers
        }
      )
    }
  }

  // Handle hardware back press on Android
  useEffect(() => {
    const backHandler = 
      BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBack()
          return true
        }
      )
    return () => backHandler.remove()
  }, [sectionNumber])

  const isNextDisabled = useMemo(() => {
    return currentSection.questions.every((_, index) => {
      const key = `q_${sectionNumber}_${index}`;
      return !answers[key]?.trim();
    });
  }, [sectionNumber, currentSection, answers]);

  const handleTextChange = useCallback((text: string, index: number) => {
    const key = `q_${sectionNumber}_${index}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: text,
    }));
    if (sectionNumber === 1 && index === 0) {
      setPersonName(text);
    }
  }, [sectionNumber]);

  const bundleAnswers = useCallback(() => {
    const sectionsData: Record<string, Record<string, string>> = {};
    for (let s = 1; s <= 4; s++) {
      const sectionQuestions = sections[s - 1].questions;
      const sectionObj: Record<string, string> = {};
      sectionQuestions.forEach((_, index) => {
        sectionObj[`q${index + 1}`] = answers[`q_${s}_${index}`] || '';
      });
      sectionsData[`section${s}`] = sectionObj;
    }
    return sectionsData;
  }, [answers]);

  const handleContinue = useCallback(async () => {
    if (isNextDisabled || saving) return;

    if (currentSection.nextSection) {
      navigation.navigate('TalkToPastSection', {
        sectionNumber: currentSection.nextSection as 1 | 2 | 3 | 4,
        personName,
        answers,
      });
    } else {
      try {
        setSaving(true);
        const allAnswers = bundleAnswers();
        const pName = allAnswers.section1?.q1 || 'Someone';

        const session = await createTalkToPastSession(
          pName,
          allAnswers
        );

        addSession(session);

        navigation.navigate('TalkToPastChat', {
          sessionId: session.id,
          personName: session.personName,
          answers: session.answers,
          initialMessages: [],
        });
      } catch (error) {
        console.log('Create session error:', error);
        Alert.alert('Error', 'Could not start session. Try again!');
      } finally {
        setSaving(false);
      }
    }
  }, [navigation, currentSection, personName, answers, isNextDisabled, saving, user, bundleAnswers, addSession]);

  const renderStepper = useCallback(() => {
    const steps = [1, 2, 3, 4];
    const labels = ['About Them', 'How It Ended', 'Never Said', 'Imagine'];
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
              <View style={dotIndicatorContainerStyle(isCurrent)}>
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

  const dotIndicatorContainerStyle = (isCurrent: boolean) => {
    return isCurrent ? styles.dotIndicatorContainer : { height: 6 };
  };

  const continueButtonStyle = useMemo(() => {
    if (isNextDisabled || saving) {
      return [styles.continueButton, styles.continueButtonDisabled];
    }
    return [styles.continueButton, styles.continueButtonActive];
  }, [isNextDisabled, saving]);

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
            <Text style={styles.headerTitle}>{currentSection.title}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.stepText}>
              {sectionNumber} {en.talkToPast.of} 4
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {renderStepper()}

          <View style={styles.sectionHeaderCard}>
            <Text style={styles.sectionHeaderTitle}>
              Section {sectionNumber} — {currentSection.title}
            </Text>
            <Text style={styles.sectionHeaderSubtitle}>
              {currentSection.subtitle}
            </Text>
          </View>

          {currentSection.description && (
            <Text style={styles.descriptionText}>
              {currentSection.description}
            </Text>
          )}

          {sectionNumber === 3 && currentSection.prompts && (
            <View style={styles.promptsContainer}>
              <Text style={styles.promptsTitle}>PROMPTS TO GUIDE YOU:</Text>
              {currentSection.prompts.map((prompt, idx) => (
                <Text key={idx} style={styles.promptText}>
                  {prompt}
                </Text>
              ))}
            </View>
          )}

          {currentSection.questions.map((question, index) => {
            const isSection1Q1 = sectionNumber === 1 && index === 0;
            const questionLabel = isSection1Q1
              ? 'Their name or what you called them'
              : question;

            const key = `q_${sectionNumber}_${index}`;
            const value = answers[key] || '';

            const inputMinHeight = sectionNumber === 3 ? 120 : 48;

            return (
              <View key={index} style={styles.questionBlock}>
                <Text style={styles.questionLabel}>
                  Q{index + 1} {questionLabel}
                </Text>
                <TextInput
                  style={[styles.textInput, { minHeight: inputMinHeight }]}
                  placeholder={currentSection.placeholders[index]}
                  placeholderTextColor="#CCCCCC"
                  multiline
                  underlineColorAndroid="transparent"
                  value={value}
                  onChangeText={(text) => handleTextChange(text, index)}
                  editable={!saving}
                />
              </View>
            );
          })}

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
                {sectionNumber === 4
                  ? en.talkToPast.startConversation
                  : en.talkToPast.continue}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TalkToPastSection;
