import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2E0F',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(184,134,11,0.15)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 9,
    color: '#7A5800',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#B8860B',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockedTag: {
    backgroundColor: 'rgba(184,134,11,0.10)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    fontSize: 11,
    color: '#7A5800',
    fontWeight: '600',
  },
  dateTag: {
    backgroundColor: 'rgba(184,134,11,0.10)',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  dateTagText: {
    fontSize: 11,
    color: '#7A5800',
    fontWeight: '600',
  },
  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45,90,27,0.08)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#2D5A1B',
    fontWeight: '600',
  },
  actionBtnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    opacity: 0.6,
  },
  actionTextDisabled: {
    color: '#AAAAAA',
  },
  deleteBtn: {
    backgroundColor: 'rgba(232,85,85,0.08)',
  },
  deleteText: {
    color: '#E85555',
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 8,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45,90,27,0.05)',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  audioCount: {
    fontSize: 12,
    color: '#888888',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
