// pages/recipe.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Recipe() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<{ title: string; steps: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      const { ingredients } = router.query;
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
      } finally {
        setLoading(false);
      }
    }

    if (router.isReady) fetchRecipe();
  }, [router.isReady, router.query]);

  if (loading) return <div className="min-h-screen p-6">Tarif yükleniyor...</div>;
  if (!recipe) return <div className="min-h-screen p-6">Tarif oluşturulamadı.</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
      <p className="mb-4">Malzemeler: {router.query.ingredients ? JSON.parse(router.query.ingredients as string).join(", ") : ""}</p>
      <button
        onClick={() => router.push(`/recipe/step/1`)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Adımlara Başla
      </button>
    </div>
  );
}