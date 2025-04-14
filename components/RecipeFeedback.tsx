// ✅ components/RecipeFeedback.tsx
import React from "react";
import { saveLikedRecipe } from "../utils/storage";

export const getLikedRecipes = (): any[] => {
  const saved = localStorage.getItem("likedRecipes");
  return saved ? JSON.parse(saved) : [];
};

interface RecipeFeedbackProps {
  title: string;
  recipeText: string;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({ title, recipeText }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${recipeText}`);
      alert("Tarif panoya kopyalandı ✅");
    } catch (err) {
      alert("Kopyalama işlemi başarısız ❌");
    }
  };

  const handleLike = () => {
    saveLikedRecipe({ title, recipeText });
    alert("Tarif beğenilenlere eklendi 💚");
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleCopy}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300"
      >
        📋 Kopyala
      </button>
      <button
        onClick={handleLike}
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
      >
        👍 Beğendim
      </button>
    </div>
  );
};

export default RecipeFeedback;