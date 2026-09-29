import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../src/config/firebase';

async function migrateUsers() {
  console.log('🚀 Starting user migration script...\n');

  try {
    const usersSnap = await db.collection('users').get();

    if (usersSnap.empty) {
      console.log('No users found in Firestore.');
      return;
    }

    console.log(`Found ${usersSnap.size} user documents to check.`);

    let updatedCount = 0;
    let skippedCount = 0;

    const defaultResetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const updates: Record<string, any> = {};

      if (data.chatCount === undefined) {
        updates.chatCount = 0;
      }

      if (data.monthlyMessageCount === undefined) {
        updates.monthlyMessageCount = 0;
      }

      if (data.messageResetAt === undefined) {
        updates.messageResetAt = defaultResetAt;
      }

      if (Object.keys(updates).length > 0) {
        await doc.ref.set(updates, { merge: true });
        updatedCount++;
        console.log(`✅ Updated UID [${doc.id}]:`, updates);
      } else {
        skippedCount++;
      }
    }

    console.log('\n----------------------------------------');
    console.log(`🎉 Migration finished!`);
    console.log(`Updated users: ${updatedCount}`);
    console.log(`Skipped users (already complete): ${skippedCount}`);
    console.log(`Total checked: ${usersSnap.size}`);
    console.log('----------------------------------------\n');
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
    process.exit(1);
  }
}

migrateUsers().then(() => process.exit(0));
