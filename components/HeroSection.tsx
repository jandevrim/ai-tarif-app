"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const currentLang = i18n.language.startsWith("en") ? "en" : "tr";

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex flex-col items-center px-4 py-2">
      <div className="relative w-full max-w-xs mb-2">
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
      <div className="text-center space-y-3">
        <div className="flex justify-center gap-2 mt-1">
          <button
            onClick={() => handleLanguageChange("tr")}
            className={`px-3 py-1 rounded-full text-sm shadow-sm transition ${
              currentLang === "tr"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            🇹🇷 Türkçe
          </button>
          <button
            onClick={() => handleLanguageChange("en")}
            className={`px-3 py-1 rounded-full text-sm shadow-sm transition ${
              currentLang === "en"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900">
          {t("landing.title")}
        </h1>
        <button
          onClick={onStart}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
        >
          {t("landing.startRecipeButton")}
        </button>
      </div>
    </div>
  );
};

export default HeroSection;