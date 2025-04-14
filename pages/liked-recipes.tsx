import React, { useEffect, useState } from "react";
import { getLikedRecipes } from "../utils/storage";

const liked = getLikedRecipes();

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
