import { db } from './firebase';

export const APP_CONFIG = {
  privacyPolicyUrl: 'https://www.meriemtafsi.com/privacy',
  termsOfServiceUrl: 'https://www.meriemtafsi.com/terms',
};

// Load from Firestore on startup!
export const loadConfigFromFirestore = async (): Promise<void> => {
  try {
    const configDoc = await db
      .collection('config')
      .doc('appConfig')
      .get();
    
    if (configDoc.exists) {
      const data = configDoc.data()!;
      if (data.privacyPolicyUrl) {
        APP_CONFIG.privacyPolicyUrl = data.privacyPolicyUrl;
      }
      if (data.termsOfServiceUrl) {
        APP_CONFIG.termsOfServiceUrl = data.termsOfServiceUrl;
      }
      console.log('Config loaded from Firestore! ✅');
    }
  } catch (error) {
    console.log('Config load error:', error);
  }
};
