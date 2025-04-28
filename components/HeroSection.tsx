"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
      <div className="relative w-full max-w-xs mb-8">
        <img
          src="/logo.png"
          alt="ThermoChefAI Ana Logo"
          width={300}
          height={300}
          className="rounded-2xl object-contain mx-auto"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = "https://placehold.co/300x300/e0f2fe/334155?text=Logo+Bulunamadı";
            console.error("Logo yüklenemedi: /logo.png");
          }}
        />
      </div>

      <div className="text-center space-y-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
          {t("landing.title")}
        </h1>

        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
        >
          {t("landing.startRecipeButton")}
        </button>
      </div>
    </div>
  );
};

export default HeroSection;