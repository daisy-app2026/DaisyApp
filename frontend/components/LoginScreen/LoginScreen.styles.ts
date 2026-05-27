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
    flex: 1,
    justifyContent: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#4A7C2A',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#2D5A1B',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    // Shadow same as design system (reusing from splash button)
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonText: {
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
  newHereText: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  createAccountText: {
    color: '#2D5A1B',
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -6,
    marginBottom: 12,
    marginLeft: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#E85555',
    flex: 1,
  },
  generalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 85, 85, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  generalErrorText: {
    fontSize: 13,
    color: '#E85555',
    flex: 1,
  },
  errorInput: {
    borderColor: '#E85555',
    borderWidth: 1.5,
  },
});
