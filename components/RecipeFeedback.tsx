import React from "react";

interface RecipeFeedbackProps {
  title: string;
  recipeText: string;
  ingredients: string[];
  steps: string[];
  cihazMarkasi: string;
  tarifDili: string;
  kullaniciTarifi: boolean;
}

const RecipeFeedback: React.FC<RecipeFeedbackProps> = ({
  title,
  recipeText,
  ingredients,
  steps,
  cihazMarkasi,
  tarifDili,
  kullaniciTarifi,
}) => {
  console.log("RecipeFeedback cihazMarkasi:", cihazMarkasi); // Log ekledim

  const handleSaveFeedback = async () => {
    try {
      const response = await fetch("/api/save-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          recipeText,
          ingredients,
          steps,
          cihazMarkasi, // Cihaz markasını kaydet
          tarifDili,
          kullaniciTarifi,
        }),
      });

      if (!response.ok) {
        throw new Error("Feedback kaydedilemedi.");
      }

      console.log("Feedback başarıyla kaydedildi.");
    } catch (error) {
      console.error("Feedback kaydedilemedi:", error);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>{recipeText}</p>
      <button onClick={handleSaveFeedback}>Geri Bildirim Gönder</button>
    </div>
  );
};

export default RecipeFeedback;