// utils/extractIngredientsFromRecipes.js
require("dotenv").config();

const fs = require("fs");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const { app } = require("./firebase");

function normalizeIngredient(text) {
  const cleaned = text
    .toLowerCase()
    .replace(/\b\d+[.,\d]*\b/g, "") // sayıları sil
    .replace(/\b(yemek|tatlı|çay|su)?\s?(kaşığı|bardağı|adet|gr|g|kg|ml|l|bardak|kase|paket|çimdik|tutam|dilim|parça|diş|kup|fincan|avuç|porsiyon|top)\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,-]+|[\s,-]+$/g, "")
    .trim();
  return cleaned;
}

async function extractIngredients() {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "likedRecipes"));
  const allIngredients = new Set();

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [];
    ingredients.forEach((item) => {
      const normalized = normalizeIngredient(item);
      if (normalized && normalized.length > 1) {
        allIngredients.add(normalized);
      }
    });
  });

  const sortedList = Array.from(allIngredients).sort((a, b) => a.localeCompare(b, "tr"));
  fs.writeFileSync("./extracted_ingredients.txt", sortedList.join("\n"), "utf-8");
  console.log(`✅ ${sortedList.length} benzersiz malzeme './extracted_ingredients.txt' dosyasına yazıldı.`);
}

extractIngredients();
