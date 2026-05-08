import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  recorderContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  recordButtonContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D5A1B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: '#E85555',
    shadowColor: '#E85555',
  },
  recordButtonText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    textAlign: 'center',
  },
  recordingButtonText: {
    color: '#E85555',
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D5A1B',
    textAlign: 'center',
    marginBottom: 16,
  },
  recordingsList: {
    width: '100%',
    marginTop: 10,
  },
recordingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  playPauseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(45,90,27,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A2E0F',
  },
  recordingDuration: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
});
