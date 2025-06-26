"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
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
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  begeniSayisi?: number;
  imageUrl?: string;
}

  const LikedRecipes= ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">("tumu");
  const [search, setSearch] = useState<string>("");
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ doğru yer burası
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("en") ? "en" : "tr";

  const fetchRecipes = async (isNextPage = false) => {
    setLoading(true);
    const pageSize = 9;
    const baseQuery = collection(db, "likedRecipes");

    const q = isNextPage && lastDoc
      ? query(baseQuery, orderBy("title"), startAfter(lastDoc), limit(pageSize))
      : query(baseQuery, orderBy("title"), limit(pageSize));

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const data: Recipe[] = docs.map((docSnap) => {
      const raw = docSnap.data();
      return {
        id: docSnap.id,
        title: raw.title,
        summary: raw.summary,
        duration: raw.duration,
        ingredients: raw.ingredients || [],
        cihazMarkasi: raw.cihazMarkasi,
        tarifDili: raw.tarifDili,
        begeniSayisi: raw.begeniSayisi,
        imageUrl: raw.imageUrl,
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
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, begeniSayisi: (currentCount ?? 0) + 1 } : r
        )
      );
    } catch (err) {
      console.error("Beğeni güncellenemedi", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesLang = r.tarifDili === currentLang;
      const matchesFilter = filter === "tumu" || r.cihazMarkasi === filter;
      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.ingredients.some((ing) =>
          ing.toLowerCase().includes(search.toLowerCase())
        );
      return matchesLang && matchesFilter && matchesSearch;
    });
  }, [recipes, filter, search, currentLang]);

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

      <div className="mb-6 flex gap-2">
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

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-500">
          {t("likedRecipes.noResults") || "Eşleşen tarif bulunamadı."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                 onClick={() => router.push(`/liked-recipes-grid/${recipe.id}`)}
            >
              <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {recipe.cihazMarkasi
                  ? t(`likedRecipes.filters.${recipe.cihazMarkasi}`)
                  : t("likedRecipes.filters.unknownDevice")}
                {recipe.duration ? ` • ${recipe.duration}` : ""}
              </p>
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-32 object-cover rounded mb-2 border"
                />
              )}
              {recipe.summary && (
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {recipe.summary}
                </p>
              )}
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => handleLike(recipe.id, recipe.begeniSayisi || 0)}
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded"
                >
                  👍 {recipe.begeniSayisi || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lastDoc && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => fetchRecipes(true)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
          >
            {loading ? "Yükleniyor..." : "Daha fazla göster"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LikedRecipes;