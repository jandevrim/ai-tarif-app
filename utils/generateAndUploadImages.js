import { xai } from "@ai-sdk/xai";
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

// Firebase başlatma
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

// XAI ile görsel oluşturma
async function generateImageWithXAI(title) {
  try {
    const prompt = `High-quality food photo of this recipe: ${title}`;
    
    const result = await xai.image.generate({
      model: "grok-2-image-1212",
      prompt,
      n: 1, // Tek görüntü üret
      response_format: "url", // URL olarak dön
    });

    return result.data[0].url; // API'den dönen ilk görüntünün URL'si
  } catch (error) {
    throw new Error(`XAI görsel oluşturma hatası: ${error.message}`);
  }
}

// Ana fonksiyon
async function generateAndUploadImages() {
  try {
    // Firestore'dan tarifleri al
    const snapshot = await getDocs(collection(db, "likedRecipes"));
    const filtered = snapshot.docs.filter(doc => !doc.data().imageUrl);
    console.log(`🧾 Toplam tarif: ${snapshot.docs.length}`);
    console.log(`🔎 Eksik görselli tarif: ${filtered.length}`);

    if (filtered.length === 0) {
      console.log("✅ Tüm tariflerde görsel mevcut.");
      return { success: true, message: "Tüm tariflerde görsel mevcut." };
    }

    const recipe = { id: filtered[0].id, ...filtered[0].data() };
    console.log("🎯 İşlenecek tarif:", recipe.title);

    // XAI ile görsel üret
    const imageUrl = await generateImageWithXAI(recipe.title);

    // Görseli indir
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Görsel indirme hatası: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Firebase Storage'a yükle
    const imagePath = `recipe_images/${recipe.id}.jpg`;
    const storageRef = ref(storage, imagePath);
    await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
    const downloadURL = await getDownloadURL(storageRef);

    // Firestore'u güncelle
    await updateDoc(doc(db, "likedRecipes", recipe.id), {
      imageUrl: downloadURL,
    });

    console.log(`✅ Başarıyla yüklendi ve güncellendi: ${recipe.title}`);
    return { success: true, message: `Görsel ${recipe.title} için yüklendi.` };
  } catch (err) {
    console.error(`❌ Hata [${recipe?.title || "Bilinmeyen"}]:`, err.message || err);
    throw err; // Vercel loglarında görünmesi için
  }
}

// Vercel API rotası
export default async function handler(req, res) {
  try {
    const result = await generateAndUploadImages();
    res.status(200).json(result || { success: true, message: "İşlem tamamlandı" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Sunucu hatası" });
  }
}