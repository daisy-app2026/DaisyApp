import { Linking } from 'react-native'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useSubscriptionStore, Plan } from '../store/subscriptionStore'
import axios from 'axios'
import { getFreshToken } from '../utils/getToken'

const API_URL = process.env.EXPO_PUBLIC_API_URL

const DEFAULT_PLANS = {
  free: { chatLimit: 3, messageLimit: 30 },
  basic: { chatLimit: 10, messageLimit: 150 },
  pro: { chatLimit: 15, messageLimit: 500 },
}

export const subscribeToUserPlan = (
  userId: string,
  callback?: (plan: Plan) => void
) => {
  if (!userId) return () => {}

  const userRef = doc(db, 'users', userId)
  const plansRef = doc(db, 'config', 'pricing')

  let userPlan: Plan = 'free'
  let userData: Record<string, any> = {}
  let plansConfig: Record<string, any> = DEFAULT_PLANS

  const updateStore = () => {
    const limits = plansConfig[userPlan] || DEFAULT_PLANS[userPlan] || DEFAULT_PLANS.free
    const chatLimit = limits.chatLimit
    const messageLimit = limits.messageLimit
    const chatCount = typeof userData.chatCount === 'number' ? userData.chatCount : 0
    const monthlyMessageCount = typeof userData.monthlyMessageCount === 'number' ? userData.monthlyMessageCount : 0
    const messageResetAt = userData.messageResetAt || null

    useSubscriptionStore.getState().setSubscriptionData({
      plan: userPlan,
      chatLimit,
      chatCount,
      messageLimit,
      monthlyMessageCount,
      messageResetAt,
    })
    if (callback) callback(userPlan)
  }

  // Subscribe to config/pricing
  const unsubPlans = onSnapshot(plansRef, (plansSnap) => {
    if (plansSnap.exists()) {
      const data = plansSnap.data()
      const plans = data?.plans || data
      plansConfig = { ...DEFAULT_PLANS, ...plans }
    }
    updateStore()
  })

  // Subscribe to user doc
  const unsubUser = onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        userData = snap.data()
        userPlan = (userData.plan as Plan) || 'free'
        updateStore()
      }
    },
    (error) => {
      console.log('User plan real-time listener error:', error)
    }
  )

  return () => {
    unsubPlans()
    unsubUser()
  }
}

export const useSubscription = () => {
  const { setSubscriptionData, setLoading } = useSubscriptionStore()

  const loadUserPlan = async (userId: string) => {
    if (!userId) return
    try {
      setLoading(true)

      let plansConfig = DEFAULT_PLANS
      try {
        const plansSnap = await getDoc(doc(db, 'config', 'pricing'))
        if (plansSnap.exists()) {
          const data = plansSnap.data()
          const plans = data?.plans || data
          plansConfig = { ...DEFAULT_PLANS, ...plans }
        }
      } catch (e) {
        console.log('Config plans load error:', e)
      }

      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const data = userDoc.data()
        const plan = (data?.plan as Plan) || 'free'
        const limits = plansConfig[plan] || DEFAULT_PLANS[plan] || DEFAULT_PLANS.free
        const chatLimit = limits.chatLimit
        const messageLimit = limits.messageLimit
        const chatCount = typeof data?.chatCount === 'number' ? data.chatCount : 0
        const monthlyMessageCount = typeof data?.monthlyMessageCount === 'number' ? data.monthlyMessageCount : 0
        const messageResetAt = data?.messageResetAt || null

        setSubscriptionData({
          plan,
          chatLimit,
          chatCount,
          messageLimit,
          monthlyMessageCount,
          messageResetAt,
        })
        return
      }

      const token = await getFreshToken()
      if (token) {
        const response = await axios.get(`${API_URL}/api/auth/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = response.data?.user || {}
        const plan = (data.plan as Plan) || 'free'
        const limits = plansConfig[plan] || DEFAULT_PLANS[plan] || DEFAULT_PLANS.free
        const chatLimit = limits.chatLimit
        const messageLimit = limits.messageLimit
        const chatCount = typeof data.chatCount === 'number' ? data.chatCount : 0
        const monthlyMessageCount = typeof data.monthlyMessageCount === 'number' ? data.monthlyMessageCount : 0
        const messageResetAt = data.messageResetAt || null

        setSubscriptionData({
          plan,
          chatLimit,
          chatCount,
          messageLimit,
          monthlyMessageCount,
          messageResetAt,
        })
      }
    } catch (error) {
      console.log('Error loading user plan:', error)
      setSubscriptionData({ plan: 'free' })
    } finally {
      setLoading(false)
    }
  }

  const openBillingPage = () => {
    const url = process.env.EXPO_PUBLIC_BILLING_URL || 'https://www.meriemtafsi.com/billing'
    Linking.openURL(url).catch((err) => console.log('Could not open billing URL:', err))
  }

  return { loadUserPlan, openBillingPage }
}
