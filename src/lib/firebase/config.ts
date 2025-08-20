import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLG4s69ohujjHn4ykECw5zranEvdq3ynw",
  authDomain: "hackcentral.firebaseapp.com",
  projectId: "hackcentral",
  storageBucket: "hackcentral.firebasestorage.app",
  messagingSenderId: "1076524616681",
  appId: "1:1076524616681:web:8abd4f1516428fc50f9978"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
