// ✅ 1. localStorage'a beğeni kaydetmek için yardımcı fonksiyonlar
export const saveLikedRecipe = (recipe: any) => {
  const saved = localStorage.getItem("likedRecipes");
  const existing = saved ? JSON.parse(saved) : [];
  const updated = [...existing, recipe];
  localStorage.setItem("likedRecipes", JSON.stringify(updated));
};

export const getLikedRecipes = (): any[] => {
  const saved = localStorage.getItem("likedRecipes");
  return saved ? JSON.parse(saved) : [];
};

// ✅ 2. Beğeni bileşeni (Tarif son adımında gösterilecek)
import React from "react";

export const RecipeFeedback = ({ recipe }: { recipe: any }) => {
  const handleLike = () => {
    saveLikedRecipe(recipe);
    alert("Tarif beğenildi ve kaydedildi!");
  };

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600 mb-2">Tarifi beğendiniz mi?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleLike}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          👍 Beğendim
        </button>
        <button
          onClick={() => alert("Bir dahakine daha iyisini sunacağız!")}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400"
        >
          👎 Beğenmedim
        </button>
      </div>
    </div>
  );
};

// ✅ 3. /pages/liked-recipes.tsx bileşeni (Listeleme sayfası)
import React, { useEffect, useState } from "react";
import { getLikedRecipes } from "../utils/likedRecipes";

const LikedRecipesPage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const liked = getLikedRecipes();
    setRecipes(liked);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💚 Beğenilen Tarifler</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-500">Henüz beğenilen tarif bulunamadı.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <h2 className="font-bold text-lg mb-1">{recipe.title}</h2>
              <p className="text-sm italic mb-2">{recipe.summary}</p>
              <p><strong>Süre:</strong> {recipe.duration}</p>
              <p className="mt-2 font-semibold">Malzemeler:</p>
              <ul className="list-disc list-inside text-sm">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedRecipesPage;
