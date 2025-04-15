import React from "react";
import { saveLikedRecipeToServer } from "../utils/firestore";
import { app } from "../utils/firebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);
interface RecipeFeedbackProps {
  title: string;
  recipeText: string;
  ingredients: string[];
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({
  title,
  recipeText,
  ingredients,
  cihazMarkasi = "tumu",
  tarifDili = "tr",
  kullaniciTarifi = false,
}) => {
  const handleLike = async () => {
    try {
      await saveLikedRecipeToServer({
        title,
        summary: recipeText,
        ingredients,
        cihazMarkasi,
        tarifDili,
        kullaniciTarifi,
        begeniSayisi: 1,
      });
      alert("Tarif beğenildi ve kaydedildi! 💚");
    } catch (err) {
      alert("Kaydetme sırasında hata oluştu.");
    }
  };

  const handleDislike = () => {
    alert("Üzgünüz, bu tarif senlik değilmiş. 🙁");
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleLike}
        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
      >
        👍 Beğendim
      </button>
      <button
        onClick={handleDislike}
        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
      >
        👎 Beğenmedim
      </button>
    </div>
  );
};

export default RecipeFeedback;