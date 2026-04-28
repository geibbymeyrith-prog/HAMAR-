import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  whatsapp?: string;
  birthDate?: {
    day: string;
    month: string;
    year: string;
  };
  role: 'user' | 'admin';
  subscriptionStatus: 'free' | 'monthly' | 'yearly';
  subscriptionEndDate?: any;
  premiumExpiredAt?: any;
  generateCount: number;
  temporaryUnlock?: boolean;
  createdAt: any;
}

interface HistoryItem {
  userId: string;
  type: 'weton' | 'jodoh' | 'hariBaik';
  label: string;
  details: any;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  saveHistory: (type: 'weton' | 'jodoh' | 'hariBaik', label: string, details: any) => Promise<void>;
  incrementGenerateCount: () => Promise<number>;
  isPremium: boolean;
  isAdmin: boolean;
  isExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clear existing profile listener if switching users
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = undefined;
      }

      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to profile changes
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Initial setup for profile if it doesn't exist
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: firebaseUser.email === 'geibbymeyrith@gmail.com' ? 'admin' : 'user',
              subscriptionStatus: 'free',
              generateCount: 0,
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfile);
          } else {
            // Ensure admin role for specific user if they already exist
            const data = userDoc.data() as UserProfile;
            if (firebaseUser.email === 'geibbymeyrith@gmail.com' && data.role !== 'admin') {
              await updateDoc(userDocRef, { role: 'admin' });
            }
          }
        } catch (error) {
          console.error("Profile setup error:", error);
        }

        unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile snapshot error:", error);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const login = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login Error:", error);
      let message = "Gagal login: " + error.message;
      if (error.code === 'auth/unauthorized-domain') {
        message = "Domain ini belum terdaftar di Authorized Domains Firebase. Silakan hubungi admin.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Metode Google Sign-In belum diaktifkan di Firebase Console. Silakan aktifkan di tab Authentication > Sign-in method.";
      } else if (error.code === 'auth/popup-blocked') {
        message = "Popup diblokir oleh browser. Silakan izinkan popup untuk login.";
      } else if (error.code === 'auth/cancelled-by-user') {
        return; // Silent resolve for cancellation
      }
      
      setAuthError(message);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Login Email Error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError("Email atau password salah.");
      } else {
        setAuthError("Gagal login: " + error.message);
      }
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: name,
        role: 'user',
        subscriptionStatus: 'free',
        generateCount: 0,
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newProfile);
      setProfile(newProfile);
    } catch (error: any) {
      console.error("Register Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError("Email sudah terdaftar. Silakan masuk.");
      } else {
        setAuthError("Gagal mendaftar: " + error.message);
      }
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const saveHistory = async (type: 'weton' | 'jodoh' | 'hariBaik', label: string, details: any) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'history'), {
        userId: user.uid,
        type,
        label,
        details,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'history');
    }
  };

  const incrementGenerateCount = async () => {
    if (!user || !profile) return profile?.generateCount || 0;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newCount = (profile.generateCount || 0) + 1;
      await setDoc(userDocRef, {
        generateCount: newCount
      }, { merge: true });
      return newCount;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      return profile.generateCount || 0;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthError(null);
  };

  const isExpired = profile ? (
    profile.subscriptionStatus !== 'free' &&
    profile.premiumExpiredAt && (
      typeof profile.premiumExpiredAt.toDate === 'function' 
        ? profile.premiumExpiredAt.toDate() < new Date() 
        : new Date(profile.premiumExpiredAt) < new Date()
    )
  ) : false;

  const isPremium = profile ? (
    profile.role === 'admin' || 
    (profile.premiumExpiredAt && (
      typeof profile.premiumExpiredAt.toDate === 'function' 
        ? profile.premiumExpiredAt.toDate() > new Date() 
        : new Date(profile.premiumExpiredAt) > new Date()
    )) ||
    profile.temporaryUnlock === true
  ) : false;
  const isAdmin = profile?.role === 'admin' || user?.email === 'geibbymeyrith@gmail.com';

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      authError, 
      login, 
      loginWithEmail,
      registerWithEmail,
      logout, 
      updateProfile,
      saveHistory,
      incrementGenerateCount, 
      isPremium, 
      isAdmin,
      isExpired
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
