import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../utils/firebaseconfig";
import { useTranslation } from "react-i18next";

const db = getFirestore(app);

export default function LikedRecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchRecipe = async () => {
        const ref = doc(db, "likedRecipes", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const raw = snap.data();
          const processedSteps = Array.isArray(raw.steps)
            ? raw.steps
            : typeof raw.steps === "string"
            ? raw.steps.split(/\d+\.\s/).filter(Boolean).map((s: string) => s.trim())
            : [];
          setRecipe({ id: snap.id, ...raw, steps: processedSteps });
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleLike = async () => {
    if (!recipe) return;
    const ref = doc(db, "likedRecipes", recipe.id);
    const newCount = (recipe.begeniSayisi ?? 0) + 1;
    await updateDoc(ref, { begeniSayisi: newCount });
    setRecipe({ ...recipe, begeniSayisi: newCount });
  };

  if (!recipe) return <p className="p-6">Yükleniyor...</p>;

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <button onClick={() => router.back()} className="text-sm underline mb-4">← {t("likedRecipes.backToLanding")}</button>
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {recipe.cihazMarkasi} • {recipe.duration}
      </p>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full max-w-md mb-4 rounded border"
        />
      )}

      <h2 className="text-lg font-semibold mb-1">{t("likedRecipes.ingredients")}</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients?.map((ing: string, idx: number) => (
          <li key={idx}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mb-1">{t("likedRecipes.steps")}</h2>
      <ol className="list-decimal list-inside space-y-2 text-sm">
        {recipe.steps?.map((step: string, idx: number) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      <div className="mt-6">
        <button
          onClick={handleLike}
          className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 rounded"
        >
          👍 {recipe.begeniSayisi || 0}
        </button>
      </div>
    </div>
  );
}