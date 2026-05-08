import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  card: {
    backgroundColor: 'rgba(245,220,50,0.95)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A3E00',
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 11,
    color: '#7A5800',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#B8860B',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
