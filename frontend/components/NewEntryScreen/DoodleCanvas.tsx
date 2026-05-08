import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  PanResponder,
  ScrollView,
  Text,
} from 'react-native';
import Svg, { Path as SvgPath } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './DoodleCanvas.styles';
import CustomModal from '../shared/CustomModal/CustomModal';

export interface DoodleCanvasRef {
  capture: () => Promise<string[]>;
}

interface DoodleCanvasProps {
  onDoodleCapture: (uris: string[]) => void;
  onDrawingStart?: () => void;
  onDrawingEnd?: () => void;
}

interface CanvasData {
  id: string;
  paths: {
    path: string;
    color: string;
    strokeWidth: number;
    opacity: number;
  }[];
}

const COLORS = [
  '#1A2E0F', // dark green
  '#2D5A1B', // green
  '#F5DC32', // yellow
  '#E85555', // red
  '#3355CC', // blue
  '#B8860B', // gold
  '#FFFFFF', // white
  '#000000', // black
];

const DoodleCanvas = forwardRef<DoodleCanvasRef, DoodleCanvasProps>(({ 
  onDoodleCapture,
  onDrawingStart,
  onDrawingEnd 
}, ref) => {
  const [canvases, setCanvases] = useState<CanvasData[]>([{ id: '1', paths: [] }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedColor, setSelectedColor] = useState('#1A2E0F');
  const [selectedTool, setSelectedTool] = useState<'pen' | 'brush' | 'eraser'>('pen');
  const [strokeSize, setStrokeSize] = useState(4);
  const [isDarkCanvas, setIsDarkCanvas] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const activeIndexRef = useRef(0);
  const canvasRefs = useRef<{ [key: string]: ViewShot | null }>({});

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useImperativeHandle(ref, () => ({
    capture: async () => {
      const uris: string[] = [];
      for (let i = 0; i < canvases.length; i++) {
        const id = canvases[i].id;
        const viewShot = canvasRefs.current[id];
        if (viewShot && viewShot.capture) {
          try {
            const uri = await viewShot.capture();
            if (uri) uris.push(uri);
          } catch (err) {
            console.error(`Failed to capture canvas ${id}:`, err);
          }
        }
      }
      onDoodleCapture(uris);
      return uris;
    },
  }));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (e) => {
      onDrawingStart?.();
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath(`M ${locationX} ${locationY}`);
    },
    onPanResponderMove: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
    },
    onPanResponderRelease: () => {
      onDrawingEnd?.();
      if (currentPath) {
        const idx = activeIndexRef.current;
        setCanvases((prev) => {
          const updated = [...prev];
          const color = selectedTool === 'eraser'
            ? (isDarkCanvas ? '#1A1A2E' : '#FFFFFF')
            : selectedColor;
          
          updated[idx] = {
            ...updated[idx],
            paths: [
              ...updated[idx].paths,
              {
                path: currentPath,
                color,
                strokeWidth: selectedTool === 'brush' ? strokeSize * 2 : strokeSize,
                opacity: selectedTool === 'brush' ? 0.7 : 1,
              },
            ],
          };
          return updated;
        });
        setCurrentPath('');
        onDoodleCapture(['has_content']);
      }
    },
  });

  const handleAddCanvas = () => {
    if (canvases.length >= 5) {
      setShowLimitModal(true);
      return;
    }

    const newCanvas = {
      id: Date.now().toString(),
      paths: [],
    };
    const newLength = canvases.length;
    setCanvases((prev) => [...prev, newCanvas]);
    setActiveIndex(newLength);
  };

  const undo = () => {
    setCanvases((prev) => {
      const updated = [...prev];
      updated[activeIndex] = {
        ...updated[activeIndex],
        paths: updated[activeIndex].paths.slice(0, -1),
      };
      return updated;
    });
  };

  const clearActive = () => {
    setCanvases((prev) => {
      const updated = [...prev];
      updated[activeIndex] = {
        ...updated[activeIndex],
        paths: [],
      };
      return updated;
    });
  };

  return (
    <ScrollView 
      scrollEnabled={false}
      keyboardShouldPersistTaps='handled'
      style={styles.mainScroll} 
      contentContainerStyle={styles.mainContent}
    >
      <View style={styles.container}>
        {/* Colors Row */}
        <View style={styles.colorsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorsRow}
          >
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorCircle,
                  color === '#FFFFFF' && { borderWidth: 1, borderColor: '#DDD' },
                ]}
                onPress={() => {
                  setSelectedColor(color);
                  if (selectedTool === 'eraser') setSelectedTool('pen');
                }}
              />
            ))}

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                { backgroundColor: isDarkCanvas ? '#1A2E0F' : 'rgba(0,0,0,0.08)' },
              ]}
              onPress={() => setIsDarkCanvas(!isDarkCanvas)}
            >
              <Ionicons
                name={isDarkCanvas ? 'moon' : 'sunny-outline'}
                size={16}
                color={isDarkCanvas ? 'white' : '#888'}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Canvas Stack Area */}
        <View style={styles.canvasStack}>
          {canvases.map((canvas, index) => (
            <View
              key={canvas.id}
              pointerEvents={activeIndex === index ? 'auto' : 'none'}
              style={[
                styles.canvasItem,
                { 
                  opacity: activeIndex === index ? 1 : 0,
                  zIndex: activeIndex === index ? 1 : 0,
                }
              ]}
            >
              <ViewShot
                ref={(r) => { canvasRefs.current[canvas.id] = r; }}
                style={[
                  styles.canvas,
                  { backgroundColor: isDarkCanvas ? '#1A1A2E' : '#FFFFFF' }
                ]}
                options={{ format: 'jpg', quality: 0.9 }}
              >
                <View
                  style={styles.canvas}
                  {...(activeIndex === index ? panResponder.panHandlers : {})}
                >
                  <Svg style={styles.absoluteFill}>
                    {canvas.paths.map((p, i) => (
                      <SvgPath
                        key={i}
                        d={p.path}
                        stroke={p.color}
                        strokeWidth={p.strokeWidth}
                        strokeOpacity={p.opacity}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    {activeIndex === index && currentPath ? (
                      <SvgPath
                        d={currentPath}
                        stroke={
                          selectedTool === 'eraser'
                            ? isDarkCanvas ? '#1A1A2E' : '#FFFFFF'
                            : selectedColor
                        }
                        strokeWidth={selectedTool === 'brush' ? strokeSize * 2 : strokeSize}
                        strokeOpacity={selectedTool === 'brush' ? 0.7 : 1}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}
                  </Svg>
                </View>
              </ViewShot>
            </View>
          ))}
        </View>

        {/* Canvas Navigation */}
        <View style={styles.canvasNav}>
          <TouchableOpacity
            style={[
              styles.arrowBtn,
              activeIndex === 0 && styles.arrowDisabled
            ]}
            onPress={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <Ionicons 
              name="chevron-back"
              size={20}
              color={activeIndex === 0 ? '#CCCCCC' : '#2D5A1B'}
            />
          </TouchableOpacity>

          <Text style={styles.canvasCounter}>
            {activeIndex + 1}/{canvases.length}
          </Text>

          <TouchableOpacity
            style={[
              styles.arrowBtn,
              activeIndex === canvases.length - 1 && styles.arrowDisabled
            ]}
            onPress={() => activeIndex < canvases.length - 1 && setActiveIndex(activeIndex + 1)}
            disabled={activeIndex === canvases.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={activeIndex === canvases.length - 1 ? '#CCCCCC' : '#2D5A1B'}
            />
          </TouchableOpacity>
        </View>

        {/* Size Slider */}
        <View style={styles.sizeSliderRow}>
          <Ionicons name="remove" size={18} color="#888888" />
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={20}
            value={strokeSize}
            onValueChange={setStrokeSize}
            minimumTrackTintColor="#2D5A1B"
            maximumTrackTintColor="rgba(0,0,0,0.1)"
            thumbTintColor="#2D5A1B"
          />
          <Ionicons name="add" size={18} color="#888888" />
          <View
            style={[
              styles.sizePreview,
              {
                width: Math.max(8, strokeSize),
                height: Math.max(8, strokeSize),
                borderRadius: strokeSize / 2,
                backgroundColor: selectedColor,
              },
            ]}
          />
        </View>

        {/* Tools Row (Circular Icons Only) */}
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={[styles.toolCircle, selectedTool === 'pen' && styles.activeToolCircle]}
            onPress={() => setSelectedTool('pen')}
          >
            <Ionicons 
              name="pencil-outline" 
              size={20} 
              color={selectedTool === 'pen' ? 'white' : '#2D5A1B'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toolCircle, selectedTool === 'brush' && styles.activeToolCircle]}
            onPress={() => setSelectedTool('brush')}
          >
            <Ionicons 
              name="brush-outline" 
              size={20} 
              color={selectedTool === 'brush' ? 'white' : '#2D5A1B'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolCircle, selectedTool === 'eraser' && styles.activeToolCircle]}
            onPress={() => setSelectedTool('eraser')}
          >
            <Ionicons 
              name="backspace-outline" 
              size={20} 
              color={selectedTool === 'eraser' ? 'white' : '#2D5A1B'} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCircle} onPress={undo}>
            <Ionicons name="arrow-undo-outline" size={20} color="#2D5A1B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCircle} onPress={clearActive}>
            <Ionicons name="trash-outline" size={20} color="#E85555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolCircle} onPress={handleAddCanvas}>
            <Ionicons name="add-outline" size={22} color="#2D5A1B" />
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={showLimitModal}
        title="Maximum reached!"
        message="Maximum 5 canvases reached!"
        type="alert"
        onConfirm={() => setShowLimitModal(false)}
        confirmText="OK"
      />
    </ScrollView>
  );
});

export default DoodleCanvas;
