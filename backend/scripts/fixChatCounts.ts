import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/config/firebase';

async function fixChatCounts() {
  console.log('🚀 Starting chat count fix migration script...\n');

  try {
    const usersSnap = await db.collection('users').get();

    if (usersSnap.empty) {
      console.log('No users found in Firestore.');
      return;
    }

    console.log(`Found ${usersSnap.size} user documents to process.\n`);

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;

      // Count talkToCrushSessions
      const crushSnap = await db
        .collection('talkToCrushSessions')
        .where('userId', '==', userId)
        .get();
      const crushSessions = crushSnap.size;

      // Count talkToPastSessions
      const pastSnap = await db
        .collection('talkToPastSessions')
        .where('userId', '==', userId)
        .get();
      const pastSessions = pastSnap.size;

      const total = crushSessions + pastSessions;

      await userDoc.ref.update({
        chatCount: total,
      });

      console.log(`${userId} | ${crushSessions} | ${pastSessions} | ${total}`);
    }

    console.log('\n----------------------------------------');
    console.log(`🎉 Chat count fix completed successfully!`);
    console.log(`Total users updated: ${usersSnap.size}`);
    console.log('----------------------------------------\n');
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
    process.exit(1);
  }
}

fixChatCounts().then(() => process.exit(0));
