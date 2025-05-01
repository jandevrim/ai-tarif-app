"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Ingredient {
  id: string;
  name: { tr: string; en: string };
  category: string;
  tags: string[];
  emoji?: string;
}

interface Props {
  selected: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  onClose: () => void;
  ingredients?: Ingredient[];
}

const MockIngredientSelector: React.FC<Props> = ({
  selected,
  onSelect,
  onClose,
  ingredients = [],
}) => {
  const { t, i18n } = useTranslation();
  const rawLang = i18n.language;
  const lang: "tr" | "en" = rawLang.startsWith("en") ? "en" : "tr";

  const [activeCategory, setActiveCategory] = useState("");

  const categories = React.useMemo(() => {
    const unique = new Set(ingredients.map((i) => i.category));
    const order = [
      "sebze", "meyveler", "et ürünleri", "süt ürünleri", "bakliyat",
      "baharatlar", "sıvılar", "diğer"
    ];
    return Array.from(unique).sort((a, b) => {
      const ai = order.indexOf(a.toLowerCase());
      const bi = order.indexOf(b.toLowerCase());
      if (ai === -1 && bi === -1) return a.localeCompare(b, "tr");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [ingredients]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory(categories[0] || "");
    }
  }, [categories, activeCategory]);

  const getCategoryLabel = (key: string) => {
    const translations: Record<string, { tr: string; en: string }> = {
      "sebze": { tr: "Sebze", en: "Vegetables" },
      "meyveler": { tr: "Meyveler", en: "Fruits" },
      "et ürünleri": { tr: "Et Ürünleri", en: "Meat Products" },
      "süt ürünleri": { tr: "Süt Ürünleri", en: "Dairy" },
      "bakliyat": { tr: "Bakliyat", en: "Legumes" },
      "baharatlar": { tr: "Baharatlar", en: "Spices" },
      "sıvılar": { tr: "Sıvılar", en: "Liquids" },
      "diğer": { tr: "Diğer", en: "Other" }
    };
    return translations[key]?.[lang] || key;
  };

  const handleSelect = (ingredient: Ingredient) => {
    const normalized: Ingredient = {
      ...ingredient,
      name: {
        tr: ingredient.name?.tr || ingredient.name?.en || "",
        en: ingredient.name?.en || ingredient.name?.tr || ""
      }
    };
    onSelect(normalized);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md mb-4">
      <div className="flex flex-wrap gap-2 border-b pb-3 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm transition shadow-sm ${
              activeCategory === cat
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      <h3 className="font-semibold mb-2 text-gray-600">
        {activeCategory
          ? `${getCategoryLabel(activeCategory)} ${t("ingredient.list")}`
          : t("ingredient.list")}
      </h3>

      <div key={activeCategory} className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mb-4 pr-2">
        {ingredients.filter((i) => i.category === activeCategory).map((ing) => {
          const isSelected = selected.some((s) => s.id === ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => !isSelected && handleSelect(ing)}
              disabled={isSelected}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition shadow-sm ${
                isSelected
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-100 hover:bg-green-100 text-gray-800"
              }`}
            >
              {ing.emoji && <span>{ing.emoji}</span>}
              <span>{ing.name?.[lang] || ing.name.tr || ing.name.en || "?"}</span>
            </button>
          );
        })}
        {ingredients.filter((i) => i.category === activeCategory).length === 0 && (
          <p className="text-sm text-gray-500 italic">{t("ingredient.notFound")}</p>
        )}
      </div>

      <div className="text-right">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-3 py-1 rounded-full text-sm shadow-sm"
        >
          {t("ingredient.close")}
        </button>
      </div>
    </div>
  );
};

export default MockIngredientSelector;