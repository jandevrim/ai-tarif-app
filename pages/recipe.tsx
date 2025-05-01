"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function Recipe() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [recipe, setRecipe] = useState<{ title: string; steps: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      const { ingredients } = router.query;
      if (!ingredients) return;

      const ingredientList = JSON.parse(ingredients as string);
      const rawLang = i18n.language;
      const lang: "tr" | "en" = rawLang.startsWith("en") ? "en" : "tr";

      try {
        const response = await fetch("/api/generate-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: ingredientList, lang }),
        });

        const data = await response.json();
        if (response.ok) {
          setRecipe(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error(t("recipe.fetchError"), error);
      } finally {
        setLoading(false);
      }
    }

    if (router.isReady) fetchRecipe();
  }, [router.isReady, router.query, i18n.language]);

  if (loading) return <div className="min-h-screen p-6">{t("recipe.loading")}</div>;
  if (!recipe) return <div className="min-h-screen p-6">{t("recipe.error")}</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">{recipe.title}</h1>
      <p className="mb-4">
        {t("recipe.ingredients")}:{" "}
        {router.query.ingredients
          ? JSON.parse(router.query.ingredients as string).join(", ")
          : ""}
      </p>
      <button
        onClick={() => router.push(`/recipe/step/1`)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        {t("recipe.startSteps")}
      </button>
    </div>
  );
}