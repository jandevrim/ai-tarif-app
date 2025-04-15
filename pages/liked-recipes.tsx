import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../utils/firebaseconfig"; // küçük harfli olan dosya adıyla
const db = getFirestore(app);


const LikedRecipesPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const db = getFirestore(app);

  // Firebase'den beğenilen tarifleri al
  const getLikedRecipesFromFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "likedRecipes"));
      const data = snapshot.docs.map(doc => doc.data());
      setRecipes(data);
    } catch (err) {
      console.error("Tarifler alınırken hata:", err);
    }
  };

  useEffect(() => {
    getLikedRecipesFromFirebase();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans">
      <button
        onClick={() => onNavigate("/landing")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow"
      >
        &larr; Geri Dön
      </button>

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
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing: string, i: number) => (
                    <li key={i}>{ing}</li>
                  ))
                ) : (
                  <li className="italic text-gray-400">Malzeme listesi bulunamadı.</li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedRecipesPage;