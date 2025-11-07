import { initializeApp } from "firebase/app";
// FIX: Import getAuth and getFirestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Prefer reading values from Vite environment variables (VITE_FIREBASE_*)
// For local dev the originals are kept as fallbacks.
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyBnKaX2cOsz7aKOmMUZ-4XM1Dz_01svAf8",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "capstoneproject-ca332.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "capstoneproject-ca332",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "capstoneproject-ca332.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "731868260597",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:731868260597:web:e0863bbb46f6f2e6d73dbc",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-YLEHG7WCEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// FIX: Initialize Auth and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

// FIX: Use named exports for the services we need
export { app, auth, db };