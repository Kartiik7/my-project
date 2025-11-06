import React, { useState, useEffect, createContext } from 'react';
import api from '../services/api';
// Import Firebase auth and firestore
import { auth, db } from '../firebase';
import { signInWithCustomToken, signOut } from "firebase/auth"; // Import signOut
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // This is the MERN user object
  const [firebaseUser, setFirebaseUser] = useState(null); // This is the Firebase user
  // We no longer store the MERN token in state or localStorage
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  /**
   * Creates or updates a user document in the /users collection in Firestore.
   * This is the "single source of truth" for user data, especially roles.
   */
  const createUserDocumentInFirestore = async (mernUser, fbUser) => {
    if (!fbUser || !mernUser) return;

    const userDocRef = doc(db, "users", fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    let roleToSet;
    let nameToSet;

    if (userDoc.exists()) {
      // Document exists, read the role from Firestore
      // This is the "single source of truth"
      roleToSet = userDoc.data().role || 'Viewer'; // Default to Viewer if no role
      nameToSet = userDoc.data().name; // Keep existing name
    } else {
      // Document does NOT exist (e.g., first login)
      // Create it using the role from Mongo (which is 'Viewer' by default)
      roleToSet = mernUser.role || 'Viewer';
      nameToSet = mernUser.name;
      
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        email: mernUser.email,
        name: nameToSet,
        role: roleToSet,
      });
    }

    // Return the complete, synchronized user object
    return {
      id: mernUser.id,
      uid: fbUser.uid,
      email: mernUser.email,
      name: nameToSet,
      role: roleToSet
    };
  };

  // This effect now tries to refresh the session on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // 1. Attempt to refresh the session
        // This will succeed if a valid refreshToken cookie exists
        // The interceptor in api.js will NOT catch 401s for this specific call
        const refreshRes = await api.post('/api/auth/refresh');
        const { firebaseToken } = refreshRes.data;

        // 2. Sign in to Firebase
        const fbUserCredential = await signInWithCustomToken(auth, firebaseToken);
        setFirebaseUser(fbUserCredential.user);

        // 3. Get MERN user data (we now have a valid accessToken cookie)
        const meRes = await api.get('/api/auth/me');
        const mernUser = meRes.data.data;

        // 4. Create/Sync user doc in Firestore and get the definitive user object
        const syncedUser = await createUserDocumentInFirestore(mernUser, fbUserCredential.user);
        setUser(syncedUser); // Set the synchronized user in React state

      } catch (err) {
        // This is not an error, it just means the user is not logged in
        console.log("No active session on load.");
        setUser(null);
        setFirebaseUser(null);
      }
      setIsAuthLoading(false);
    };
    checkLoggedIn();
  }, []); // Run only once on mount

  const login = async (email, password) => {
    // 1. Log in to MERN backend (cookies are set automatically by browser)
    const res = await api.post('/api/auth/login', { email, password });
    const { firebaseToken, user: mernUser } = res.data;

    // 2. Sign in to Firebase
    const fbUserCredential = await signInWithCustomToken(auth, firebaseToken);
    setFirebaseUser(fbUserCredential.user);

    // 3. Create/Sync user doc in Firestore and get the definitive user object
    const syncedUser = await createUserDocumentInFirestore(mernUser, fbUserCredential.user);
    setUser(syncedUser); // Set the synchronized user in React state
  };

  const register = async (name, email, password) => {
    // 1. Register with MERN backend (cookies are set automatically by browser)
    const res = await api.post('/api/auth/register', { name, email, password });
    const { firebaseToken, user: mernUser } = res.data;

    // 2. Sign in to Firebase
    const fbUserCredential = await signInWithCustomToken(auth, firebaseToken);
    setFirebaseUser(fbUserCredential.user);

    // 3. Create/Sync user doc in Firestore and get the definitive user object
    const syncedUser = await createUserDocumentInFirestore(mernUser, fbUserCredential.user);
    setUser(syncedUser); // Set the synchronized user in React state
  };

  const logout = async () => {
    try {
      // 1. Call the backend to clear httpOnly cookies
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error("Logout failed on backend:", err);
      // Still proceed with frontend logout
    }
    
    // 2. Sign out of Firebase
    await signOut(auth);
    
    // 3. Clear frontend state
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, isAuthLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
