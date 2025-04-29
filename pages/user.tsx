"use client";

import { useEffect, useState } from "react";
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebaseconfig";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function UserPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("...");
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const fetchData = async () => {
      if (!currentUser) return;

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCredits(docSnap.data().recipeCredits ?? 0);
        const created = docSnap.data().createdAt;
        if (created instanceof Timestamp) {
          setCreatedAt(created.toDate().toLocaleDateString());
        }
      }

      const q = query(collection(db, "likedRecipes"), where("userId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserRecipes(recipes);
    };

    fetchData();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(t("userPage.deleteConfirm"));
    if (!confirmDelete || !user) return;

    try {
      const recipesQuery = query(collection(db, "likedRecipes"), where("userId", "==", user.uid));
      const recipesSnapshot = await getDocs(recipesQuery);
      const deletePromises = recipesSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "users", user.uid));
      await signOut(getAuth());
      router.push("/landing");
    } catch (error) {
      alert(t("userPage.deleteError"));
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t("userPage.noUser")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-start pt-16 px-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">👤 {user.displayName || t("userPage.anonUser")}</h1>

      <div className="bg-gray-50 border p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <p className="text-sm text-gray-500 mb-1">{user.email}</p>
        <p className="text-sm text-gray-500 mb-4">{t("userPage.joinDate")}: {createdAt}</p>
        <div className="bg-green-100 text-green-800 font-medium py-2 px-4 rounded-full inline-block shadow">
          {t("userPage.remainingCredits")}: {credits ?? "..."} / 5
        </div>
      </div>

      <div className="w-full max-w-md mt-8">
        <h2 className="text-lg font-bold mb-2">📚 {t("userPage.yourRecipes")}</h2>
        {userRecipes.length === 0 ? (
          <p className="text-sm text-gray-500">{t("userPage.noRecipes")}</p>
        ) : (
          <ul className="space-y-2">
            {userRecipes.map((recipe) => (
              <li key={recipe.id} className="bg-gray-100 p-3 rounded shadow">
                <a
                  href={`/recipePage/${recipe.id}`}
                  className="text-green-700 hover:underline font-semibold"
                >
                  {recipe.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
        >
          ← {t("userPage.back")}
        </button>

        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
        >
          🚫 {t("userPage.deleteAccount")}
        </button>
      </div>
    </div>
  );
}