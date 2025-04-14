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
      alert("Kopyalama başarısız ❌");
    }
  };

 export const RecipeFeedback = ({ recipe }: { recipe: any }) => {
  const handleLike = () => {
    saveLikedRecipe(recipe);
    alert("Tarif beğenildi ve kaydedildi!");
  };
  
  const handleDislike = () => {
    alert("Bu geri bildirim için teşekkürler 👋");
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <p className="text-sm text-gray-600">Bu tarifi beğendiniz mi?</p>
      <div className="flex gap-4">
        <button onClick={handleLike} className="text-green-600 text-xl hover:scale-110 transition">👍</button>
        <button onClick={handleDislike} className="text-red-600 text-xl hover:scale-110 transition">👎</button>
        <button onClick={handleCopy} className="text-gray-700 text-xl hover:scale-110 transition">📋</button>
      </div>
    </div>
  );
};

export default RecipeFeedback;