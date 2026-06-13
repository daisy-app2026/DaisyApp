import axios from 'axios';
import { db } from '../config/firebase';

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const isExpoPushToken = (token: string): boolean => {
  return token.startsWith('ExponentPushToken[');
};

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    if (!isExpoPushToken(token)) {
      console.log('Invalid token:', token);
      return;
    }

    await axios.post(
      EXPO_PUSH_URL,
      {
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
        }
      }
    );

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
    const usersSnapshot = await db
      .collection('users')
      .where('pushToken', '!=', null)
      .get();

    const messages: object[] = [];

    usersSnapshot.forEach(doc => {
      const token = doc.data().pushToken;
      if (token && isExpoPushToken(token)) {
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
      console.log('No valid tokens!');
      return;
    }

    // Send in batches of 100!
    const batchSize = 100;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);

      const response = await axios.post(
        EXPO_PUSH_URL,
        batch,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
          }
        }
      );

      console.log('Batch sent:', response.data);
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
      'Your memory capsule is ready!',
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
