// 📦 Updated Batch script for syncing OpenAI image links to Firebase Storage

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

(async function syncImages() {
  const snapshot = await getDocs(collection(db, "likedRecipes"));
  const recipes = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  for (const recipe of recipes) {
    const imageUrl = recipe.image || recipe.imageUrl;

    if (!imageUrl || imageUrl.includes("firebasestorage") || imageUrl.includes("storage.googleapis.com")) {
      console.log(`✅ Atlaniyor: ${recipe.title}`);
      continue;
    }

    try {
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();

      const imagePath = `recipe_images/${recipe.id}.jpg`;
      const storageRef = ref(storage, imagePath);

      await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = doc(db, "likedRecipes", recipe.id);
      await updateDoc(docRef, { image: downloadURL });

      console.log(`✅ Güncellendi: ${recipe.title}`);
    } catch (err) {
      console.error(`❌ HATA [${recipe.title}]:`, err.message);
    }
  }
})();