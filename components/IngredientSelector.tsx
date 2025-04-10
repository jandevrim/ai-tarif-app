import React, { useEffect, useState } from "react";
import { ingredients } from "../data/ingredients";

export interface Ingredient {
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
}

export default function IngredientSelector({ selected, onSelect }: Props) {
  const [term, setTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<Ingredient[]>(ingredients);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const result = ingredients.filter((i) => {
        const name = i.name?.tr?.toLowerCase() ?? "";
        const categoryValue = i.category?.toLowerCase() ?? "";
        const selected = selectedCategory?.toLowerCase() ?? null;
        return (
          name.includes(term.toLowerCase()) &&
          (!selected || categoryValue === selected)
        );
      });
      setFiltered(result);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [term, selectedCategory]);

  const categories = Array.from(new Set(ingredients.map((i) => i.category)));

  const handleKeyDown = (e: React.KeyboardEvent, ingredient: Ingredient) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!selected.some((s) => s.id === ingredient.id)) {
        onSelect(ingredient);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-2">Malzeme Seç</h2>
        <input
          type="text"
          placeholder="Ara..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border px-2 py-1 w-full mb-2"
        />
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded ${
              !selectedCategory ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
          >
            Tüm Kategoriler
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded ${
                selectedCategory === cat ? "bg-gray-800 text-white" : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center py-4">Yükleniyor...</div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((i) => (
              <li
                key={i.id}
                onClick={() => !selected.some((s) => s.id === i.id) && onSelect(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                tabIndex={0}
                className={`cursor-pointer p-1 ${
                  selected.some((s) => s.id === i.id)
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                {i.emoji && <span style={{ marginRight: "0.5rem" }}>{i.emoji}</span>}
                {i.name.tr}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
