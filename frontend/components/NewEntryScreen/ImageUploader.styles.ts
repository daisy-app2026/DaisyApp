import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SPACING = 8;
const IMAGE_SIZE = (width - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    paddingBottom: 20,
  },
  addButton: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0,
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 13,
    color: '#888888',
    marginTop: 6,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_SPACING,
    marginBottom: 16,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: 120,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    minHeight: 80,
    fontSize: 14,
    color: '#1A2E0F',
    textAlignVertical: 'top',
    marginTop: 8, // Fix 1: Reduced from 12
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  // Formatting Toolbar
  toolbarContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginTop: 4,
    gap: 2,
    alignItems: 'center',
  },
  toolbarButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeToolbarButton: {
    backgroundColor: 'rgba(45,90,27,0.12)',
  },
  toolbarDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  },
  boldIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2E0F',
  },
  italicIcon: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1A2E0F',
  },
  underlineIcon: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#1A2E0F',
  },
  strikeIcon: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#1A2E0F',
  },
});
