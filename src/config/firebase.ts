// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase config using environment variables
// Replace these with your NEW Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCse04obta35yfdwiBlwzULk7-tCPlrUNo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "learnnect-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "learnnect-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "learnnect-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161279819125",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:161279819125:web:9212bfa93fd6e5d3fca73c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-RQNF1VWZ5B"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
