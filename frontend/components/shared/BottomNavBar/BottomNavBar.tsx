import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './BottomNavBar.styles';

export type Tab = 'diary' | 'past' | 'crush';

interface BottomNavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'diary' as Tab, label: 'Diary', iconActive: 'book', iconInactive: 'book-outline' },
    { id: 'past' as Tab, label: 'Past', iconActive: 'time', iconInactive: 'time-outline' },
    { id: 'crush' as Tab, label: 'Crush', iconActive: 'heart', iconInactive: 'heart-outline' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#F8E769',
          '#ECD446',
          '#DDBA28'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeColor = '#D4A514';
        const inactiveColor = 'rgba(26,58,15,0.5)';

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <View style={[
              styles.iconContainer,
              isActive ? styles.activeIconContainer : styles.inactiveIconContainer
            ]}>
              <Ionicons 
                name={(isActive ? tab.iconActive : tab.iconInactive) as any} 
                size={26} 
                color={isActive ? activeColor : inactiveColor} 
              />
            </View>
            <Text style={[
              styles.label, 
              isActive ? styles.activeLabel : styles.inactiveLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;

