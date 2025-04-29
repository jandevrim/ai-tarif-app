"use client";

import React from "react";

interface ShareButtonsProps {
  title: string;
  recipeText: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, recipeText }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${recipeText}`);
      console.log("Tarif panoya kopyalandı ✅");
    } catch (err) {
      console.error("Kopyalama işlemi başarısız:", err);
    }
  };

  const handleShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({ title: `Tarif: ${title}`, text: recipeText });
        console.log("Paylaşım başarılı.");
      } catch (err) {
        console.warn("Paylaşım iptal edildi veya başarısız:", err);
      }
    }
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleCopy}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
      >
        📋 Kopyala
      </button>
      {'share' in navigator ? (
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
        >
          📤 Paylaş
        </button>
      ) : (
        <p className="text-sm text-gray-500">Paylaşım desteklenmiyor, lütfen kopyalayın.</p>
      )}
    </div>
  );
};

export default ShareButtons;