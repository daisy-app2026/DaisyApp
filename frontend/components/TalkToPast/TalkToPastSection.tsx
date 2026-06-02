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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToPastStackParamList } from '../../navigation/types';
import { useLanguageStore } from '../../store/languageStore';
import { useAuthStore } from '../../store/authStore';
import { createTalkToPastSession } from '../../services/talkToPastService';
import { useTalkToPastStore } from '../../store/talkToPastStore';
import { styles } from './TalkToPastSection.styles';

const section1Q3Options = [
  '😰 Anxious', '😡 Angry', '😕 Confused',
  '🥰 Loved', '😔 Sad', '🤯 Overwhelmed',
  '😌 Safe', '🫤 Unseen', '💔 Hurt',
  '😤 Frustrated', '🌪️ Chaotic', '🥺 Small'
];

const section2Q1Options = [
  'They ended it',
  'I ended it',
  'It was mutual',
  'It just faded away',
  'They passed away',
  'We lost touch'
];

const section2Q4Options = [
  '😢 Sad', '😡 Angry', '😶 Numb',
  '😰 Helpless', '💔 Heartbroken',
  '😮 Shocked', '😌 Relieved',
  '😤 Frustrated', '🫤 Empty',
  '😣 Lost', '😪 Exhausted'
];

const section4Q1Options = [
  '☕ A quiet café',
  '🌳 A peaceful park',
  '🏠 Somewhere we used to go',
  '🌙 A place from our memories',
  '✍️ Write your own...'
];

