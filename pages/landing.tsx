import React, { useState, useEffect } from 'react';
import RecipeFeedback from "../components/RecipeFeedback";
import LikedRecipesPage from './liked-recipes';
import { app } from "../utils/firebaseconfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);
// --- Error Boundary Component ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error: error }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) { console.error("ErrorBoundary caught an error:", error, errorInfo); }
  render() { /* ... ErrorBoundary render logic ... */
    if (this.state.hasError) { return ( <div style={{ padding: '20px', margin: '20px', border: '2px dashed red', borderRadius: '8px', backgroundColor: '#fff0f0' }}> <h1 style={{ color: 'red', marginBottom: '10px' }}>Oops! Bir Hata Oluştu.</h1> <p>Uygulamanın bu bölümü görüntülenirken bir sorun yaşandı.</p> <p>Lütfen tarayıcı konsolunu kontrol edin veya daha sonra tekrar deneyin.</p> {this.state.error && ( <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap', background: '#ffe0e0', padding: '5px', borderRadius: '4px' }}> <summary>Hata Detayları</summary> {this.state.error.toString()} </details> )} </div> ); } return this.props.children;
 }
}

// --- Environment Variable Simulation ---
const IS_DEMO_MODE = false; // Hardcoded true for preview to work
// console.log(`Demo mode active: ${IS_DEMO_MODE} (Preview Mode)`);

// --- Data Definition ---
type Ingredient = { id: string; name: { tr: string; en: string }; category: string; tags: string[]; emoji?: string; };

// --- Data Loading Logic ---
const demoIngredients: Ingredient[] = [ { id: "domates", name: { tr: "domates", en: "Tomato" }, category: "sebze", tags: ['sebze', 'taze', 'kırmızı'], emoji: "🍅" }, { id: "soğan", name: { tr: "soğan", en: "Onion" }, category: "sebze", tags: ['sebze', 'keskin', 'aromatik'], emoji: "🧅" }, { id: "sarımsak", name: { tr: "sarımsak", en: "Garlic" }, category: "sebze", tags: ['sebze', 'aromatik', 'küçük'], emoji: "🧄" }, { id: "tavuk_göğsü", name: { tr: "tavuk göğsü", en: "Chicken Breast" }, category: "et ürünleri", tags: ['et', 'beyaz', 'yağsız'] }, { id: "süt", name: { tr: "süt", en: "Milk" }, category: "süt ürünleri", tags: ['süt', 'beyaz', 'sıvı'], emoji: "🥛" }, { id: "peynir", name: { tr: "peynir", en: "Cheese" }, category: "süt ürünleri", tags: ['süt', 'katı', 'fermente'], emoji: "🧀" }, { id: "nohut", name: { tr: "nohut", en: "Chickpeas" }, category: "bakliyat", tags: ['bakliyat', 'yuvarlak', 'protein'] }, { id: "mercimek", name: { tr: "mercimek", en: "Lentils" }, category: "bakliyat", tags: ['bakliyat', 'küçük', 'protein'] }, { id: "karabiber_b", name: { tr: "karabiber", en: "Black Pepper" }, category: "baharatlar", tags: ['baharat', 'keskin', 'toz'] }, { id: "zeytinyağı_s", name: { tr: "zeytinyağı", en: "Olive Oil" }, category: "sıvılar", tags: ['sıvı', 'yağ', 'soğuk'], emoji: "🫒" }, { id: "elma", name: { tr: "Elma" , en: "Apple"}, category: "meyveler", tags: ['meyve', 'tatlı', 'kırmızı'], emoji: "🍎" }, ];
// In a real app, load full data when IS_DEMO_MODE is false
import { ingredients as fullIngredientsData } from '../data/ingredients';
const realIngredients: Ingredient[] = []; // Keep empty for preview
const ingredientsToUse = IS_DEMO_MODE ? demoIngredients : fullIngredientsData;
console.log(`Using ${IS_DEMO_MODE ? 'demo' : 'real'} ingredients. Count: ${ingredientsToUse.length}`);



// --- Helper Functions (defined globally or could be moved) ---
const getStepWithEmoji = (step: string): string => {
  const mappings: { [key: string]: string } = { karıştır: "🌀", doğra: "🔪", kıy: "🔪", buhar: "♨️", sote: "🍳", kavur: "🍳", ısıt: "🔥", soğut: "🧊", hız: "💨", dakika: "⏱️", saniye: "⏱️", derece: "🌡️", yoğur: "🥖", tart: "⚖️", turbo: "🚀", smoothie: "🥤", };
  let result = step;
  for (const keyword in mappings) { const regex = new RegExp(`\\b${keyword}\\b`, "i"); if (regex.test(step)) { result = `${mappings[keyword]} ${step}`; break; } }
  return result;
};

const extractDeviceCommand = (text: string): string | null => {
  const regex = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
  const match = text.match(regex);
  return match ? match[0].replace(/\s+/g, ' ').trim() : null;
};

// --- Share Component ---
interface ShareButtonsProps { title: string; recipeText: string; }
const ShareButtons: React.FC<ShareButtonsProps> = ({ title, recipeText }) => {
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(`${title}\n\n${recipeText}`); console.log("Tarif panoya kopyalandı ✅"); } catch (err) { console.error("Kopyalama işlemi başarısız:", err); }
  };
  const handleShare = async () => {
    // Check for support using 'in' operator before calling
    if ('share' in navigator) {
      try { await navigator.share({ title: `Tarif: ${title}`, text: recipeText }); console.log("Paylaşım başarılı."); } catch (err) { console.warn("Paylaşım iptal edildi veya başarısız:", err); }
    } else { console.warn("Cihazınız paylaşım desteği sunmuyor."); handleCopy(); } // Fallback to copy
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button onClick={handleCopy} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300" > 📋 Kopyala </button>
      {/* Corrected condition to check for share API support */}
      {'share' in navigator && ( // Use 'in' operator to check for method existence
        <button onClick={handleShare} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300" > 📤 Paylaş </button>
      )}
    </div>
  );
};


// --- Mock Components ---
function MockIngredientSelector({ /* ... props ... */ selected, onSelect, onClose }: { selected: Ingredient[]; onSelect: (ingredient: Ingredient) => void; onClose: () => void; }) {
  const categories = React.useMemo(() => { /* ... category calculation ... */ if (!Array.isArray(ingredientsToUse)) { console.error("Ingredients data is not an array!", ingredientsToUse); return []; } const uniqueCategories = new Set(ingredientsToUse.map(ing => ing.category)); const categoryOrder = ['sebze', 'meyveler', 'et ürünleri', 'süt ürünleri', 'bakliyat', 'baharatlar', 'sıvılar', 'diğer']; return Array.from(uniqueCategories).sort((a, b) => { const indexA = categoryOrder.indexOf(a.toLowerCase()); const indexB = categoryOrder.indexOf(b.toLowerCase()); if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'tr'); if (indexA === -1) return 1; if (indexB === -1) return -1; return indexA - indexB; }); }, [ingredientsToUse]);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');
  useEffect(() => { /* ... effect to reset active category ... */ if (categories.length > 0 && !categories.includes(activeCategory)) { setActiveCategory(categories[0]); } else if (categories.length === 0) { setActiveCategory(''); } }, [categories, activeCategory]);
  // useEffect(() => { /* ... debug log ... */ const filtered = ingredientsToUse.filter(ing => ing.category === activeCategory); console.log(`SELECTOR: Category changed to "${activeCategory}". Filtered ingredients count: ${filtered.length}`); }, [activeCategory, ingredientsToUse]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md mb-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3 mb-3"> {categories.map((category) => ( <button key={category} onClick={() => setActiveCategory(category)} className={`px-3 py-1 rounded-full text-sm transition duration-200 ease-in-out shadow-sm ${ activeCategory === category ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700' }`} > {category.charAt(0).toUpperCase() + category.slice(1)} </button> ))} </div>
      {/* Ingredient List */}
      <h3 className="font-semibold mb-2 text-gray-600"> {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'Malzeme'} Listesi: </h3>
      <div key={activeCategory} className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mb-4 pr-2"> {/* Added key here */}
        {(ingredientsToUse || []).filter(ing => ing.category === activeCategory).map((ing) => { if (!ing || typeof ing.id !== 'string') { console.warn("Skipping ingredient with invalid id:", ing); return null; } const isSelected = selected.some(sel => sel.id === ing.id); return ( <button key={ing.id} onClick={() => onSelect(ing)} disabled={isSelected} className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition duration-200 ease-in-out shadow-sm ${ isSelected ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-100 hover:bg-green-100 text-gray-800' }`} > {ing.emoji && <span className="mr-1">{ing.emoji}</span>} <span>{ing.name?.tr || 'İsimsiz'}</span> </button> ); })}
         {(ingredientsToUse || []).filter(ing => ing.category === activeCategory).length === 0 && activeCategory && ( <p className="text-sm text-gray-500 italic">Bu kategoride malzeme bulunamadı.</p> )}
      </div>
      {/* Close Button */}
      <div className="text-right"> <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-3 py-1 rounded-full text-sm shadow-sm transition duration-200 ease-in-out" > Kapat </button> </div>
    </div>
  );
}


// --- Helper Components --- (LoadingIndicator remains the same)
function LoadingIndicator() { /* ... LoadingIndicator code ... */
  const loadingEmojis = ['🍳', '🥕', '🍅', '🧅', '🌶️', '🍲', '🥣', '🔪']; const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0); useEffect(() => { const intervalId = setInterval(() => { setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % loadingEmojis.length); }, 500); return () => clearInterval(intervalId); }, []); return ( <div className="flex flex-col items-center justify-center p-10 bg-white/50 rounded-lg shadow-inner min-h-[200px]"> <span className="text-6xl animate-pulse mb-4"> {loadingEmojis[currentEmojiIndex]} </span> <p className="text-lg font-semibold text-gray-700">Tarifiniz hazırlanıyor...</p> </div> );
}

// --- Page Components ---

// LandingPage component definition (Unchanged)
function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedDevice, setSelectedDevice] = useState<"thermomix" | "thermogusto">("thermomix");

  const handleStart = () => {
    localStorage.setItem("cihazMarkasi", selectedDevice);
    onNavigate("/custom");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      <main className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
        <div className="relative w-full max-w-xs mb-8">
          <img
            src="/logo.png"
            alt="ThermoChefAI Ana Logo"
            width={300}
            height={300}
            className="rounded-2xl shadow-lg object-contain mx-auto"
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
            Yemekleri Yapay Zeka ile Keşfedin 🍳
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir.
            Pratik, yaratıcı ve lezzetli yemekler artık bir tık uzakta!
          </p>

          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tarif Oluştur 🚀
          </button>

          {/* Cihaz Seçimi */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => setSelectedDevice("thermomix")}
              className={`px-4 py-2 rounded-full shadow ${
                selectedDevice === "thermomix" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Thermomix
            </button>
            <button
              onClick={() => setSelectedDevice("thermogusto")}
              className={`px-4 py-2 rounded-full shadow ${
                selectedDevice === "thermogusto" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              ThermoGusto
            </button>
          </div>

          {/* Beğenilen Tarifler Butonu */}
          <button
            onClick={() => onNavigate("/liked-recipes")}
            className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            💚 Beğenilen Tarifleri Gör
          </button>
        </div>

        {/* Tanıtıcı Kartlar */}
        <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md">
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
            <span className="text-4xl mb-1">🍲</span>
            <span className="font-medium text-gray-700">Evdeki Malzemelerini Seç!</span>
            <span className="text-xs text-gray-500"></span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
            <span className="text-4xl mb-1">🍹</span>
            <span className="font-medium text-gray-700">Yapay Zeka Sana Özel Tarifi Oluştursun!</span>
            <span className="text-xs text-gray-500"></span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
            <span className="text-4xl mb-1">🍰</span>
            <span className="font-medium text-gray-700">ThermoGusto ya da Thermomix ile adım adım pişir!</span>
            <span className="text-xs text-gray-500"></span>
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2025 ThermoChefAI. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <a href="/hakkimizda" className="hover:underline">
              Hakkımızda
            </a>
            <a href="/iletisim" className="hover:underline">
              İletişim
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


// CustomRecipePage component definition
function CustomRecipePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // --- Moved handlers inside the component ---
  const handleSelectIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsLoading(true); setError(null); setRecipe(null); setCurrentStep(0); setShowSelector(false);
    const payload = { ingredients: selectedIngredients.map(i => ({ id: i.id, name: i.name.tr })) };
    try {
      const response = await fetch("/api/generate-recipe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) { const errorData = await response.json().catch(() => ({ error: `Sunucu hatası: ${response.statusText}` })); throw new Error(errorData.error || `HTTP error! status: ${response.status}`); }
      const data = await response.json();
      if (!data || typeof data !== 'object' || !data.steps || !data.ingredients || typeof data.title !== 'string') { console.error("Invalid recipe data structure received from API:", data); throw new Error("API'den geçersiz veya eksik tarif verisi alındı."); }
      console.log("Received recipe data from API:", data); setRecipe(data);
    } catch (err: any) { console.error("API call failed:", err); setError(err.message || "Tarif oluşturulurken bir hata oluştu."); setRecipe(null); }
    finally { setIsLoading(false); }
  };

  const renderCurrentCard = () => {
     if (!recipe) return null;
     const extractDeviceCommandLocal = (text: string): string | null => {
         const regex = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
         const match = text.match(regex);
         return match ? match[0].replace(/\s+/g, ' ').trim() : null;
     };

    if (currentStep === 0) { /* ... Summary Card JSX ... */
      return ( <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in"> <h2 className="text-xl font-bold mb-2 text-center"> 📋 {recipe.title || "Başlık yok"} </h2> <p className="italic text-sm mb-2 text-gray-600 text-center">{recipe.summary || "Özet yok"}</p> <p className="text-center mb-4"> <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"} </p> <div className="mb-4 p-3 border rounded bg-gray-50 max-h-32 overflow-y-auto"> <h3 className="font-semibold mb-1">Gereken Malzemeler:</h3> <ul className="list-disc list-inside text-sm"> {recipe.ingredients && recipe.ingredients.length > 0 ? ( recipe.ingredients.map((ing: string, idx: number) => ( <li key={idx}>{ing}</li> )) ) : ( <li>Malzeme yok</li> )} </ul> </div> <div className="text-center mt-4"> {recipe.steps && recipe.steps.length > 0 && ( <button onClick={() => setCurrentStep(1)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105" > Hazırlanışa Başla &rarr; </button> )} </div> </div> );
    }
    const stepIndex = currentStep - 1;
    if (recipe.steps && stepIndex >= 0 && stepIndex < recipe.steps.length) {
      const stepText = recipe.steps[stepIndex];
      const command = extractDeviceCommandLocal(stepText); // Use local version
      const fullRecipeTextForSharing = [ // Prepare text for sharing
         recipe.title,
         recipe.summary, '',
         'Malzemeler:', ...(recipe.ingredients || []), '',
         'Hazırlık Adımları:', ...(recipe.steps || []).map((s: string, i: number) => `${i + 1}. ${s}`)
       ].join('\n');

      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-center">🍳 Hazırlık Adımı {currentStep} / {recipe.steps.length}</h2>
          {command && <div className="text-center text-lg font-bold text-green-700 mb-2 p-2 bg-green-50 rounded">{command}</div>} {/* Styled command */}
          <p className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded min-h-[6rem]">
            {getStepWithEmoji(stepText)} {/* Use global helper */}
          </p>
          <div className="flex justify-between items-center gap-4">
            <button onClick={() => setCurrentStep((prev) => prev - 1)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full shadow-md transition duration-300" > &larr; {currentStep === 1 ? "Özet" : "Geri"} </button>
			{currentStep < recipe.steps.length ? (
  <button
    onClick={() => setCurrentStep((prev) => prev + 1)}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
  >
    Sonraki &rarr;
  </button>
) : (
<div className="w-full flex flex-col items-center mt-4">
  <span className="px-4 py-2 text-gray-500 font-semibold mb-4">
    Afiyet Olsun!
  </span>
  <RecipeFeedback
  title={recipe.title}
  recipeText={[
    recipe.summary,
    `Süre: ${recipe.duration}`,
    "Malzemeler:",
    ...recipe.ingredients,
    "Hazırlık Adımları:",
    ...recipe.steps,
  ].join("\n")}
  ingredients={recipe.ingredients}
  steps={recipe.steps} // ← Bunu ekledik
  cihazMarkasi="tumu"
  tarifDili="tr"
  kullaniciTarifi={false}
/>
  
</div>
)}
          </div>
          {/* Show ShareButtons only on the last step */}
          {currentStep === recipe.steps.length && (
            <ShareButtons title={recipe.title} recipeText={fullRecipeTextForSharing} />
          )}
        </div>
      );
    }
    return <p>Tarif adımı bulunamadı.</p>;
  };
  // --- END of Moved functions ---

  const handleStartOver = () => { setSelectedIngredients([]); setShowSelector(false); setIsLoading(false); setRecipe(null); setError(null); setCurrentStep(0); }

  // --- DEBUG LOG moved inside component ---
  // console.log("PAGE RENDER: Selected Ingredients:", selectedIngredients.map(i => i.name.tr));

  return ( <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans relative"> {!isLoading && ( <button onClick={() => onNavigate('/landing')} className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow z-10" > &larr; Geri </button> )} <h1 className="text-2xl font-bold mb-4 text-center pt-8">Kendi Tarifini Oluştur</h1> {isLoading ? ( <LoadingIndicator /> ) : recipe ? ( <> <div className="mt-6"> {renderCurrentCard()} </div> <div className="text-center mt-6"> <button onClick={handleStartOver} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105" > Yeni Tarif Oluştur </button> </div> </> ) : ( <> <div className="mb-4 p-3 border rounded bg-white/50 min-h-[5rem]"> <h2 className="text-sm font-semibold mb-2">Seçilen Malzemeler:</h2> {selectedIngredients.length === 0 ? ( <p className="text-sm text-gray-500 italic">Başlamak için malzeme ekleyin.</p> ) : ( <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto"> {/* Increased max-height */} {selectedIngredients.map((i) => ( <span key={i.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center shadow-sm"> {i.emoji && <span className="mr-1">{i.emoji}</span>} <span>{i.name.tr}</span> <button onClick={() => setSelectedIngredients(selectedIngredients.filter((item) => item.id !== i.id))} className="ml-2 text-red-500 hover:text-red-700 font-bold" aria-label={`Remove ${i.name.tr}`}>✕</button> </span> ))} </div> )} </div> <button onClick={() => setShowSelector(!showSelector)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full mb-4 shadow-md transition duration-300 transform hover:scale-105"> {showSelector ? 'Malzeme Seçiciyi Gizle' : 'Malzeme Ekle/Göster'} </button> {showSelector && ( <MockIngredientSelector selected={selectedIngredients} onSelect={handleSelectIngredient} onClose={() => setShowSelector(false)} /> )} <div className="text-center mt-4"> <button onClick={handleGenerateRecipe} disabled={selectedIngredients.length === 0} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105" > Tarif Oluştur </button> </div> </> )} {!isLoading && error && ( <p className="text-red-600 mt-4 p-3 bg-red-100 border border-red-400 rounded text-center">Hata: {error}</p> )} <style jsx global>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } } .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; } `}</style> </div> );
}
// --- Main App Component (Handles Routing) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const handleNavigate = (path: string) => {
	  if (path === '/custom') {
    setCurrentPage('custom');
  } else if (path === '/liked-recipes') {
    setCurrentPage('liked');
  } else {
    setCurrentPage('landing');
  }
};
  return (
  <ErrorBoundary>
    <div>
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'custom' && <CustomRecipePage onNavigate={handleNavigate} />}
      {currentPage === 'liked' && <LikedRecipesPage onNavigate={handleNavigate} />}
    </div>
  </ErrorBoundary>
);;
}
