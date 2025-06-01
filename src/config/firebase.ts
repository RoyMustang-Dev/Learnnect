// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase config (you'll need to replace these with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyBIMOhHAQcNs5Pk1XXP1Zi0q1i0MxvSACY",
  authDomain: "learnnect-blogs-75592.firebaseapp.com",
  projectId: "learnnect-blogs-75592",
  storageBucket: "learnnect-blogs-75592.firebasestorage.app",
  messagingSenderId: "55385329622",
  appId: "1:55385329622:web:421a54d1f9c22b5ae49e77",
  measurementId: "G-YZD54C1G14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
