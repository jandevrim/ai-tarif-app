import React from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../utils/firebaseconfig";

const db = getFirestore(app);

interface RecipeFeedbackProps {
  title: string;
  summary: string;
  recipeText: string;
  ingredients: string[];
  steps: string[];
  cihazMarkasi: string;
  tarifDili: string;
  kullaniciTarifi: boolean;
  begeniSayisi?: number;
  userId: string;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({
  title,
  summary,
  recipeText,
  ingredients,
  steps,
  cihazMarkasi,
  tarifDili,
  kullaniciTarifi,
  begeniSayisi = 0,
  userId
}) => {
  const handleSaveFeedback = async () => {
    console.log("Save feedback başlıyor"); // EKLE
    try {
      await addDoc(collection(db, "likedRecipes"), {
        title,
        summary,
        recipeText,
        ingredients,
        steps,
        cihazMarkasi,
        tarifDili,
        kullaniciTarifi,
        begeniSayisi,
        userId,
        createdAt: new Date()
      });
      console.log("Tarif Firestore'a başarıyla kaydedildi!");
      alert("Beğendiğinize Sevindik! 🎉");
    } catch (error) {
      console.error("Tarif kaydedilemedi:", error);
      alert("Kaydetme sırasında hata oluştu.");
    }
  };
  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleSaveFeedback}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 transform hover:scale-105"
      >
        👍 Beğendim
      </button>
    </div>
  );
};

export default RecipeFeedback;