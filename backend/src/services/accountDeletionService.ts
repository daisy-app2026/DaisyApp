import admin, { db, auth } from '../config/firebase';
import { pineconeIndex } from '../config/pinecone';
import { v2 as cloudinary } from 'cloudinary';
import { deleteEntryMedia } from '../controllers/entriesController';

// Helper to chunk document array and commit deletes in batches of 500
const deleteDocsInBatches = async (docs: admin.firestore.QueryDocumentSnapshot[]) => {
  let batch = db.batch();
  let count = 0;
  for (const doc of docs) {
    batch.delete(doc.ref);
    count++;
    if (count === 500) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }
  if (count > 0) {
    await batch.commit();
  }
};

export const cascadeDeleteUserData = async (userId: string) => {
  const summary = {
    pinecone: false,
    cloudinary: false,
    firestore: false,
    auth: false,
  };

  console.log(`[Account Deletion] Starting cascade delete for user: ${userId}`);

  // Step 1: Delete Pinecone vectors
  try {
    console.log('[Account Deletion] Deleting Pinecone vectors...');
    await pineconeIndex.deleteMany({
      filter: {
        userId: { $eq: userId },
      },
    });
    summary.pinecone = true;
    console.log('[Account Deletion] Pinecone vectors deleted successfully.');
  } catch (error) {
    console.error(`[Account Deletion] Pinecone delete failed for user ${userId}:`, error);
  }

  // Step 2: Delete Cloudinary media
  try {
    console.log('[Account Deletion] Fetching entries for Cloudinary cleanup...');
    const entriesSnapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .get();

    for (const doc of entriesSnapshot.docs) {
      const data = doc.data();
      if (data?.content) {
        await deleteEntryMedia(data.content);
      }
    }

    console.log('[Account Deletion] Fetching user profile photo for Cloudinary cleanup...');
    const userDoc = await db.collection('users').doc(userId).get();
    const photoURL = userDoc.data()?.photoURL;
    if (photoURL && photoURL.includes('cloudinary.com')) {
      const getCloudinaryPublicId = (url: string): string => {
        try {
          const parts = url.split('/');
          const uploadIndex = parts.indexOf('upload');
          if (uploadIndex === -1) return '';
          const pathAfterUpload = parts.slice(uploadIndex + 2);
          const filename = pathAfterUpload.join('/');
          return filename.split('.')[0];
        } catch {
          return '';
        }
      };
      const publicId = getCloudinaryPublicId(photoURL);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        console.log(`[Account Deletion] Profile photo ${publicId} deleted from Cloudinary.`);
      }
    }
    summary.cloudinary = true;
    console.log('[Account Deletion] Cloudinary cleanup complete.');
  } catch (error) {
    console.error(`[Account Deletion] Cloudinary media delete failed for user ${userId}:`, error);
  }

  // Step 3: Delete Firestore data
  try {
    console.log('[Account Deletion] Deleting Firestore user data...');

    // a. Subcollection users/{userId}/spaces
    console.log('[Account Deletion] Deleting custom spaces subcollection...');
    const spacesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('spaces')
      .get();
    await deleteDocsInBatches(spacesSnapshot.docs);

    // b. entries collection
    console.log('[Account Deletion] Deleting entries collection docs...');
    const entriesSnapshot = await db
      .collection('entries')
      .where('userId', '==', userId)
      .get();
    await deleteDocsInBatches(entriesSnapshot.docs);

    // c. talkToPastSessions collection
    console.log('[Account Deletion] Deleting talkToPastSessions collection docs...');
    const pastSessionsSnapshot = await db
      .collection('talkToPastSessions')
      .where('userId', '==', userId)
      .get();
    await deleteDocsInBatches(pastSessionsSnapshot.docs);

    // d. talkToCrushSessions collection
    console.log('[Account Deletion] Deleting talkToCrushSessions collection docs...');
    const crushSessionsSnapshot = await db
      .collection('talkToCrushSessions')
      .where('userId', '==', userId)
      .get();
    await deleteDocsInBatches(crushSessionsSnapshot.docs);

    // e. users/{userId} document itself
    console.log('[Account Deletion] Deleting main user document...');
    await db.collection('users').doc(userId).delete();

    summary.firestore = true;
    console.log('[Account Deletion] Firestore cleanup complete.');
  } catch (error) {
    console.error(`[Account Deletion] Firestore delete failed for user ${userId}:`, error);
  }

  // Step 4: Delete Firebase Auth user
  try {
    console.log('[Account Deletion] Deleting Firebase Auth user...');
    await auth.deleteUser(userId);
    summary.auth = true;
    console.log('[Account Deletion] Firebase Auth user deleted successfully.');
  } catch (error) {
    console.error(`[Account Deletion] Firebase Auth delete failed for user ${userId}:`, error);
  }

  console.log(`[Account Deletion] Completed cascade delete for user: ${userId}. Summary:`, summary);
  return summary;
};
