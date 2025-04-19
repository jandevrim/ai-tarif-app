// utils/clearIngredients.js
require("dotenv").config();

const { getFirestore, collection, getDocs, deleteDoc, doc } = require("firebase/firestore");
const { app } = require("./firebase");

async function clearIngredientsCollection() {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "ingredients"));
  console.log(`🧹 ${snapshot.docs.length} malzeme siliniyor...`);

  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "ingredients", d.id));
    console.log(`❌ Silindi: ${d.id}`);
  }

  console.log("✅ ingredients koleksiyonu tamamen temizlendi.");
}

clearIngredientsCollection();