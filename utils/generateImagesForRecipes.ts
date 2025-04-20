import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateImage(title: string): Promise<string> {
  const response = await openai.images.generate({
    prompt: `A beautifully plated dish of ${title}, from a top-down angle, on a modern kitchen table, soft lighting`,
    n: 1,
    size: "1024x1024",
  });
  return response.data[0].url!;
}

(async () => {
  const snapshot = await getDocs(collection(db, "likedRecipes"));
  for (const d of snapshot.docs) {
    const recipe = d.data();
    if (!recipe.imageUrl) {
      const url = await generateImage(recipe.title);
      await updateDoc(doc(db, "likedRecipes", d.id), { imageUrl: url });
      console.log(`🖼️ Image added to ${recipe.title}`);
    }
  }
})();