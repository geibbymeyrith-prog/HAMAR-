import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
// @ts-ignore
import firebaseConfig from '../../firebase-applet-config.json';

// Smart branded custom authDomain fallback for production vs development preview
const isProdCustomDomain = typeof window !== 'undefined' && window.location.hostname === 'hamare.halokabhagya.com';
const resolvedFirebaseConfig = {
  ...firebaseConfig,
  authDomain: isProdCustomDomain ? 'hamare.halokabhagya.com' : firebaseConfig.authDomain
};

const app = initializeApp(resolvedFirebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
