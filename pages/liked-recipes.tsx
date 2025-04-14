// ✅ pages/liked-recipes.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Recipe {
  title: string;
  summary: string;
  duration: string;
  ingredients: string[];
  steps: string[];
}

export default function LikedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('likedRecipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecipes(parsed);
        }
      } catch (err) {
        console.error("Veri okunurken hata:", err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        onClick={() => router.push('/landing')}
        className="mb-4 bg-gray-300 px-4 py-2 rounded-full text-sm"
      >
        ← Ana Sayfa
      </button>

      <h1 className="text-2xl font-bold mb-4">💚 Beğenilen Tarifler</h1>

      {recipes.length === 0 ? (
        <p>Henüz beğenilen bir tarif yok.</p>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe, index) => (
            <div key={index} className="border p-4 rounded bg-gray-50 shadow">
              <h2 className="text-xl font-semibold mb-1">{recipe.title}</h2>
              <p className="italic text-sm mb-2">{recipe.summary}</p>
              <p><strong>Süre:</strong> {recipe.duration}</p>
              <h3 className="font-medium mt-2">Malzemeler:</h3>
              <ul className="list-disc list-inside text-sm">
                {recipe.ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h3 className="font-medium mt-2">Adımlar:</h3>
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
}