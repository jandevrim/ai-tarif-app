// 🔁 Değişiklik yapılmış tam bileşen

"use client";

import React, { useEffect, useState } from "react";
import AuthFooter from "../components/AuthFooter";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  doc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { app } from "../utils/firebaseconfig";
import { useTranslation } from "react-i18next";

const db = getFirestore(app);

interface Recipe {
  id: string;
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[];
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number;
  imageUrl?: string;
  image?: string;
}

const LikedRecipesPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">("tumu");
  const [search, setSearch] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("en") ? "en" : "tr";

  const fetchRecipes = async (isNextPage = false) => {
    setLoading(true);

    const pageSize = 10;
    const baseQuery = collection(db, "likedRecipes");

    const q = isNextPage && lastDoc
      ? query(baseQuery, orderBy("title"), startAfter(lastDoc), limit(pageSize))
      : query(baseQuery, orderBy("title"), limit(pageSize));

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const data = docs.map((docSnap) => {
      const raw = docSnap.data();
      const processedSteps = Array.isArray(raw.steps)
        ? raw.steps
        : typeof raw.steps === "string"
        ? raw.steps.split(/\d+\.\s/).filter(Boolean).map((s: string) => s.trim())
        : [];

      return {
        id: docSnap.id,
        title: raw.title,
        summary: raw.summary,
        duration: raw.duration,
        ingredients: raw.ingredients || [],
        steps: processedSteps,
        cihazMarkasi: raw.cihazMarkasi,
        tarifDili: raw.tarifDili,
        kullaniciTarifi: raw.kullaniciTarifi,
        begeniSayisi: raw.begeniSayisi,
        imageUrl: raw.imageUrl,
        image: raw.image,
      };
    });

    setRecipes((prev) => isNextPage ? [...prev, ...data] : data);
    setLastDoc(docs[docs.length - 1]);
    setLoading(false);
  };

  const handleLike = async (id: string, currentCount: number = 0) => {
    const ref = doc(db, "likedRecipes", id);
    try {
      await updateDoc(ref, { begeniSayisi: (currentCount ?? 0) + 1 });
      fetchRecipes();
    } catch (err) {
      console.error("Beğeni güncellenemedi", err);
    }
  };

  useEffect(() => {
    fetchRecipes(); // ilk yükleme
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchesLang = r.tarifDili === currentLang;
    const matchesFilter = filter === "tumu" || r.cihazMarkasi === filter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((ing) => ing.toLowerCase().includes(search.toLowerCase()));
    return matchesLang && matchesFilter && matchesSearch;
  });

  const selectedRecipe = recipes.find((r) => r.id === expanded);
  const imageSrc = selectedRecipe?.imageUrl || selectedRecipe?.image || null;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans">
      <button
        onClick={() => onNavigate("/landing")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow"
      >
        {t("likedRecipes.backToLanding")}
      </button>

      <h1 className="text-2xl font-bold mb-4">{t("likedRecipes.title")}</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("likedRecipes.searchPlaceholder")}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full shadow-sm"
      />

      <div className="mb-4 flex gap-2">
        {["tumu", "thermomix", "thermogusto"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as any)}
            className={`px-4 py-2 rounded-full shadow-sm border ${
              filter === c ? "bg-green-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {t(`likedRecipes.filters.${c}`)}
          </button>
        ))}
      </div>

      {expanded && selectedRecipe ? (
        // detay görünüm
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={selectedRecipe.title}
              className="w-full max-w-md mx-auto mb-4 rounded-lg border border-gray-200"
            />
          )}
          <h2 className="text-2xl font-bold mb-2 text-center">{selectedRecipe.title}</h2>
          <p className="text-sm text-gray-500 mb-1 text-center">
            {selectedRecipe.cihazMarkasi
              ? t(`likedRecipes.filters.${selectedRecipe.cihazMarkasi}`)
              : t("likedRecipes.filters.unknownDevice")}
            {selectedRecipe.duration ? ` • ${selectedRecipe.duration}` : ""}
          </p>
          {currentStep === 0 ? (
            <div>
              <h3 className="font-semibold mt-4 mb-2">{t("likedRecipes.ingredients")}</h3>
              <ul className="list-disc list-inside text-sm mb-4">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <p className="text-sm italic text-gray-500">
                {t("likedRecipes.totalSteps", { count: selectedRecipe.steps?.length || 0 })}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">
                {t("likedRecipes.stepTitle", { currentStep })}
              </h3>
              <p className="text-sm">{selectedRecipe.steps?.[currentStep - 1]}</p>
            </div>
          )}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setExpanded(null)}
              className="text-sm text-gray-600 underline"
            >
              {t("likedRecipes.back")}
            </button>
            <div className="space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="text-sm bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                >
                  {t("likedRecipes.previous")}
                </button>
              )}
              {currentStep < (selectedRecipe.steps?.length || 0) && (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  {currentStep === 0
                    ? t("likedRecipes.startPreparation")
                    : t("likedRecipes.next")}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ul className="space-y-4">
            {filteredRecipes.map((recipe) => (
              <li
                key={recipe.id}
                className="bg-white p-4 rounded-xl shadow-md cursor-pointer flex items-center gap-4"
                onClick={() => {
                  setExpanded(recipe.id);
                  setCurrentStep(0);
                }}
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{recipe.title}</h2>
                  <span className="text-xs text-gray-600">
                    {recipe.cihazMarkasi
                      ? t(`likedRecipes.filters.${recipe.cihazMarkasi}`)
                      : t("likedRecipes.filters.unknownDevice")}
                    {recipe.duration ? ` • ${recipe.duration}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {lastDoc && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchRecipes(true)}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
              >
                {loading ? "Yükleniyor..." : "Daha fazla göster"}
              </button>
            </div>
          )}
        </div>
      )}
      <AuthFooter />
    </div>
  );
};

export default LikedRecipesPage;