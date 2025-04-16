// ✅ pages/liked-recipes.tsx
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../utils/firebaseconfig";

const db = getFirestore(app);

interface Recipe {
  id: string;
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[] | string;
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number;
}

const LikedRecipesPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">("tumu");

  const fetchRecipes = async () => {
    const snapshot = await getDocs(collection(db, "likedRecipes"));
    const data = snapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      console.log("🔎 TARİF VERİSİ:", d.title, d.steps);
      return {
        id: docSnap.id,
        ...d,
      };
    }) as Recipe[];
    setRecipes(data);
  };

  const handleLike = async (id: string, currentCount: number = 0) => {
    const ref = doc(db, "likedRecipes", id);
    try {
      await updateDoc(ref, { begeniSayisi: (currentCount ?? 0) + 1 });
      fetchRecipes();
    } catch (err) {
      console.error("Beğeni güncellenemedi", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((r) =>
    filter === "tumu" ? true : r.cihazMarkasi === filter
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

      <div className="mb-4 flex gap-2">
        {["tumu", "thermomix", "thermogusto"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as any)}
            className={`px-4 py-2 rounded-full shadow-sm border ${
              filter === c ? "bg-green-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {c === "tumu" ? "Tümü" : c === "thermomix" ? "Thermomix" : "ThermoGusto"}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">Filtreye uygun tarif bulunamadı.</p>
      ) : (
        <ul className="space-y-6">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id} className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"}
              </p>
              <p className="text-sm text-gray-600 mb-1 font-semibold">Malzemeler:</p>
              <ul className="list-disc list-inside mb-2 text-sm">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    setExpanded((prev) => ({ ...prev, [recipe.id]: !prev[recipe.id] }));
                    console.log("Tarif adımları:", recipe.steps);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expanded[recipe.id] ? "Tarifi Gizle" : "Tarifi Göster"}
                </button>
                <button
                  onClick={() => handleLike(recipe.id, recipe.begeniSayisi)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow"
                >
                  👍 {recipe.begeniSayisi ?? 0}
                </button>
              </div>

              {expanded[recipe.id] && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-1">Hazırlık Adımları:</h3>
                  <ul className="list-decimal list-inside text-sm">
                    {(() => {
                      let stepsArray: string[] = [];
                      if (Array.isArray(recipe.steps)) {
                        stepsArray = recipe.steps.filter((s) => typeof s === "string" && s.trim() !== "");
                      } else if (typeof recipe.steps === "string") {
                        stepsArray = recipe.steps
                          .split(/\d+\.\s+/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                      }
                      return stepsArray.length > 0 ? (
                        stepsArray.map((step, i) => <li key={i}>{step}</li>)
                      ) : (
                        <li className="italic text-gray-400">Adım verisi yok</li>
                      );
                    })()}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedRecipesPage;
