import { db } from '../config/firebase';
import * as admin from 'firebase-admin';

// Dynamic import for ESM compatibility!
const getExpoSDK = async () => {
  const { Expo } = await import('expo-server-sdk');
  return Expo;
};

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const Expo = await getExpoSDK();
    const expo = new Expo();

    if (!Expo.isExpoPushToken(token)) {
      console.log('Invalid Expo token:', token);
      return;
    }

    const chunks = expo.chunkPushNotifications([{
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    }]);

    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log('Receipts:', receipts);
    }

    console.log('Notification sent! ✅');
  } catch (error) {
    console.log('Notification error:', error);
  }
};

export const sendToAllUsers = async (
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    const Expo = await getExpoSDK();
    const expo = new Expo();

    const usersSnapshot = await db
      .collection('users')
      .where('pushToken', '!=', null)
      .get();

    const messages: any[] = [];

    usersSnapshot.forEach(doc => {
      const token = doc.data().pushToken;
      if (token && Expo.isExpoPushToken(token)) {
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

    if (messages.length === 0) {
      console.log('No valid tokens found!');
      return;
    }

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log('Chunk receipts:', receipts);
    }

    console.log(`✅ Sent to ${messages.length} users!`);
  } catch (error) {
    console.error('Send all error:', error);
  }
};

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
      'Your memory capsule is ready to open!',
      { type: 'capsule' }
    );
  } catch (error) {
    console.log('Capsule notify error:', error);
  }
};

export const savePushToken = async (
  userId: string,
  token: string
): Promise<void> => {
  await db
    .collection('users')
    .doc(userId)
    .update({ pushToken: token });
};
