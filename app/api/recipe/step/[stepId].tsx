// pages/recipe/step/[stepId].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RecipeStep() {
  const router = useRouter();
  const { stepId, ingredients } = router.query;
  const [recipe, setRecipe] = useState<{ title: string; steps: string[] } | null>(null);
  const currentStep = parseInt(stepId as string, 10);

  useEffect(() => {
    async function fetchRecipe() {
      if (!ingredients) return;

      const ingredientList = JSON.parse(ingredients as string);

      try {
        const response = await fetch("/api/generate-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: ingredientList }),
        });
        const data = await response.json();
        if (response.ok) {
          setRecipe(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Tarif alınırken hata oluştu:", error);
      }
    }

    if (router.isReady && !recipe) fetchRecipe();
  }, [router.isReady, ingredients]);

  if (!recipe) return <div className="min-h-screen p-6">Yükleniyor...</div>;

  const totalSteps = recipe.steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
      <div className="mb-4">
        <p className="text-lg">Adım {currentStep}: {recipe.steps[currentStep - 1]}</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => router.push(`/recipe/step/${currentStep - 1}`)}
          disabled={isFirstStep}
          className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
        >
          Geri
        </button>
        <button
          onClick={() => router.push(`/recipe/step/${currentStep + 1}`)}
          disabled={isLastStep}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          İleri
        </button>
      </div>
    </div>
  );
}