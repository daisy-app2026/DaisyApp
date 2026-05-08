import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './DisclaimerScreen.styles';
import en from '../../locales/en.json';

import { useNavigation } from '@react-navigation/native';

const DisclaimerScreen: React.FC = () => {
  const navigation = useNavigation();
  const t = en.disclaimer;

  const InfoCard = ({ 
    emoji, 
    title, 
    body, 
    cardStyle, 
    circleStyle 
  }: { 
    emoji: string; 
    title: string; 
    body: string; 
    cardStyle: any; 
    circleStyle: any 
  }) => (
    <View style={[styles.card, cardStyle]}>
      <View style={[styles.emojiCircle, circleStyle]}>
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardBody}>{body}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF8" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#2D5A1B" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{t.title}</Text>
          
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Ionicons name="shield-checkmark" size={52} color="#2D5A1B" />
          <Text style={styles.title}>{t.importantNotice}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <InfoCard 
          emoji="🤖"
          title={t.aiTitle}
          body={t.aiBody}
          cardStyle={styles.aiCard}
          circleStyle={styles.aiEmojiCircle}
        />

        <InfoCard 
          emoji="💚"
          title={t.therapyTitle}
          body={t.therapyBody}
          cardStyle={styles.therapyCard}
          circleStyle={styles.therapyEmojiCircle}
        />

        <InfoCard 
          emoji="🔒"
          title={t.privacyTitle}
          body={t.privacyBody}
          cardStyle={styles.privacyCard}
          circleStyle={styles.privacyEmojiCircle}
        />

        <TouchableOpacity 
          style={styles.agreeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.agreeButtonText}>{t.agree}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DisclaimerScreen;
