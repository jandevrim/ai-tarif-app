// ✅ pages/custom.tsx – Kart yapısı ile adım adım tarif (2025-04-10)

import React, { useState } from "react";
import IngredientSelector, { Ingredient } from "../components/IngredientSelector";

export default function CustomRecipePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [showSelector, setShowSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setCurrentStep(0);

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Sunucu hatası");

      setRecipe(data.result);
    } catch (err: any) {
      setError(err.message || "Tarif oluşturulamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Kendi Tarifini Oluştur</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedIngredients.map((i) => (
          <span key={i.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {i.emoji} {i.name.tr}
          </span>
        ))}
      </div>

      <button
        onClick={() => setShowSelector(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Malzeme Ekle
      </button>

      {showSelector && (
        <IngredientSelector
          selected={selectedIngredients}
          onSelect={handleSelectIngredient}
          onClose={() => setShowSelector(false)}
        />
      )}

      <button
        onClick={handleGenerateRecipe}
        disabled={isLoading || selectedIngredients.length === 0}
        className="bg-green-600 text-white px-6 py-2 rounded shadow"
      >
        {isLoading ? "Oluşturuluyor..." : "Tarif Oluştur"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {recipe && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          {currentStep === 0 ? (
            <>
              <h2 className="text-xl font-bold mb-2">📋 {recipe.title}</h2>
              <p className="italic text-sm mb-2">{recipe.summary}</p>
              <p><strong>Süre:</strong> {recipe.duration}</p>
              <h3 className="font-semibold mt-4">Malzemeler:</h3>
              <ul className="list-disc list-inside mb-4">
                {recipe.ingredients.map((ing: string, idx: number) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Adımları Gör
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">
                🍳 Hazırlık Adımı {currentStep} / {recipe.steps.length}
              </h2>
              <p className="mb-4">{recipe.steps[currentStep - 1]}</p>
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Geri
                  </button>
                )}
                {currentStep < recipe.steps.length ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Sonraki
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Baştan Göster
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}