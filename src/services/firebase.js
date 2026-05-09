import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signOut
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export const signInAdmin = () => {
  if (!auth) {
    return Promise.reject(new Error('Firebase is not configured.'));
  }

  return signInAnonymously(auth);
};

export const signOutAdmin = () => {
  if (!auth) {
    return Promise.resolve();
  }

  return signOut(auth);
};

export const addContactMessage = async (message) => {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  await addDoc(collection(db, 'contactMessages'), {
    ...message,
    createdAt: serverTimestamp()
  });
};

export const subscribeContactMessages = (onMessages, onError) => {
  if (!db) {
    return () => {};
  }

  const messagesQuery = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      onMessages(snapshot.docs.map((messageDoc) => {
        const data = messageDoc.data();
        const createdAt = data.createdAt?.toDate?.();

        return {
          id: messageDoc.id,
          ...data,
          date: createdAt ? createdAt.toLocaleString() : 'Now'
        };
      }));
    },
    onError
  );
};

export const archiveContactMessage = async (messageId) => {
  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  await deleteDoc(doc(db, 'contactMessages', messageId));
};
