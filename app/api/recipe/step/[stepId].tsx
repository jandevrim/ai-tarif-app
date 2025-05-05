// ✅ Doğru Firebase modülleri (client side için)
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/utils/firebaseconfig";

// diğer importlar aynı kalıyor
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RecipeStep() {
  const router = useRouter();
  const { stepId, ingredients } = router.query;
  const [recipe, setRecipe] = useState<{ title: string; steps: string[]; id?: string } | null>(null);
  const currentStep = parseInt(stepId as string, 10);
  const { t } = useTranslation();

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
    <div className="min-h-screen bg-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
        <p className="text-lg">
          {t("stepPage.step")} {currentStep}: {recipe.steps[currentStep - 1]}
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push(`/recipe/step/${currentStep - 1}`)}
          disabled={isFirstStep}
          className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
        >
          {t("stepPage.back")}
        </button>
        <button
          onClick={() => router.push(`/recipe/step/${currentStep + 1}`)}
          disabled={isLastStep}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {t("stepPage.next")}
        </button>
      </div>

      {isLastStep && recipe.id && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={async () => {
              try {
                const db = getFirestore(app);
                const ref = doc(db, "likedRecipes", recipe.id!);
                const snap = await getDoc(ref);
                const current = snap.exists() ? snap.data().begeniSayisi || 0 : 0;
                await updateDoc(ref, { begeniSayisi: current + 1 });
                alert("Tarifi beğendiniz ❤️");
              } catch (err) {
                console.error("Beğeni hatası:", err);
              }
            }}
            className="text-3xl hover:scale-110 transition-transform"
          >
            ❤️
          </button>
        </div>
      )}
    </div>
  );
}