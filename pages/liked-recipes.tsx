import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { app } from "../utils/firebaseconfig";

const db = getFirestore(app);

interface Recipe {
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[];
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  begeniSayisi?: number;
  id?: string;
}

const LikedRecipesPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">("tumu");

  const getLikedRecipesFromFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "likedRecipes"));
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Recipe));
      setRecipes(data);
    } catch (err) {
      console.error("Tarifler alınırken hata:", err);
    }
  };

  useEffect(() => {
    getLikedRecipesFromFirebase();
  }, []);

  const handleLike = async (id: string | undefined, index: number) => {
    if (!id) return;
    try {
      const recipeRef = doc(db, "likedRecipes", id);
      const currentCount = recipes[index].begeniSayisi || 0;
      await updateDoc(recipeRef, { begeniSayisi: currentCount + 1 });
      const updated = [...recipes];
      updated[index].begeniSayisi = currentCount + 1;
      setRecipes(updated);
    } catch (err) {
      console.error("Beğeni artırılırken hata:", err);
    }
  };

  const filteredRecipes = recipes.filter(
    (r) => filter === "tumu" || r.cihazMarkasi === filter
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans">
      <button
        onClick={() => onNavigate("/landing")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow"
      >
        &larr; Geri Dön
      </button>

      <h1 className="text-2xl font-bold mb-4">💚 Beğenilen Tarifler</h1>

      <div className="flex gap-2 mb-4">
        {(["tumu", "thermomix", "thermogusto"] as const).map((marka) => (
          <button
            key={marka}
            onClick={() => setFilter(marka)}
            className={`px-3 py-1 rounded-full text-sm font-medium shadow ${
              filter === marka ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {marka === "tumu" ? "Tümü" : marka.charAt(0).toUpperCase() + marka.slice(1)}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">Henüz beğenilen tarif bulunamadı.</p>
      ) : (
        <ul className="space-y-4">
          {filteredRecipes.map((recipe, idx) => (
            <li key={idx} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg mb-1">{recipe.title}</h2>
                <span className="text-xs text-gray-500">💚 {recipe.begeniSayisi || 0}</span>
              </div>
              <p className="text-sm italic mb-2">{recipe.duration}</p>
              <p className="font-semibold">Malzemeler:</p>
              <ul className="list-disc list-inside text-sm">
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                ) : (
                  <li className="italic text-gray-400">Malzeme listesi yok</li>
                )}
              </ul>
              <button
                onClick={() =>
                  setSelectedRecipeIndex(selectedRecipeIndex === idx ? null : idx)
                }
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                {selectedRecipeIndex === idx ? "Tarifi Gizle" : "Tarifi Göster"}
              </button>
              {selectedRecipeIndex === idx && (
                <div className="mt-2 border-t pt-2">
                  <p className="font-semibold">Hazırlık Adımları:</p>
                  <ul className="list-decimal list-inside text-sm">
                    {recipe.steps?.map((step, sIdx) => <li key={sIdx}>{step}</li>) || ( <li>Adım verisi yok</li> )}
                  </ul>
                </div>
              )}
              <div className="mt-3 text-right">
                <button
                  onClick={() => handleLike(recipe.id, idx)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs shadow"
                >
                  +1 Beğeni
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedRecipesPage;