import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseconfig";

export default function RecipePage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || typeof id !== "string") return;
      setLoading(true);
      try {
        const docRef = doc(db, "likedRecipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.warn("Tarif bulunamadı.");
        }
      } catch (error) {
        console.error("Tarif alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  if (!recipe) {
    return <div className="p-6 text-red-500">Tarif bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-4">📋 {recipe.title}</h1>

      {recipe.summary && (
        <p className="mb-4 italic text-gray-600">{recipe.summary}</p>
      )}

      {recipe.duration && (
        <p className="mb-4 font-medium">⏱️ Süre: {recipe.duration}</p>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-2">🍽️ Malzemeler:</h2>
        <ul className="list-disc list-inside space-y-1">
          {recipe.ingredients?.map((ing: string, idx: number) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2">👨‍🍳 Hazırlık Adımları:</h2>
        <ol className="list-decimal list-inside space-y-2">
          {recipe.steps?.map((step: string, idx: number) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
