import { auth } from '../config/firebase';

export const getFreshToken = async (): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (user) {
      // false = use cached if valid, refreshes automatically if expired
      const token = await user.getIdToken(false);
      return token;
    }
    throw new Error('User not logged in');
  } catch (error) {
    console.error('Token error:', error);
    throw error;
  }
};
