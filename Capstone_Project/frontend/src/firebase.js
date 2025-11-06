import { initializeApp } from "firebase/app";
// FIX: Import getAuth and getFirestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnKaX2cOsz7aKOmMUZ-4XM1Dz_01svAf8",
  authDomain: "capstoneproject-ca332.firebaseapp.com",
  projectId: "capstoneproject-ca332",
  storageBucket: "capstoneproject-ca332.firebasestorage.app",
  messagingSenderId: "731868260597",
  appId: "1:731868260597:web:e0863bbb46f6f2e6d73dbc",
  measurementId: "G-YLEHG7WCEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// FIX: Initialize Auth and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

// FIX: Use named exports for the services we need
export { app, auth, db };