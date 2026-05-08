import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  root: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    overflow: 'hidden',
  },
  orbTopRight: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(74, 180, 82, 0.15)',
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 220, 50, 0.18)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 8,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    // overflow: 'hidden',
    resizeMode: 'cover',
  },
  appName: {
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: '900',
    color: '#1A2E0F',
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: 18,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '400',
    color: '#7A9060',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: '#2D5A1B',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 6,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'rgba(245, 220, 50, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(184, 134, 11, 0.35)',
    borderRadius: 25,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5A3E00',
    textAlign: 'center',
  },
});
