interface LikedRecipe {
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[]; // ✅ Ekli olmalı
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number;
  createdAt?: Date;
}

export async function saveLikedRecipeToServer(recipe: LikedRecipe): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "likedRecipes"), {
      ...recipe,
      createdAt: new Date(),
      steps: recipe.steps || [], // ✅ ÖZELLİKLE BUNU EKLE
      cihazMarkasi: recipe.cihazMarkasi || "tumu",
      tarifDili: recipe.tarifDili || "tr",
      kullaniciTarifi: recipe.kullaniciTarifi ?? false,
      begeniSayisi: recipe.begeniSayisi ?? 1,
    });
    return docRef.id;
  } catch (error) {
    console.error("Tarif kaydedilirken hata oluştu:", error);
    throw error;
  }
}