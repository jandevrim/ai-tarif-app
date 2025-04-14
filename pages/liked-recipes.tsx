// ✅ pages/liked-recipes.tsx
import React, { useEffect, useState } from "react";

interface Recipe {
  title: string;
  summary: string;
  duration: string;
  ingredients: string[];
  steps: string[];
}

const LikedRecipesPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("likedRecipes");
    if (stored) {
      try {
        setRecipes(JSON.parse(stored));
      } catch (e) {
        console.error("Liked recipe parse error:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-blue-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">💚 Beğenilen Tarifler</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-600">Henüz beğenilen tarif yok.</p>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="bg-white rounded shadow p-4">
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              <p className="italic text-sm text-gray-500">{recipe.summary}</p>
              <p className="text-sm mt-2">⏱️ <strong>{recipe.duration}</strong></p>
              <h3 className="mt-3 font-semibold">Malzemeler:</h3>
              <ul className="list-disc list-inside text-sm">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <h3 className="mt-3 font-semibold">Adımlar:</h3>
              <ol className="list-decimal list-inside text-sm">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedRecipesPage;
