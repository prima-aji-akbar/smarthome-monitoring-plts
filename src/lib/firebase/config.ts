import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
// 1. Ubah getFirestore menjadi initializeFirestore
import { initializeFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app: FirebaseApp = getApps().length > 0 
  ? getApps()[0] 
  : initializeApp(firebaseConfig);

const database: Database = getDatabase(app);

const firestore: Firestore = initializeFirestore(app, {
  ignoreUndefinedProperties: true
});

const auth: Auth = getAuth(app);

export { app, database, auth, firestore }; // 3. Pastikan firestore diekspor