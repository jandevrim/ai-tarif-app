import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../utils/firebaseconfig";

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
  lang?: "tr" | "en";
}

export default function IngredientSelector({
  selected,
  onSelect,
  onClose,
  lang = "tr",
}: Props) {
  const [term, setTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, "ingredients"));
      const fetched = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: {
            tr: data.name?.tr || data.name || "",
            en: data.name?.en || data.name?.tr || data.name || "",
          },
          category: data.category || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          emoji: data.emoji || "",
        };
      });
      setIngredients(fetched);
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const result = ingredients.filter((i) => {
        const name = i.name?.[lang]?.toLowerCase() ?? "";
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
  }, [term, selectedCategory, ingredients, lang]);

  const categories = Array.from(new Set(ingredients.map((i) => i.category)));

  const handleKeyDown = (e: React.KeyboardEvent, ingredient: Ingredient) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!selected.some((s) => s.id === ingredient.id)) {
        handleSelect(ingredient);
      }
    }
  };

  const handleSelect = (ingredient: Ingredient) => {
    console.log(lang)
    const normalizedName = typeof ingredient.name === "string"
      ? { tr: ingredient.name, en: ingredient.name }
      : {
          tr: ingredient.name?.tr || ingredient.name?.en || "",
          en: ingredient.name?.en || ingredient.name?.tr || "",
        };
  
    const selected: Ingredient = {
      ...ingredient,
      name: normalizedName,
    };
  
    console.log("✅ Selected Ingredient:", selected, "| lang:", lang);
    onSelect(selected);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-2">
          {lang === "en" ? "Select Ingredient" : "Malzeme Seç"}
        </h2>
        <input
          type="text"
          placeholder={lang === "en" ? "Search..." : "Ara..."}
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
            {lang === "en" ? "All Categories" : "Tüm Kategoriler"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded ${
                selectedCategory === cat
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-center py-4">
            {lang === "en" ? "Loading..." : "Yükleniyor..."}
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((i) => (
              <li
                key={i.id}
                onClick={() => !selected.some((s) => s.id === i.id) && handleSelect(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                tabIndex={0}
                className={`cursor-pointer p-1 ${
                  selected.some((s) => s.id === i.id)
                    ? "bg-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                {i.emoji && <span style={{ marginRight: "0.5rem" }}>{i.emoji}</span>}
                {i.name?.[lang] || i.name.tr}
              </li>
            ))}
          </ul>
        )}
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 underline hover:text-gray-800"
          >
            {lang === "en" ? "Close" : "Kapat"}
          </button>
        </div>
      </div>
    </div>
  );
}