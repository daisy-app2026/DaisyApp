export interface PersonIconInfo {
  icon: string;
  color: string;
  bgColor: string;
}

export const getPersonIcon = (name: string): PersonIconInfo => {
  const icons: PersonIconInfo[] = [
    { 
      icon: 'person-circle-outline',
      color: '#EC4899',
      bgColor: 'rgba(236,72,153,0.15)'
    },
    { 
      icon: 'heart-circle-outline',
      color: '#8B5CF6',
      bgColor: 'rgba(139,92,246,0.15)'
    },
    { 
      icon: 'star-outline',
      color: '#F59E0B',
      bgColor: 'rgba(245,158,11,0.15)'
    },
    { 
      icon: 'sunny-outline',
      color: '#3B82F6',
      bgColor: 'rgba(59,130,246,0.15)'
    },
    { 
      icon: 'moon-outline',
      color: '#6366F1',
      bgColor: 'rgba(99,102,241,0.15)'
    },
    { 
      icon: 'leaf-outline',
      color: '#10B981',
      bgColor: 'rgba(16,185,129,0.15)'
    },
    { 
      icon: 'flower-outline',
      color: '#EC4899',
      bgColor: 'rgba(236,72,153,0.15)'
    },
    { 
      icon: 'sparkles-outline',
      color: '#8B5CF6',
      bgColor: 'rgba(139,92,246,0.15)'
    },
  ];
  
  // Deterministic based on name!
  const nameToUse = name || '';
  const index = nameToUse.charCodeAt(0) % icons.length;
  const defaultIndex = isNaN(index) ? 0 : index;
  return icons[defaultIndex];
};
