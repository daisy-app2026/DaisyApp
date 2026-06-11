import React from 'react'
import { 
  View, 
  Image, 
  StyleSheet,
  Dimensions 
} from 'react-native'

const { width, height } = 
  Dimensions.get('window')

const LoadingSplash = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require(
          '../../assets/splash-icon.png'
        )}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000000',
  },
  image: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

export default LoadingSplash
