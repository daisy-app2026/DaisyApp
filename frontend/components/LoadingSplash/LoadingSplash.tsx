import React from 'react'
import {
  View,
  Image,
} from 'react-native'
import { styles } from './LoadingSplash.styles'

const LoadingSplash: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="cover"
      />
    </View>
  )
}

export default LoadingSplash
