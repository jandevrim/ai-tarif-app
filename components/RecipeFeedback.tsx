import React from "react";
import { saveLikedRecipeToServer } from "../utils/firestore";
const getValidCihazMarkasi = (): "thermomix" | "thermogusto" | "tumu" => {
  if (typeof window === "undefined") return "tumu";
  const val = localStorage.getItem("cihazMarkasi");
  if (val === "thermomix" || val === "thermogusto" || val === "tumu") {
    return val;
  }
  return "tumu";
};
const cihazMarkasiFromStorage = getValidCihazMarkasi();

interface RecipeFeedbackProps {
  title: string;
  recipeText: string;
  ingredients: string[];
  steps: string[]; // 🔧 Eksik olan eklendi!
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({
  title,
  recipeText,
  ingredients,
  steps,
  cihazMarkasi,
  tarifDili = "tr",
  kullaniciTarifi = false,
}) => {
  const handleLike = async () => {
    try {
     
await saveLikedRecipeToServer({
  title,
  summary: recipeText,
  ingredients,
  steps, // ✅ steps artık gönderiliyor
  cihazMarkasi: cihazMarkasiFromStorage, // ✅ artık TypeScript uyumlu
  tarifDili,
  kullaniciTarifi,
  begeniSayisi: 1,
});

     
      alert("Tarif beğenildi ve kaydedildi! 💚");
    } catch (err) {
      console.error(err);
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