// utils/generateAndUploadImages.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fetch from "node-fetch";
import OpenAI from "openai";


// Firebase config
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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImage(title) {
  const response = await openai.images.generate({
    prompt: `High-quality food photo of this recipe: ${title}`,
    n: 1,
    size: "1024x1024",
  });
  return response.data[0].url;
}

export async function generateAndUploadImages() {
  const snapshot = await getDocs(collection(db, "likedRecipes"));

  for (const docSnap of snapshot.docs) {
    const recipe = { id: docSnap.id, ...docSnap.data() };

    if (recipe.imageUrl && recipe.imageUrl.includes("firebase")) {
      console.log(`✅ Atlaniyor (zaten var): ${recipe.title}`);
      continue;
    }

    try {
      console.log(`⏳ Olusturuluyor: ${recipe.title}`);
      const imageUrl = await generateImage(recipe.title);
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();

      const imagePath = `recipe_images/${recipe.id}.jpg`;
      const storageRef = ref(storage, imagePath);
      await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "likedRecipes", recipe.id), {
        imageUrl: downloadURL,
      });

      console.log(`✅ Yüklendi: ${recipe.title}`);
    } catch (err) {
      console.error(`❌ HATA [${recipe.title}]:`, err.message);
    }
  }
}

generateAndUploadImages();