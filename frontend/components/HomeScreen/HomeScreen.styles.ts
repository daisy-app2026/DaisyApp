import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  // Header
  headerGradient: {
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#D4A514',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerOrb1: {
    position: 'absolute',
    top: -40,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerOrb2: {
    position: 'absolute',
    top: 20,
    left: -80,
    width: 250,
    height: 120,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 9,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
    overflow: 'hidden',
  },
  greeting: {
    fontSize: 11,
    color: 'rgba(26,58,15,0.65)',
    textTransform: 'lowercase',
  },
  userName: {
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#1A3A0F',
    marginTop: 2,
  },
  userNameSmall: {
    fontSize: 14,
  },
  userNameMedium: {
    fontSize: 16,
  },
  userNameLarge: {
    fontSize: 18,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A3A0F',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245,220,50,0.20)',
    borderWidth: 1.5,
    borderColor: 'rgba(184,134,11,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D5A1B',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  // Greeting Card
  greetingCard: {
    backgroundColor: 'rgba(45,90,27,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(45,90,27,0.14)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  greetingTop: {
    fontSize: 11,
    color: '#4A7C2A',
    marginBottom: 4,
  },
  greetingBottom: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2E0F',
  },

  // Sections
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2E0F',
  },
  spacesTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2E0F',
    marginBottom: 0,
    marginTop: 8,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchBtnText: {
    fontSize: 12,
    color: '#4A7C2A',
    fontWeight: '600',
  },

  // Spaces Pagination
  spacesContainer: {
    marginTop: 0,
    paddingHorizontal: 16,
  },
  page: {
    width: width - 32, // Padding horizontal 16 * 2
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(45,90,27,0.20)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D5A1B',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 44,
  },
  emptyTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    color: '#1A2E0F',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    color: '#1A2E0F',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiText: {
    fontSize: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(45,90,27,0.14)',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: '#1A2E0F',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
  },
  cancelButton: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2D5A1B',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
