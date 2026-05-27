import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  headerSafeArea: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.82)',
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
    width: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2E0F',
  },
  headerRight: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  // Progress Bar Redesign
  progressBarContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepPill: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
  stepPillCompleted: {
    backgroundColor: '#2D5A1B',
  },
  stepPillCurrent: {
    backgroundColor: '#2D5A1B',
  },
  stepPillFuture: {
    backgroundColor: 'rgba(45,90,27,0.15)',
  },
  dotIndicatorContainer: {
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  stepActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D5A1B',
  },
  stepLabel: {
    fontSize: 9,
    color: '#888888',
    textAlign: 'center',
    marginTop: 6,
  },
  // Section Header Card
  sectionHeaderCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(45,90,27,0.07)',
    borderRadius: 12,
    padding: 12,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D5A1B',
  },
  sectionHeaderSubtitle: {
    fontSize: 12,
    color: '#4A7C2A',
    marginTop: 2,
    fontStyle: 'italic',
  },
  descriptionText: {
    marginHorizontal: 16,
    marginTop: 8,
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  // Prompts (Section 3 only)
  promptsContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  promptsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAAAA',
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Questions
  questionBlock: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A2E0F',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1A2E0F',
    textAlignVertical: 'top',
    // Shadow
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  // Continue Button
  continueButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#2D5A1B',
  },
  continueButtonSection4: {
    backgroundColor: '#2D5A1B',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(45,90,27,0.4)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(45,90,27,0.12)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(45,90,27,0.08)',
    borderColor: '#2D5A1B',
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 14,
    color: '#1A2E0F',
    flex: 1,
  },
  optionTextSelected: {
    color: '#2D5A1B',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  gridOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(45,90,27,0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  gridOptionSelected: {
    backgroundColor: 'rgba(45,90,27,0.08)',
    borderColor: '#2D5A1B',
  },
  gridOptionText: {
    fontSize: 13,
    color: '#1A2E0F',
  },
  gridOptionTextSelected: {
    color: '#2D5A1B',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#E85555',
    flex: 1,
  },
  mandatoryBadge: {
    fontSize: 11,
    color: '#E85555',
    marginLeft: 4,
  },
  promptChip: {
    backgroundColor: 'rgba(45,90,27,0.07)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(45,90,27,0.15)',
    marginRight: 8,
    marginBottom: 8,
  },
  promptChipText: {
    fontSize: 12,
    color: '#2D5A1B',
    fontStyle: 'italic',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorInput: {
    borderColor: '#E85555',
    borderWidth: 1.5,
  },
});
