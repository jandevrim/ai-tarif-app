"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../utils/firebaseconfig";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const auth = getAuth();
  const db = getFirestore(app);
  const user = auth.currentUser;
  const router = useRouter();
  const { t } = useTranslation();

  const [recipeCount, setRecipeCount] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    const fetchUserRecipes = async () => {
      const q = query(collection(db, "likedRecipes"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      setRecipeCount(snapshot.size);
    };
    fetchUserRecipes();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("profile.loginPrompt")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-6">
      <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">👤 {t("profile.title")}</h1>
        <p><strong>{t("profile.name")}:</strong> {user.displayName || t("profile.unnamed")}</p>
        <p><strong>{t("profile.email")}:</strong> {user.email}</p>
        <p className="mt-4"><strong>{t("profile.recipeCount")}:</strong> {recipeCount}</p>

        {recipeCount >= 5 ? (
          <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <p className="text-yellow-800 font-medium">{t("profile.limitReached")}</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              {t("profile.startMembership")}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-green-700">{t("profile.canCreate")}</p>
        )}

        <button
          className="mt-8 underline text-blue-600"
          onClick={() => router.push("/landing")}
        >
          ← {t("profile.backHome")}
        </button>
      </div>
    </div>
  );
}