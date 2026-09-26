import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSubscription } from '../../hooks/useSubscription'

interface UpgradePromptProps {
  visible: boolean
  onClose: () => void
  type: 'chat' | 'message'
}

const { width } = Dimensions.get('window')

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  visible,
  onClose,
  type,
}) => {
  const { openBillingPage } = useSubscription()

  const handleUnlockSpace = () => {
    onClose()
    openBillingPage()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <LinearGradient
            colors={['#F9E65C', '#F2DB4A']}
            style={styles.headerGradient}
          >
            <Text style={styles.flowerEmoji}>🌼</Text>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.title}>You've reached your limit 🌼</Text>
            
            <Text style={styles.description}>
              {type === 'chat'
                ? "You've reached the maximum number of AI chats allowed on your free plan. Unlock more space to continue your healing journey."
                : "You've reached your monthly message limit. Get more chats and messages to continue your healing journey."}
            </Text>

            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <Ionicons name="sparkles" size={18} color="#2D5A1B" />
                <Text style={styles.benefitText}>
                  <Text style={styles.boldText}>Basic Plan:</Text> 10 chats, 150 messages/month
                </Text>
              </View>

              <View style={styles.benefitRow}>
                <Ionicons name="flash" size={18} color="#2D5A1B" />
                <Text style={styles.benefitText}>
                  <Text style={styles.boldText}>Pro Plan:</Text> Unlimited chats, 500 messages/month
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleUnlockSpace}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Unlock More Space</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: Math.min(width - 40, 380),
    backgroundColor: '#FAFAF8',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  headerGradient: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flowerEmoji: {
    fontSize: 44,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A3A0F',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#556B43',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: 'rgba(45, 90, 27, 0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 13,
    color: '#1A3A0F',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  primaryButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#2D5A1B',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#8A9B7D',
    fontSize: 14,
    fontWeight: '600',
  },
})

export default UpgradePrompt
