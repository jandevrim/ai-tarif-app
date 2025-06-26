// utils/saveRecipeToLikedRecipes.ts

import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./firebaseconfig"; // yolunu uygulamana göre düzelt

const db = getFirestore(app);

export interface RecipeData {
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[];
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number;
  createdAt?: Date;
  userId: string; // ⬅️ bunu ekle
}

export const saveRecipeToLikedRecipes = async (
  recipe: RecipeData
): Promise<{ success: boolean; error?: string }> => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    await addDoc(collection(db, "likedRecipes"), {
      title: recipe.title,
      summary: recipe.summary,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cihazMarkasi: recipe.cihazMarkasi,
      tarifDili: recipe.tarifDili || "tr",
      kullaniciTarifi: true,
      begeniSayisi: 1,
      userId: user.uid,
      createdAt: new Date(),
      recipeText: (recipe.steps ?? []).join("\n")
    });

    return { success: true };
  } catch (err) {
    console.error("🔥 Recipe save error:", err);
    return { success: false, error: "Firestore error" };
  }
};