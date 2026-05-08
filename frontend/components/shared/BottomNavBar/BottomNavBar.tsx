import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './BottomNavBar.styles';

export type Tab = 'diary' | 'past' | 'crush';

interface BottomNavBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'diary' as Tab, label: 'Diary', iconActive: 'book', iconInactive: 'book-outline' },
    { id: 'past' as Tab, label: 'Talk to Past', iconActive: 'chatbubble-ellipses', iconInactive: 'chatbubble-ellipses-outline' },
    { id: 'crush' as Tab, label: 'Talk to Crush', iconActive: 'heart', iconInactive: 'heart-outline' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const activeColor = '#2D5A1B';
        const inactiveColor = 'rgba(26,46,15,0.28)';

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={(isActive ? tab.iconActive : tab.iconInactive) as any} 
              size={24} 
              color={isActive ? activeColor : inactiveColor} 
            />
            <Text style={[
              styles.label, 
              isActive ? styles.activeLabel : styles.inactiveLabel
            ]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavBar;

