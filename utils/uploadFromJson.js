// utils/uploadFromJson.js
require("dotenv").config();

const fs = require("fs");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { app } = require("./firebase");

async function uploadFromJson() {
  const db = getFirestore(app);
  const raw = fs.readFileSync("./data/ingredients.json", "utf-8");
  const ingredients = JSON.parse(raw);

  for (const ing of ingredients) {
    try {
      await addDoc(collection(db, "ingredients"), ing);
      console.log("✅ Yüklendi:", ing.name.tr);
    } catch (err) {
      console.error("❌ Hata:", ing.name.tr, err.message || err);
    }
  }
  console.log("🎉 JSON'dan yükleme tamamlandı.");
}

uploadFromJson();