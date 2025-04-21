import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Uygulamayı başlat
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics (opsiyonel)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

// Firestore instance
const db = getFirestore(app);

// Kredi azaltıcı fonksiyon
export const decrementRecipeCredit = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    recipeCredits: increment(-1),
  });
};

export { app, db };
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();