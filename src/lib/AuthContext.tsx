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
  subscribe: (plan: 'monthly' | 'yearly') => Promise<void>;
  incrementGenerateCount: () => Promise<number>;
  isPremium: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to profile changes
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Check if profile exists, if not create it
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
              await setDoc(userDocRef, { ...data, role: 'admin' }, { merge: true });
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }

        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
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
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Domain ini belum terdaftar di Firebase Authorized Domains. Silakan tambahkan domain Vercel Anda di Firebase Console.");
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError("Popup diblokir oleh browser. Silakan izinkan popup untuk login.");
      } else {
        setAuthError("Gagal login: " + error.message);
      }
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

  const subscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const now = new Date();
      const expiry = new Date(now.getTime() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000);
      await setDoc(userDocRef, {
        subscriptionStatus: plan,
        premiumExpiredAt: expiry
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAuthError(null);
  };

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
      subscribe, 
      incrementGenerateCount, 
      isPremium: isPremium || isAdmin, 
      isAdmin 
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
