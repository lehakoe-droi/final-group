import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      try { localStorage.removeItem('token'); } catch {}
      try { localStorage.removeItem('userType'); } catch {}
      try { localStorage.removeItem('userId'); } catch {}
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      // Clear token and user even if signOut fails
      try { localStorage.removeItem('token'); } catch {}
      try { localStorage.removeItem('userType'); } catch {}
      try { localStorage.removeItem('userId'); } catch {}
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in — fetch Firestore profile to include userType
        (async () => {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc && userDoc.exists() ? userDoc.data() : {};

            setCurrentUser({
              uid: user.uid,
              email: user.email,
              userType: userData.userType || localStorage.getItem('userType') || null,
              profile: userData.profileData || null
            });

            // Store token and role for API requests and quick access
            try {
              const idToken = await user.getIdToken();
              localStorage.setItem('token', idToken);
            } catch {}
            try { if (userData.userType) localStorage.setItem('userType', userData.userType); } catch {}
            try { localStorage.setItem('userId', user.uid); } catch {}
          } catch (err) {
            // If Firestore read fails, set minimal user and still store token
            setCurrentUser({ uid: user.uid, email: user.email });
            try { const idToken = await user.getIdToken(); localStorage.setItem('token', idToken); } catch {}
          }
        })();
      } else {
        // User is signed out
        try { localStorage.removeItem('token'); } catch {}
        try { localStorage.removeItem('userType'); } catch {}
        try { localStorage.removeItem('userId'); } catch {}
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
