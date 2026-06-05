import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import axios from 'axios';
import { getFreshToken } from '../utils/getToken';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    // Check permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Push permission denied!');
      return null;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '2a6d8f1f-9810-4930-8806-069818631e4e',
    });
    
    const token = tokenData.data;
    console.log('Push token:', token);
    
    // Save to backend!
    const authToken = await getFreshToken();
    
    await axios.post(
      `${API_URL}/api/notifications/save-token`,
      { token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    return token;
  } catch (error) {
    console.log('Push registration error:', error);
    return null;
  }
};
