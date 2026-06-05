import admin, { db } from '../config/firebase';

// Send to single user
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          }
        }
      }
    });
    console.log('Notification sent!');
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
    const usersSnapshot = await db
      .collection('users')
      .where('pushToken', '!=', null)
      .get();

    const tokens: string[] = [];
    usersSnapshot.forEach(doc => {
      const token = doc.data().pushToken;
      if (token) tokens.push(token);
    });

    console.log(`Sending to ${tokens.length} users!`);

    // Send in batches of 500!
    const batchSize = 500;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      
      await admin.messaging().sendEachForMulticast({
        tokens: batch,
        notification: { title, body },
        data: data || {},
        android: {
          priority: 'high',
        }
      });
    }

    console.log('All notifications sent!');
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
      'Your memory capsule is ready to open. Tap to see what you wrote!',
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
