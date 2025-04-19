// utils/extractIngredientsFromRecipes.ts
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "./firebaseconfig";

async function extractUniqueIngredients() {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "likedRecipes"));

  const uniqueSet = new Set<string>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const ingredients: string[] = data.ingredients || [];
    ingredients.forEach((i) => {
      const trimmed = i.trim();
      if (trimmed.length > 0) {
        uniqueSet.add(trimmed);
      }
    });
  });

  const ingredientArray = Array.from(uniqueSet).sort().map((name, index) => ({
    id: `ing_${index + 1}`,
    name: { tr: name, en: "" },
    category: "",
    tags: [],
    emoji: ""
  }));

  const outputPath = path.join(__dirname, "../data/ingredients.ts");
  const fileContent = `export const ingredients = ${JSON.stringify(ingredientArray, null, 2)};\n`;
  fs.writeFileSync(outputPath, fileContent, "utf-8");

  console.log(`✅ ${ingredientArray.length} malzeme ingredients.ts dosyasına yazıldı.`);
}

extractUniqueIngredients();
