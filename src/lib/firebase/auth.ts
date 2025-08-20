
'use client';

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';
import { getOrCreateUser } from './firestore';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      // Ensure a user document exists in Firestore
      await getOrCreateUser(result.user);
    }
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export const onAuthChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
