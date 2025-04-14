// ✅ components/RecipeFeedback.tsx
import React, { useEffect, useState } from "react";

interface Props {
  recipe: any; // tip genişletilebilir
  onFeedbackGiven: (feedback: "like" | "dislike") => void;
}

const RecipeFeedback: React.FC<Props> = ({ recipe, onFeedbackGiven }) => {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const saveLikedRecipe = () => {
    const stored = JSON.parse(localStorage.getItem("likedRecipes") || "[]");
    stored.push(recipe);
    localStorage.setItem("likedRecipes", JSON.stringify(stored));
  };

  const handleLike = () => {
    setFeedback("like");
    saveLikedRecipe();
    onFeedbackGiven("like");
  };

  const handleDislike = () => {
    setFeedback("dislike");
    onFeedbackGiven("dislike");
  };

  if (feedback) {
    return (
      <div className="mt-6 text-center text-green-700 font-semibold">
        {feedback === "like" ? "Tarif beğenildi ✅" : "Tarif beğenilmedi ❌"}
      </div>
    );
  }

  return (
    <div className="mt-6 text-center space-x-4">
      <button
        onClick={handleLike}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow"
      >
        👍 Beğendim
      </button>
      <button
        onClick={handleDislike}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow"
      >
        👎 Beğenmedim
      </button>
    </div>
  );
};

export default RecipeFeedback;
