// pages/api/generate-images.js
import OpenAI from "openai";
import { getApps, initializeApp, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// XAI (Grok) için OpenAI istemcisi
const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1", // 🔥 Bu satır önemli!
});

async function generateImageWithXAI(title, ingredientList) {
  const prompt = `Minimalist top-down line drawing of a healthy Turkish dish named "${title}". Ingredients include: ${ingredientList}. Use soft green and beige colors. Instagram look. Optimize for fast generation. Make sure that it fits the description of the food.`;
  const result = await openai.images.generate({
    model: "grok-2-image",
    prompt,
    n: 1,
    response_format: "url",
  });

  return result.data[0].url;
}



async function generateAndUploadImages() {
  const snapshot = await getDocs(collection(db, "likedRecipes"));
  const filtered = snapshot.docs.filter(doc => !doc.data().imageUrl);
  console.log(`🧾 Tarif sayısı: ${snapshot.docs.length}`);
  console.log(`🔎 Eksik görselli tarif: ${filtered.length}`);

  if (filtered.length === 0) {
    console.log("✅ Tüm tariflerde görsel mevcut.");
    return;
  }
  const recipe = { id: filtered[0].id, ...filtered[0].data() };
  console.log("🎯 İşlenecek tarif:", recipe.title);

  const imageUrl = await generateImageWithXAI(recipe.title, recipe.ingredientList);
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  const imagePath = `recipe_images/${recipe.id}.jpg`;
  const storageRef = ref(storage, imagePath);
  await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
  const downloadURL = await getDownloadURL(storageRef);

  await updateDoc(doc(db, "likedRecipes", recipe.id), { imageUrl: downloadURL });
  console.log(`✅ Yüklendi: ${recipe.title}`);
}

export default async function handler(req, res) {
  try {
    await generateAndUploadImages();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Hata:", err.message || err);
    res.status(500).json({ success: false, error: err.message || "Sunucu hatası" });
  }
}