interface SingleSelectProps {
  options: string[];
  selected: string | undefined;
  onChange: (value: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  selected,
  onChange,
}) => (
  <View>
    {options.map((option) => {
      const isSelected = selected === option;
      return (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            isSelected && styles.optionButtonSelected
          ]}
          onPress={() => onChange(option)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.optionText,
            isSelected && styles.optionTextSelected
          ]}>
            {option}
          </Text>
          {isSelected && (
            <Ionicons
              name='checkmark-circle'
              size={18}
              color='#2D5A1B'
              style={styles.checkIcon}
            />
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

interface MultiSelectProps {
  options: string[];
  selected: string[] | undefined;
  onChange: (value: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
}) => (
  <View style={styles.optionsGrid}>
    {options.map((option) => {
      const isSelected = selected?.includes(option);
      return (
        <TouchableOpacity
          key={option}
          style={[
            styles.gridOption,
            isSelected && styles.gridOptionSelected
          ]}
          onPress={() => {
            if (isSelected) {
              onChange((selected || []).filter(s => s !== option));
            } else {
              onChange([...(selected || []), option]);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.gridOptionText,
            isSelected && styles.gridOptionTextSelected
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

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
      'They said we wanted different things...',
      'I cried and begged them not to go...',
      'Shocked and abandoned...',
      'I talked to friends and focused on work...',
      'Grieving fully when needed...',
      'The silence was hard...',
    ],
    buttonText: 'Continue →',
    nextSection: 3 as const,
  },
  {
    number: 3,
    title: 'What Was Left Unsaid',
    subtitle: 'This space holds what has never been shared.',
    description: 'Tell them what you never got to say.',
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
  const { t: en } = useLanguageStore();
  const route = useRoute<RouteProp<TalkToPastStackParamList, 'TalkToPastSection'>>();

  const { sectionNumber } = route.params;
  const { user } = useAuthStore();
  const { addSession, setHasCreatedSession } = useTalkToPastStore();

  const scrollRef = useRef<ScrollView>(null);

  const [answers, setAnswers] = useState<Record<string, any>>(
    route.params.answers || {}
  );

  const [personName, setPersonName] = useState(
    route.params.personName || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Scroll to top when section changes!
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

  const handleTextChange = useCallback((text: string, index: number) => {
    const key = `q_${sectionNumber}_${index}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: text,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
    if (sectionNumber === 1 && index === 0) {
      setPersonName(text);
    }
  }, [sectionNumber]);

  const handleExtraTextChange = useCallback((key: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: text,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  }, []);

  const handleSelectChange = useCallback((key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  }, []);

  const handlePromptTap = (promptText: string) => {
    const key = 'q_3_0';
    setAnswers((prev) => {
      const currentVal = prev[key] || '';
      const newVal = currentVal + (currentVal ? '\n' : '') + promptText;
      return {
        ...prev,
        [key]: newVal,
      };
    });
    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  };

  const bundleAnswers = useCallback(() => {
    const sectionsData: Record<string, Record<string, string>> = {};
    for (let s = 1; s <= 4; s++) {
      const sectionQuestions = sections[s - 1].questions;
      const sectionObj: Record<string, string> = {};
      sectionQuestions.forEach((_, index) => {
        const key = `q_${s}_${index}`;
        const val = answers[key];
        let valStr = Array.isArray(val) ? val.join(', ') : (val || '');
        
        if (s === 1 && index === 2) {
          const extraVal = answers[`${key}_extra`];
          if (extraVal?.trim()) {
            valStr += (valStr ? '. ' : '') + 'Extra notes: ' + extraVal;
          }
        }
        
        if (s === 2 && index === 3) {
          const extraVal = answers[`${key}_extra`];
          if (extraVal?.trim()) {
            valStr += (valStr ? '. ' : '') + 'Extra notes: ' + extraVal;
          }
        }
        
        if (s === 4 && index === 0) {
          if (val === '✍️ Write your own...') {
            valStr = answers[`${key}_custom`] || '';
          }
        }

        sectionObj[`q${index + 1}`] = valStr;
      });
      sectionsData[`section${s}`] = sectionObj;
    }
    return sectionsData;
  }, [answers]);

  const handleContinue = useCallback(async () => {
    if (saving) return;

    const newErrors: Record<string, string> = {};
    
    if (sectionNumber === 1) {
      if (!answers.q_1_0?.trim()) {
        newErrors.q_1_0 = en.talkToPast.errors.nameRequired;
      }
    }
    
    if (sectionNumber === 2) {
      if (!answers.q_2_0) {
        newErrors.q_2_0 = en.talkToPast.errors.whoEndedRequired;
      }
      const q2q4 = answers.q_2_3;
      if (!q2q4 || q2q4.length === 0) {
        newErrors.q_2_3 = en.talkToPast.errors.feelingRequired;
      }
    }
    
    if (sectionNumber === 3) {
      const q3q1 = answers.q_3_0;
      if (!q3q1?.trim() || q3q1.trim().length < 10) {
        newErrors.q_3_0 = en.talkToPast.errors.whatNeverSaidRequired;
      }
    }
    
    if (sectionNumber === 4) {
      if (!answers.q_4_3?.trim()) {
        newErrors.q_4_3 = en.talkToPast.errors.whatWouldAskRequired;
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

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
        setHasCreatedSession(true);

        navigation.navigate('TalkToPastChat', {
          sessionId: session.id,
          personName: session.personName,
          answers: session.answers,
          initialMessages: [],
        });
      } catch (error: any) {
        console.log('Create session error:', error);
        if (error?.response?.data?.error === 'CHAT_LIMIT_REACHED') {
          Alert.alert(
            'Limit Reached',
            'You can only have 2 chats. Delete one to create a new one.'
          );
          return;
        }
        Alert.alert('Error', 'Could not start session. Try again!');
      } finally {
        setSaving(false);
      }
    }
  }, [navigation, currentSection, personName, answers, saving, bundleAnswers, addSession, sectionNumber]);

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
    if (saving) {
      return [styles.continueButton, styles.continueButtonDisabled];
    }
    return [styles.continueButton, styles.continueButtonActive];
  }, [saving]);

  const renderQuestionBlock = (question: string, index: number) => {
    const key = `q_${sectionNumber}_${index}`;
    const value = answers[key];
    const error = errors[key];
    
    // Determine mandatory fields
    const isSection1Q1 = sectionNumber === 1 && index === 0;
    const isSection2Q1 = sectionNumber === 2 && index === 0;
    const isSection2Q4 = sectionNumber === 2 && index === 3;
    const isSection3Q1 = sectionNumber === 3 && index === 0;
    const isSection4Q4 = sectionNumber === 4 && index === 3;
    
    const isMandatory = isSection1Q1 || isSection2Q1 || isSection2Q4 || isSection3Q1 || isSection4Q4;
    
    const label = isSection1Q1 
      ? 'Their name or what you called them' 
      : question;
      
    const placeholder = currentSection.placeholders[index];

    let customInput = null;

    if (sectionNumber === 1) {
      if (index === 2) {
        // Section 1 Q3: Multi-Select + Optional text input
        const selectedList = Array.isArray(value) ? value : [];
        const extraKey = `${key}_extra`;
        const extraValue = answers[extraKey] || '';
        
        customInput = (
          <View>
            <MultiSelect
              options={section1Q3Options}
              selected={selectedList}
              onChange={(vals) => handleSelectChange(key, vals)}
            />
            <TextInput
              style={[styles.textInput, { minHeight: 48, marginTop: 8 }]}
              placeholder="Anything else? (optional)"
              placeholderTextColor="#CCCCCC"
              underlineColorAndroid="transparent"
              value={extraValue}
              onChangeText={(text) => handleExtraTextChange(extraKey, text)}
              editable={!saving}
            />
          </View>
        );
      }
    } else if (sectionNumber === 2) {
      if (index === 0) {
        // Section 2 Q1: Single-Select
        customInput = (
          <SingleSelect
            options={section2Q1Options}
            selected={typeof value === 'string' ? value : undefined}
            onChange={(val) => handleSelectChange(key, val)}
          />
        );
      } else if (index === 3) {
        // Section 2 Q4: Multi-Select + Optional text input
        const selectedList = Array.isArray(value) ? value : [];
        const extraKey = `${key}_extra`;
        const extraValue = answers[extraKey] || '';
        
        customInput = (
          <View>
            <MultiSelect
              options={section2Q4Options}
              selected={selectedList}
              onChange={(vals) => handleSelectChange(key, vals)}
            />
            <TextInput
              style={[styles.textInput, { minHeight: 48, marginTop: 8 }]}
              placeholder="Add more..."
              placeholderTextColor="#CCCCCC"
              underlineColorAndroid="transparent"
              value={extraValue}
              onChangeText={(text) => handleExtraTextChange(extraKey, text)}
              editable={!saving}
            />
          </View>
        );
      }
    } else if (sectionNumber === 3) {
      if (index === 0) {
        // Section 3 Q1: Prompts + Large Text area
        const promptChips = [
          "Something I should have told you is...",
          "I appreciated you for...",
          "I was hurt when...",
          "I wish I had said...",
          "What I never told you is...",
          "I forgive you for..."
        ];
        
        customInput = (
          <View>
            <Text style={[styles.promptsTitle, { marginBottom: 8 }]}>PROMPTS TO INSPIRE YOU:</Text>
            <View style={styles.promptsContainer}>
              {promptChips.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.promptChip}
                  onPress={() => handlePromptTap(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.textInput, error ? styles.errorInput : null, { minHeight: 120 }]}
              placeholder={placeholder}
              placeholderTextColor="#CCCCCC"
              multiline
              underlineColorAndroid="transparent"
              value={typeof value === 'string' ? value : ''}
              onChangeText={(text) => handleTextChange(text, index)}
              editable={!saving}
            />
          </View>
        );
      }
    } else if (sectionNumber === 4) {
      if (index === 0) {
        // Section 4 Q1: Single-Select + Write your own
        const isCustomSelected = value === '✍️ Write your own...';
        const customKey = `${key}_custom`;
        const customValue = answers[customKey] || '';
        
        customInput = (
          <View>
            <SingleSelect
              options={section4Q1Options}
              selected={typeof value === 'string' ? value : undefined}
              onChange={(val) => handleSelectChange(key, val)}
            />
            {isCustomSelected && (
              <TextInput
                style={[styles.textInput, { minHeight: 48, marginTop: 8 }]}
                placeholder="Write your own meeting place..."
                placeholderTextColor="#CCCCCC"
                underlineColorAndroid="transparent"
                value={customValue}
                onChangeText={(text) => handleExtraTextChange(customKey, text)}
                editable={!saving}
              />
            )}
          </View>
        );
      }
    }

    if (!customInput) {
      // Default Text Input
      customInput = (
        <TextInput
          style={[styles.textInput, error ? styles.errorInput : null, { minHeight: 48 }]}
          placeholder={placeholder}
          placeholderTextColor="#CCCCCC"
          multiline
          underlineColorAndroid="transparent"
          value={typeof value === 'string' ? value : ''}
          onChangeText={(text) => handleTextChange(text, index)}
          editable={!saving}
        />
      );
    }

    return (
      <View key={index} style={styles.questionBlock}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionLabel}>
            Q{index + 1} {label}
          </Text>
          {isMandatory && (
            <Text style={styles.mandatoryBadge}>*</Text>
          )}
        </View>
        
        {customInput}
        
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name='alert-circle-outline'
              size={13}
              color='#E85555'
            />
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

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
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
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
              <Text style={styles.headerTitle}>{currentSection.title}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.stepText}>
                {sectionNumber} {en.talkToPast.of} 4
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
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

          {currentSection.questions.map((question, index) => renderQuestionBlock(question, index))}

          <TouchableOpacity
            style={continueButtonStyle}
            onPress={handleContinue}
            disabled={saving}
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
