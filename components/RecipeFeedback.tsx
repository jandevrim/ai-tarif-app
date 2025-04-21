import React from "react";
import { saveLikedRecipeToServer } from "../utils/firestore"; // ✅ Sadece import, tekrar tanım yok
import { getAuth } from "firebase/auth";

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
  steps: string[];
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  userId?: string; // ⬅️ bunu ekle
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
    const user = getAuth().currentUser;
    if (!user) {
      alert("Giriş yapmadan beğenemezsiniz.");
      return;
    }

    await saveLikedRecipeToServer({
      title,
      summary: recipeText,
      ingredients,
      steps,
      cihazMarkasi: cihazMarkasi || cihazMarkasiFromStorage,
      tarifDili,
      kullaniciTarifi,
      begeniSayisi: 1,
      userId: user.uid, // ✅ Artık hata vermeyecek
    });

    alert("Tarif beğenildi ve kaydedildi! 💚");
  } catch (err) {
    alert("Kaydetme sırasında hata oluştu.");
    console.error(err);
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