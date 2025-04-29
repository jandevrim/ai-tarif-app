"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface LikedRecipesButtonProps {
  recipeCount: number | null;
  onClick: () => void;
}

const LikedRecipesButton: React.FC<LikedRecipesButtonProps> = ({ recipeCount, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
    >
      💚 {recipeCount !== null
        ? t('landing.readyRecipes', { count: recipeCount })
        : t('landing.loadingRecipes')}
    </button>
  );
};

export default LikedRecipesButton;