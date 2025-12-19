import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqIbmcNUuTkX7_KTgZ4t32nMUQi7d4uwM",
  authDomain: "portfolio-a2172.firebaseapp.com",
  projectId: "portfolio-a2172",
  storageBucket: "portfolio-a2172.firebasestorage.app",
  messagingSenderId: "350308275443",
  appId: "1:350308275443:web:ade5feb025882a0ca41386",
  measurementId: "G-1XFHXTXG2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
