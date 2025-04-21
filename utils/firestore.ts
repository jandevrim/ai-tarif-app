import { db } from "./firebaseconfig"; // 🔥 sadece import
import { collection, addDoc } from "firebase/firestore";

interface LikedRecipe {
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

export async function saveLikedRecipeToServer(recipe: LikedRecipe): Promise<string> {
  try {
    console.log(db);
    const docRef = await addDoc(collection(db, "likedRecipes"), {
      ...recipe,
      createdAt: new Date(),
      steps: recipe.steps || [],
      cihazMarkasi: recipe.cihazMarkasi || "tumu",
      tarifDili: recipe.tarifDili || "tr",
      kullaniciTarifi: recipe.kullaniciTarifi ?? false,
      begeniSayisi: recipe.begeniSayisi ?? 1,
      userId: recipe.userId, // ⬅️ bu satır kritik
    });
    return docRef.id;
  } catch (error) {
    console.error("Tarif kaydedilirken hata oluştu:", error);
    throw error;
  }
}