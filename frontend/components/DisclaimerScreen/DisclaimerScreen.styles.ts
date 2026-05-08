import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  headerSafeArea: {
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(45,90,27,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2E0F',
  },
  content: {
    paddingHorizontal: 16,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#1A2E0F',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
  },
  aiCard: {
    borderLeftColor: '#E85555',
  },
  therapyCard: {
    borderLeftColor: '#2D5A1B',
  },
  privacyCard: {
    borderLeftColor: '#B8860B',
  },
  emojiCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  aiEmojiCircle: {
    backgroundColor: 'rgba(232,85,85,0.10)',
  },
  therapyEmojiCircle: {
    backgroundColor: 'rgba(45,90,27,0.10)',
  },
  privacyEmojiCircle: {
    backgroundColor: 'rgba(184,134,11,0.10)',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E0F',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 18,
  },
  // Bottom Button
  agreeButton: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: '#2D5A1B',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
