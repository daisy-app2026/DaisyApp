import { db } from '../config/firebase';

let expoInstance: any;

const getExpo = async () => {
  if (!expoInstance) {
    const { Expo: ExpoSDK } = await import('expo-server-sdk');
    expoInstance = new ExpoSDK();
  }
  return expoInstance;
};

// Send to single user
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const { Expo: ExpoSDK } = await import('expo-server-sdk');
    if (!ExpoSDK.isExpoPushToken(token)) {
      console.log('Invalid Expo token:', token);
      return;
    }

    const expo = await getExpo();

    const message = {
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    };

    const chunks = expo.chunkPushNotifications([message]);
    
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    
    console.log('Notification sent! ✅');
  } catch (error) {
    console.log('Notification error:', error);
  }
};

// Send to ALL users
export const sendToAllUsers = async (
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const { Expo: ExpoSDK } = await import('expo-server-sdk');
    const usersSnapshot = await db
      .collection('users')
      .where('pushToken', '!=', null)
      .get();

    const messages: any[] = [];

    usersSnapshot.forEach(doc => {
      const token = doc.data().pushToken;
      if (token && ExpoSDK.isExpoPushToken(token)) {
        messages.push({
          to: token,
          sound: 'default',
          title,
          body,
          data: data || {},
        });
      }
    });

    console.log(`Sending to ${messages.length} users!`);

    const expo = await getExpo();
    const chunks = expo.chunkPushNotifications(messages);
    
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log('Receipts:', receipts);
    }

    console.log('All sent! ✅');
  } catch (error) {
    console.error('Send all error:', error);
  }
};

// Send capsule notification
export const sendCapsuleNotification = async (userId: string): Promise<void> => {
  try {
    const userDoc = await db
      .collection('users')
      .doc(userId)
      .get();
    
    const token = userDoc.data()?.pushToken;
    
    if (!token) return;

    await sendPushNotification(
      token,
      '🌼 Memory Capsule Unlocked!',
      'Your memory capsule is ready!',
      { type: 'capsule' }
    );
  } catch (error) {
    console.log('Capsule notify error:', error);
  }
};

// Save user push token
export const savePushToken = async (
  userId: string,
  token: string
): Promise<void> => {
  await db
    .collection('users')
    .doc(userId)
    .update({ pushToken: token });
};
