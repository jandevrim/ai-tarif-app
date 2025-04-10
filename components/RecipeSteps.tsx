
// 📁 components/RecipeSteps.tsx
import React, { useState } from "react";

interface Props {
  recipe: string;
}

export default function RecipeSteps({ recipe }: Props) {
  const steps = recipe.split(/\n\d+\. /g).filter(Boolean); // Adımları ayır
  const [index, setIndex] = useState(0);

  const next = () => index < steps.length - 1 && setIndex(index + 1);
  const back = () => index > 0 && setIndex(index - 1);

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 border rounded shadow">
      <div className="text-lg font-semibold mb-2">Tarif Adımı {index + 1} / {steps.length}</div>
      <div className="mb-4 whitespace-pre-wrap">{steps[index]}</div>
      <div className="flex justify-between">
        <button onClick={back} disabled={index === 0} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Geri</button>
        <button onClick={next} disabled={index === steps.length - 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">İleri</button>
      </div>
    </div>
  );
}
