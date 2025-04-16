import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { app } from "../utils/firebaseconfig"; // Firebase config dosyanızın yolu doğru olmalı

const db = getFirestore(app);

interface Recipe {
  id: string;
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[]; // Adımlar string dizisi olabilir
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu";
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number;
}

const LikedRecipesPage = ({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">(
    "tumu"
  );

  const fetchRecipes = async () => {
    console.log("fetchRecipes çağrıldı."); // DEBUG: Fonksiyonun çağrıldığını kontrol et
    try {
      const snapshot = await getDocs(collection(db, "likedRecipes"));
      const data = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data();
        // DEBUG: Firestore'dan gelen ham steps verisini logla
        console.log(`HAM steps verisi (${docSnap.id}):`, raw.steps);

        // Steps verisini işle
        const processedSteps = Array.isArray(raw.steps)
          ? raw.steps // Zaten array ise doğrudan kullan
          : typeof raw.steps === "string"
          ? raw.steps // String ise regex ile böl, filtrele ve trim yap
              .split(/\d+\.\s/) // "1. ", "2. " gibi pattern'lara göre böl
              .filter(Boolean) // Bölme sonucu oluşabilecek boş string'leri kaldır
              .map((s: string) => s.trim()) // Başındaki/sonundaki boşlukları temizle
          : []; // Diğer durumlarda (undefined, null, vs.) boş array ata

        // DEBUG: İşlenmiş steps verisini logla
        console.log(`İŞLENMİŞ steps verisi (${docSnap.id}):`, processedSteps);

        return {
          id: docSnap.id,
          title: raw.title,
          summary: raw.summary,
          duration: raw.duration,
          ingredients: raw.ingredients || [], // Ingredients yoksa boş array
          steps: processedSteps, // İşlenmiş adımları ata
          cihazMarkasi: raw.cihazMarkasi,
          tarifDili: raw.tarifDili,
          kullaniciTarifi: raw.kullaniciTarifi,
          begeniSayisi: raw.begeniSayisi,
        };
      });
      setRecipes(data);
      console.log("Tarifler state'e yüklendi:", data); // DEBUG: Yüklenen veriyi kontrol et
    } catch (error) {
        console.error("Tarifler çekilirken hata oluştu:", error); // DEBUG: Hata olursa logla
    }
  };

  const handleLike = async (id: string, currentCount: number = 0) => {
    const ref = doc(db, "likedRecipes", id);
    try {
      await updateDoc(ref, { begeniSayisi: (currentCount ?? 0) + 1 });
      fetchRecipes(); // Başarılı güncelleme sonrası listeyi yenile
    } catch (err) {
      console.error("Beğeni güncellenemedi", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []); // Sadece component mount olduğunda çalışır

  const filteredRecipes = recipes.filter((r) =>
    filter === "tumu" ? true : r.cihazMarkasi === filter
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans">
      <button
        onClick={() => onNavigate("/landing")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow"
      >
        &larr; Geri Dön
      </button>

      <h1 className="text-2xl font-bold mb-4">💚 Beğenilen Tarifler</h1>

      <div className="mb-4 flex gap-2">
        {["tumu", "thermomix", "thermogusto"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as any)}
            className={`px-4 py-2 rounded-full shadow-sm border ${
              filter === c ? "bg-green-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {c === "tumu" ? "Tümü" : c === "thermomix" ? "Thermomix" : "ThermoGusto"}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">Filtreye uygun tarif bulunamadı.</p>
      ) : (
        <ul className="space-y-6">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id} className="bg-white p-5 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"}
              </p>
              <p className="text-sm text-gray-600 mb-1 font-semibold">Malzemeler:</p>
              <ul className="list-disc list-inside mb-2 text-sm">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    // DEBUG: State güncellemesi öncesi ve sonrası loglama
                    console.log("Önceki expanded state:", expanded);
                    console.log("Tıklanan tarif ID:", recipe.id);
                    setExpanded((prev) => {
                      const newState = { ...prev, [recipe.id]: !prev[recipe.id] };
                      console.log("Yeni expanded state:", newState);
                      return newState;
                    });
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expanded[recipe.id] ? "Tarifi Gizle" : "Tarifi Göster"}
                </button>
                <button
                  onClick={() => handleLike(recipe.id, recipe.begeniSayisi)}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow"
                >
                  👍 {recipe.begeniSayisi ?? 0}
                </button>
              </div>

              {/* ---- DEBUG: Koşullu render öncesi kontrol log'u ---- */}
              {console.log(`Render: Tarif ID: ${recipe.id}, Expanded?: ${!!expanded[recipe.id]}`)}

              {/* Koşullu olarak adımları gösteren bölüm */}
              {expanded[recipe.id] && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-1">Hazırlık Adımları:</h3>
                    {/* ---- DEBUG: Render anındaki recipe.steps kontrol log'u ---- */}
                    {console.log(`Render anındaki recipe.steps (${recipe.id}):`, recipe.steps)}
                  <ul className="list-decimal list-inside text-sm">
                    {recipe.steps && recipe.steps.length > 0 ? (
                      recipe.steps.map((step, i) => <li key={i}>{step}</li>)
                    ) : (
                      <li className="italic text-gray-400">Adım verisi yok</li>
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedRecipesPage;