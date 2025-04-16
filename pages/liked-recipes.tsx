import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
// Firebase config dosyanızın gerçek yolunu kullanın
// Örneğin: import { app } from "../../firebaseConfig"; veya benzeri
import { app } from "../utils/firebaseconfig";

const db = getFirestore(app);

// Tarif verisinin yapısını tanımlayan interface
interface Recipe {
  id: string; // Firestore document ID
  title: string;
  summary?: string;
  duration?: string;
  ingredients: string[];
  steps?: string[]; // Adımların string dizisi olması bekleniyor
  cihazMarkasi?: "thermomix" | "thermogusto" | "tumu"; // Filtreleme için cihaz markası
  tarifDili?: string;
  kullaniciTarifi?: boolean;
  begeniSayisi?: number; // Beğeni sayısı
}

// Beğenilen tarifleri gösteren sayfa component'i
const LikedRecipesPage = ({
  onNavigate, // Başka sayfaya yönlendirme fonksiyonu prop'u
}: {
  onNavigate: (path: string) => void;
}) => {
  // State tanımlamaları
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Tarif listesi
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({}); // Hangi tarifin detayının açık olduğunu tutar
  const [filter, setFilter] = useState<"tumu" | "thermomix" | "thermogusto">(
    "tumu" // Aktif filtre durumu
  );

  // Firestore'dan beğenilen tarifleri çeken fonksiyon
  const fetchRecipes = async () => {
    console.log("fetchRecipes çağrıldı."); // DEBUG: Fonksiyon çağrısını logla
    try {
      // "likedRecipes" koleksiyonundan tüm dökümanları al
      const snapshot = await getDocs(collection(db, "likedRecipes"));
      // Dökümanları Recipe interface'ine uygun hale getir
      const data = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data(); // Ham Firestore verisi

        // DEBUG: Firestore'dan gelen ham steps verisini logla
        console.log(`HAM steps verisi (${docSnap.id}):`, raw.steps);

        // Steps verisini işle (Array ise kullan, String ise işle, değilse boş array)
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

        // Component'in kullanacağı Recipe objesini oluştur
        return {
          id: docSnap.id,
          title: raw.title,
          summary: raw.summary,
          duration: raw.duration,
          ingredients: raw.ingredients || [], // Ingredients yoksa boş array ata
          steps: processedSteps, // İşlenmiş adımları ata
          cihazMarkasi: raw.cihazMarkasi,
          tarifDili: raw.tarifDili,
          kullaniciTarifi: raw.kullaniciTarifi,
          begeniSayisi: raw.begeniSayisi,
        };
      });
      // İşlenmiş veriyi state'e ata
      setRecipes(data);
      console.log("Tarifler state'e yüklendi:", data); // DEBUG: Yüklenen veriyi kontrol et
    } catch (error) {
        console.error("Tarifler çekilirken hata oluştu:", error); // DEBUG: Hata olursa logla
    }
  };

  // Beğeni sayısını Firestore'da güncelleyen fonksiyon
  const handleLike = async (id: string, currentCount: number = 0) => {
    const ref = doc(db, "likedRecipes", id); // İlgili tarifin referansı
    try {
      // 'begeniSayisi' alanını 1 artırarak güncelle
      await updateDoc(ref, { begeniSayisi: (currentCount ?? 0) + 1 });
      // Başarılı güncelleme sonrası güncel listeyi tekrar çek
      fetchRecipes();
    } catch (err) {
      console.error("Beğeni güncellenemedi", err);
    }
  };

  // Component ilk yüklendiğinde tarifleri çekmek için useEffect
  useEffect(() => {
    fetchRecipes();
  }, []); // Boş dependency array, sadece mount anında çalışmasını sağlar

  // Mevcut filtreye göre tarifleri filtrele
  const filteredRecipes = recipes.filter((r) =>
    filter === "tumu" ? true : r.cihazMarkasi === filter
  );

  // Component'in JSX yapısı
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans">
      {/* Geri Dön Butonu */}
      <button
        onClick={() => onNavigate("/landing")} // Prop olarak gelen fonksiyonu çağırır
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow"
      >
        &larr; Geri Dön
      </button>

      {/* Sayfa Başlığı */}
      <h1 className="text-2xl font-bold mb-4">💚 Beğenilen Tarifler</h1>

      {/* Filtre Butonları */}
      <div className="mb-4 flex gap-2">
        {["tumu", "thermomix", "thermogusto"].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as any)} // Tıklanan butona göre filtre state'ini güncelle
            // Aktif filtreye göre stil uygula
            className={`px-4 py-2 rounded-full shadow-sm border ${
              filter === c ? "bg-green-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {/* Buton metnini belirle */}
            {c === "tumu" ? "Tümü" : c === "thermomix" ? "Thermomix" : "ThermoGusto"}
          </button>
        ))}
      </div>

      {/* Tarif Listesi veya Boş Mesajı */}
      {filteredRecipes.length === 0 ? (
        // Filtreye uygun tarif yoksa mesaj göster
        <p className="text-gray-500">Filtreye uygun tarif bulunamadı.</p>
      ) : (
        // Tarifler varsa listeyi göster
        <ul className="space-y-6">
          {/* Filtrelenmiş tarifleri map ile dönerek her biri için bir liste elemanı oluştur */}
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id} className="bg-white p-5 rounded-xl shadow-md">
              {/* Tarif Başlığı */}
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              {/* Süre Bilgisi */}
              <p className="text-sm text-gray-600 mb-2">
                <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"}
              </p>
              {/* Malzemeler Başlığı */}
              <p className="text-sm text-gray-600 mb-1 font-semibold">Malzemeler:</p>
              {/* Malzeme Listesi */}
              <ul className="list-disc list-inside mb-2 text-sm">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>

              {/* Butonlar (Tarifi Göster/Gizle ve Beğen) */}
              <div className="flex justify-between items-center mt-4">
                {/* Tarifi Göster/Gizle Butonu */}
                <button
                  onClick={() => {
                    // DEBUG: State güncellemesi öncesi ve sonrası loglama (Bu loglar JSX içinde olmadığından sorunsuz çalışır)
                    console.log("Önceki expanded state:", expanded);
                    console.log("Tıklanan tarif ID:", recipe.id);
                    // expanded state'ini güncelle (ilgili tarifin tersine çevir)
                    setExpanded((prev) => {
                      const newState = { ...prev, [recipe.id]: !prev[recipe.id] };
                      console.log("Yeni expanded state:", newState);
                      return newState;
                    });
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {/* expanded state'ine göre buton metnini değiştir */}
                  {expanded[recipe.id] ? "Tarifi Gizle" : "Tarifi Göster"}
                </button>
                {/* Beğen Butonu */}
                <button
                  onClick={() => handleLike(recipe.id, recipe.begeniSayisi)} // handleLike fonksiyonunu çağırır
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full shadow"
                >
                  {/* Beğeni ikonu ve sayısı */}
                  👍 {recipe.begeniSayisi ?? 0}
                </button>
              </div>

              {/* ---- DEBUG: Koşullu render öncesi kontrol log'u - || null ile DÜZELTİLDİ ---- */}
              {console.log(`Render: Tarif ID: ${recipe.id}, Expanded?: ${!!expanded[recipe.id]}`) || null}

              {/* Koşullu olarak Adımlar bölümünü gösterir */}
              {expanded[recipe.id] && ( // Sadece expanded[recipe.id] true ise bu bölüm render edilir
                <div className="mt-4">
                  {/* Adımlar Başlığı */}
                  <h3 className="font-semibold mb-1">Hazırlık Adımları:</h3>
                    {/* ---- DEBUG: Render anındaki recipe.steps kontrol log'u - || null ile DÜZELTİLDİ ---- */}
// Önceki Hatalı Hali:
// {console.log(`Render anındaki recipe.steps (${recipe.id}):`, recipe.steps) || null}

// Düzeltilmiş Hali (IIFE):
{(() => { console.log(`Render anındaki recipe.steps (${recipe.id}):`, recipe.steps); return null; })()}
                  {/* Adım Listesi */}
                  <ul className="list-decimal list-inside text-sm">
                    {/* Adımlar varsa ve boş değilse map ile listele */}
                    {recipe.steps && recipe.steps.length > 0 ? (
                      recipe.steps.map((step, i) => <li key={i}>{step}</li>)
                    ) : (
                      // Adım yoksa veya boşsa mesaj göster
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

export default LikedRecipesPage; // Component'i export et