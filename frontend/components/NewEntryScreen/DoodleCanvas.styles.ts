import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 8,
  },
  // Colors Row
  colorsContainer: {
    height: 60,
  },
  colorsRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  selectedColorCircle: {
    borderWidth: 2.5,
    borderColor: '#2D5A1B',
    transform: [{ scale: 1.1 }],
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 16, // Padding at end of scroll
  },
  // Canvas Area
  canvasStack: {
    height: 400,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  canvasItem: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  // Canvas Navigation
  canvasNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D5A1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  arrowDisabled: {
    opacity: 0.4,
  },
  canvasCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5A1B',
    minWidth: 40,
    textAlign: 'center',
  },
  // Size Slider
  sizeSliderRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  sizePreview: {
    marginLeft: 8,
    backgroundColor: '#1A2E0F',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  // Tools Row (Circular Icons Only)
  toolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  toolCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeToolCircle: {
    backgroundColor: '#2D5A1B',
  },
});
