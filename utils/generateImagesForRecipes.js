// utils/generateImagesForRecipes.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, getDocs, updateDoc, collection, doc } from "firebase/firestore";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateImage(title) {
  try {
    const prompt = `Yemek sunumu: ${title}. Yüksek kaliteli, arka planı sade, sadece yemek fotoğrafı.`;
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = response?.data?.[0]?.url;
    if (!imageUrl) throw new Error("Image URL alınamadı.");
    return imageUrl;
  } catch (err) {
    console.error(`❌ Görsel üretilemedi (${title}):`, err.message);
    return null;
  }
}

async function updateRecipesWithImages() {
  const snapshot = await getDocs(collection(db, "likedRecipes"));

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (!data.image && data.title) {
      console.log(`🎨 Görsel oluşturuluyor: ${data.title}`);
      const imageUrl = await generateImage(data.title);

      if (imageUrl) {
        await updateDoc(doc(db, "likedRecipes", docSnap.id), { image: imageUrl });
        console.log(`✅ ${data.title} updated with image`);
      } else {
        console.warn(`⚠️ ${data.title} için görsel oluşturulamadı.`);
      }
    }
  }
}

updateRecipesWithImages().catch((err) => {
  console.error("🔥 Ana işlem hatası:", err.message);
});