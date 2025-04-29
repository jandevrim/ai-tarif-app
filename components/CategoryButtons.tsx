"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const CategoryButtons: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-sm">
      <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
        <span className="text-2xl">🍲</span>
        <span className="text-xs font-medium text-gray-700 text-center">{t('landing.selectIngredients')}</span>
      </button>
      <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
        <span className="text-2xl">🍹</span>
        <span className="text-xs font-medium text-gray-700 text-center">{t('landing.generateRecipe')}</span>
      </button>
      <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
        <span className="text-2xl">🍰</span>
        <span className="text-xs font-medium text-gray-700 text-center">{t('landing.stepByStepCooking')}</span>
      </button>
    </div>
  );
};

export default CategoryButtons;