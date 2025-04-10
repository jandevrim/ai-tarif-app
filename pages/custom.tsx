import React, { useState } from "react";
import IngredientSelector, { Ingredient } from "../components/IngredientSelector";

export default function CustomRecipePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [showSelector, setShowSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setStepIndex(0);

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

  const renderCard = () => {
    if (!recipe) return null;

    if (stepIndex === 0) {
      return (
        <div className="bg-white p-4 rounded shadow whitespace-pre-wrap">
          <h2 className="text-xl font-bold mb-2">📋 {recipe.title}</h2>
          <p className="italic text-sm mb-2">{recipe.summary}</p>
          <p><strong>⏱️ Süre:</strong> {recipe.duration}</p>
          <h3 className="font-semibold mt-4">🧂 Malzemeler:</h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ing: string, idx: number) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-4 rounded shadow whitespace-pre-wrap">
          <h2 className="text-lg font-bold mb-2">🧑‍🍳 Adım {stepIndex}</h2>
          <p>{recipe.steps[stepIndex - 1]}</p>
        </div>
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kendi Tarifini Oluştur</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedIngredients.map((i) => (
          <span key={i.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {i.emoji} {i.name.tr}
          </span>
        ))}
      </div>

      {!recipe && (
        <>
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
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {recipe && (
        <div className="mt-6">
          {renderCard()}
          <div className="flex justify-between mt-4">
            <button
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((prev) => prev - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
            >
              ⬅️ Geri
            </button>
            <button
              disabled={stepIndex === recipe.steps.length}
              onClick={() => setStepIndex((prev) => prev + 1)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              İleri ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}