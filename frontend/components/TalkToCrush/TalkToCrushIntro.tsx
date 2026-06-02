import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TalkToCrushStackParamList } from '../../navigation/types';
import en from '../../locales/en.json';
import { useAuthStore } from '../../store/authStore';
import { styles } from './TalkToCrushIntro.styles';
import { styles as homeStyles } from './TalkToCrushHome.styles';

const TalkToCrushIntro: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TalkToCrushStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const { user } = useAuthStore();

  const handleProfilePress = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'DiaryTab',
        params: {
          screen: 'Profile'
        }
      })
    );
  }, [navigation]);

  const handleBegin = useCallback(() => {
    navigation.navigate('TalkToCrushSection', {
      sectionNumber: 1,
      crushName: '',
      answers: {},
    });
  }, [navigation]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
    width: '100%' as const,
    alignItems: 'center' as const,
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
            <View style={styles.headerLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{en.talkToCrush.title}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={homeStyles.profileBtn}
                onPress={handleProfilePress}
                activeOpacity={0.8}
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={homeStyles.profileImage}
                  />
                ) : (
                  <Text style={homeStyles.profileInitial}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View style={animatedStyle}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="heart-outline" size={44} color="#2D5A1B" />
            </View>
          </View>

          <Text style={styles.title}>{en.talkToCrush.introTitle}</Text>
          <Text style={styles.subtitle}>{en.talkToCrush.introSubtitle}</Text>

          <View style={styles.beforeBeginCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="information-circle-outline" size={18} color="#B8860B" />
              <Text style={styles.cardTitle}>{en.talkToCrush.beforeYouBegin}</Text>
            </View>
            <Text style={styles.cardBodyText}>{en.talkToCrush.beforeYouBeginText}</Text>
          </View>

          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.8}
          >
            <Text style={styles.beginButtonText}>{en.talkToCrush.beginButton}</Text>
          </TouchableOpacity>

          <Text style={styles.buttonSubtext}>{en.talkToCrush.sections}</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default TalkToCrushIntro;
