import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#2D5A1B',
    fontSize: 24,
    fontWeight: '300',
  },
  headerTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2E0F',
    textAlign: 'center',
    flex: 1,
    marginRight: 40, // To balance the back button
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    // Shadow for iOS
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    // Elevation for Android
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#1A2E0F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 27, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  icon: {
    fontSize: 14,
    color: '#888',
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A2E0F',
  },
  createButton: {
    backgroundColor: '#2D5A1B',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 14,
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(45, 90, 27, 0.1)',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#BBBBBB',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(45, 90, 27, 0.14)',
    borderRadius: 25,
    paddingVertical: 14,
  },
  googleIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 14,
    color: '#2D5A1B',
    fontWeight: '500',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  haveAccountText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  signInText: {
    color: '#2D5A1B',
    fontSize: 13,
    fontWeight: '600',
  },
});
