import React, { useState, useEffect } from 'react';

// --- Error Boundary Component ---
// Catches rendering errors in its children and displays a fallback UI.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', margin: '20px', border: '2px dashed red', borderRadius: '8px', backgroundColor: '#fff0f0' }}>
          <h1 style={{ color: 'red', marginBottom: '10px' }}>Oops! Bir Hata Oluştu.</h1>
          <p>Uygulamanın bu bölümü görüntülenirken bir sorun yaşandı.</p>
          <p>Lütfen tarayıcı konsolunu kontrol edin veya daha sonra tekrar deneyin.</p>
          {/* Optionally display error details for debugging */}
          {this.state.error && (
              <details style={{ marginTop: '10px', whiteSpace: 'pre-wrap', background: '#ffe0e0', padding: '5px', borderRadius: '4px' }}>
                  <summary>Hata Detayları</summary>
                  {this.state.error.toString()}
              </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}


// --- Environment Variable Simulation ---
// Check for a hypothetical NEXT_PUBLIC_DEMO_MODE environment variable.
// In a real Next.js app, set this in your .env file (e.g., NEXT_PUBLIC_DEMO_MODE=no)
// and access via process.env.NEXT_PUBLIC_DEMO_MODE.
// Prefix with NEXT_PUBLIC_ is required to expose it to the browser.
// The 'process' object is not reliably available in all browser/preview environments.
// Therefore, for this preview, we hardcode IS_DEMO_MODE to true.
const IS_DEMO_MODE = false; // Hardcoded for preview - FIX for ReferenceError: process is not defined
console.log(`Demo mode active: ${IS_DEMO_MODE} (Preview Mode)`);

// --- Data Loading Logic ---
// (Data loading logic based on IS_DEMO_MODE would go here in a real app)

// --- Simulated Import / Demo Data ---
type Ingredient = {
  id: string;
  name: { tr: string; en: string };
  category: string;
  tags: string[];
  emoji?: string;
};

// --- DEBUG: Shortened ingredients array to test for data size issues ---
const ingredients: Ingredient[] = [
  { id: "domates", name: { tr: "domates", en: "Tomato" }, category: "sebze", tags: ['sebze', 'taze', 'kırmızı'], emoji: "🍅" },
  { id: "soğan", name: { tr: "soğan", en: "Onion" }, category: "sebze", tags: ['sebze', 'keskin', 'aromatik'], emoji: "🧅" },
  { id: "sarımsak", name: { tr: "sarımsak", en: "Garlic" }, category: "sebze", tags: ['sebze', 'aromatik', 'küçük'], emoji: "🧄" },
  { id: "tavuk_göğsü", name: { tr: "tavuk göğsü", en: "Chicken Breast" }, category: "et ürünleri", tags: ['et', 'beyaz', 'yağsız'] },
  { id: "süt", name: { tr: "süt", en: "Milk" }, category: "süt ürünleri", tags: ['süt', 'beyaz', 'sıvı'], emoji: "🥛" },
  { id: "peynir", name: { tr: "peynir", en: "Cheese" }, category: "süt ürünleri", tags: ['süt', 'katı', 'fermente'], emoji: "🧀" },
  { id: "nohut", name: { tr: "nohut", en: "Chickpeas" }, category: "bakliyat", tags: ['bakliyat', 'yuvarlak', 'protein'] },
  { id: "mercimek", name: { tr: "mercimek", en: "Lentils" }, category: "bakliyat", tags: ['bakliyat', 'küçük', 'protein'] },
  { id: "karabiber_b", name: { tr: "karabiber", en: "Black Pepper" }, category: "baharatlar", tags: ['baharat', 'keskin', 'toz'] },
  { id: "zeytinyağı_s", name: { tr: "zeytinyağı", en: "Olive Oil" }, category: "sıvılar", tags: ['sıvı', 'yağ', 'soğuk'], emoji: "🫒" },
  { id: "elma", name: { tr: "Elma" , en: "Apple"}, category: "meyveler", tags: ['meyve', 'tatlı', 'kırmızı'], emoji: "🍎" }, // Added a fruit example
];
// --- End of Shortened Data ---

// --- Mock Components ---
// Updated MockIngredientSelector to use the new 'ingredients' array
function MockIngredientSelector({
  selected,
  onSelect,
  onClose,
}: {
  selected: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  onClose: () => void;
}) {
  // Get unique categories dynamically from the imported ingredients
  const categories = React.useMemo(() => {
      // Ensure ingredients is an array before processing
      if (!Array.isArray(ingredients)) {
          console.error("Ingredients data is not an array!", ingredients);
          return [];
      }
      const uniqueCategories = new Set(ingredients.map(ing => ing.category));
      const categoryOrder = ['sebze', 'meyveler', 'et ürünleri', 'süt ürünleri', 'bakliyat', 'baharatlar', 'sıvılar', 'diğer'];
      return Array.from(uniqueCategories).sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.toLowerCase());
          const indexB = categoryOrder.indexOf(b.toLowerCase());
          if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'tr');
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
      });
  }, []); // Recalculate if ingredients array reference changes (it won't here)

  // Set initial active category safely
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

  // Effect to reset active category if categories change and current active is no longer valid
  useEffect(() => {
      if (categories.length > 0 && !categories.includes(activeCategory)) {
          setActiveCategory(categories[0]);
      } else if (categories.length === 0) {
          setActiveCategory('');
      }
  }, [categories, activeCategory]);


  return (
    <div className="p-4 border rounded-lg bg-white shadow-md mb-4">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3 mb-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 rounded-full text-sm transition duration-200 ease-in-out shadow-sm ${
              activeCategory === category
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Ingredient List for Active Category */}
      <h3 className="font-semibold mb-2 text-gray-600">
          {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'Malzeme'} Listesi:
      </h3>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mb-4 pr-2">
        {/* Filter ingredients based on the active category */}
        {ingredients
            .filter(ing => ing.category === activeCategory)
            .map((ing) => {
               // Ensure ingredient has a valid id for the key
               if (!ing || typeof ing.id !== 'string') {
                   console.warn("Skipping ingredient with invalid id:", ing);
                   return null;
               }
               const isSelected = selected.some(sel => sel.id === ing.id);
               return (
                  <button
                    key={ing.id} // Use ingredient id as key
                    onClick={() => onSelect(ing)}
                    disabled={isSelected}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition duration-200 ease-in-out shadow-sm ${
                       isSelected
                         ? 'bg-gray-400 text-white cursor-not-allowed'
                         : 'bg-gray-100 hover:bg-green-100 text-gray-800'
                    }`}
                  >
                    {/* Conditionally render emoji if it exists */}
                    {ing.emoji && <span className="mr-1">{ing.emoji}</span>}
                    <span>{ing.name?.tr || 'İsimsiz'}</span> {/* Added fallback for name */}
                  </button>
               );
            })}
         {/* Update empty category message logic */}
         {ingredients.filter(ing => ing.category === activeCategory).length === 0 && activeCategory && (
            <p className="text-sm text-gray-500 italic">Bu kategoride malzeme bulunamadı.</p>
         )}
      </div>

      {/* Close Button - Gray and rounded-full */}
      <div className="text-right">
        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-gray-800 px-3 py-1 rounded-full text-sm shadow-sm transition duration-200 ease-in-out"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}


// --- Helper Components --- (LoadingIndicator remains the same)
function LoadingIndicator() {
  const loadingEmojis = ['🍳', '🥕', '🍅', '🧅', '🌶️', '🍲', '🥣', '🔪'];
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % loadingEmojis.length);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white/50 rounded-lg shadow-inner min-h-[200px]">
      <span className="text-6xl animate-pulse mb-4">
        {loadingEmojis[currentEmojiIndex]}
      </span>
      <p className="text-lg font-semibold text-gray-700">Tarifiniz hazırlanıyor...</p>
    </div>
  );
}

// --- Page Components ---

// #####################################################################
// ### LandingPage Component Definition                              ###
// #####################################################################
function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
    return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      <main className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
        <div className="relative w-full max-w-xs mb-8">
          <img
            src="/logo.png" // Assumes logo is in public folder for Next.js
            alt="ThermoChefAI Ana Logo"
            width={300}
            height={300}
            className="rounded-2xl shadow-lg object-contain mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop on error
              target.src="https://placehold.co/300x300/e0f2fe/334155?text=Logo+Bulunamadı"; // Fallback placeholder
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
          {/* Landing page button - Reference style */}
          <button
            onClick={() => onNavigate('/custom')} // Triggers navigation via prop
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tarif Oluştur 🚀
          </button>
        </div>
        {/* Category icons below landing text */}
        <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md">
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
            <span className="text-4xl mb-1">🍲</span>
            <span className="font-medium text-gray-700">Food</span>
            <span className="text-xs text-gray-500">15+</span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
             <span className="text-4xl mb-1">🍹</span>
            <span className="font-medium text-gray-700">Drink</span>
            <span className="text-xs text-gray-500">21+</span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
             <span className="text-4xl mb-1">🍰</span>
            <span className="font-medium text-gray-700">Dessert</span>
            <span className="text-xs text-gray-500">19+</span>
          </button>
        </div>
      </main>
      {/* Footer */}
      <footer className="text-center py-5 text-sm text-gray-500 border-t border-gray-200 mt-10">
        © 2025 ThermoChefAI. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
// #####################################################################
// ### End of LandingPage Component Definition                     ###
// #####################################################################


// CustomRecipePage component definition
function CustomRecipePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: summary, 1+: steps

  // Handler to select an ingredient
  const handleSelectIngredient = (ingredient: Ingredient) => {
    // Add only if not already selected
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  // Updated function to call the backend API
  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setCurrentStep(0);
    setShowSelector(false); // Close selector

    // Prepare data to send to the backend
    const payload = {
        ingredients: selectedIngredients.map(i => ({ id: i.id, name: i.name.tr }))
    };

    try {
      // Make the API call to the backend endpoint
      const response = await fetch("/api/generate-recipe", { // Ensure this path is correct
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Sunucu hatası: ${response.statusText}` }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response from the backend
      const data = await response.json();

      // Validate the received data structure
      if (!data || typeof data !== 'object' || !data.steps || !data.ingredients || typeof data.title !== 'string') {
          console.error("Invalid recipe data structure received from API:", data);
          throw new Error("API'den geçersiz veya eksik tarif verisi alındı.");
      }

      console.log("Received recipe data from API:", data);
      setRecipe(data); // Set the recipe state with data from the API

    } catch (err: any) {
      console.error("API call failed:", err);
      setError(err.message || "Tarif oluşturulurken bir hata oluştu.");
      setRecipe(null); // Clear any previous recipe on error
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Function to render the current recipe card (summary or step)
  const renderCurrentCard = () => {
     if (!recipe) return null;

    // Render Summary Card (Step 0)
    if (currentStep === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-center">
            📋 {recipe.title || "Başlık yok"}
          </h2>
          <p className="italic text-sm mb-2 text-gray-600 text-center">{recipe.summary || "Özet yok"}</p>
          <p className="text-center mb-4">
            <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"}
          </p>
          {/* Required Ingredients List */}
          <div className="mb-4 p-3 border rounded bg-gray-50 max-h-32 overflow-y-auto">
            <h3 className="font-semibold mb-1">Gereken Malzemeler:</h3>
            <ul className="list-disc list-inside text-sm">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing: string, idx: number) => (
                  <li key={idx}>{ing}</li>
                ))
              ) : (
                <li>Malzeme yok</li>
              )}
            </ul>
          </div>
          {/* Button to start steps */}
          <div className="text-center mt-4">
            {recipe.steps && recipe.steps.length > 0 && (
                 <button
                   onClick={() => setCurrentStep(1)}
                   // Green, rounded-full button style
                   className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
                 >
                   Hazırlanışa Başla &rarr;
                 </button>
            )}
          </div>
        </div>
      );
    }

    // Render Step Card (Step 1+)
    const stepIndex = currentStep - 1;
    if (recipe.steps && stepIndex >= 0 && stepIndex < recipe.steps.length) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-center">
            🍳 Hazırlık Adımı {currentStep} / {recipe.steps.length}
          </h2>
          {/* Step instruction */}
          <p className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded min-h-[6rem]">
            {recipe.steps[stepIndex]}
          </p>
          {/* Step Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            {/* Back button */}
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              // Gray, rounded-full button style
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full shadow-md transition duration-300"
            >
              &larr; {currentStep === 1 ? 'Özet' : 'Geri'}
            </button>
            {/* Next button or "Done" message */}
            {currentStep < recipe.steps.length ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                 // Green, rounded-full button style
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                Sonraki &rarr;
              </button>
            ) : (
              <span className="px-4 py-2 text-gray-500 font-semibold">Afiyet Olsun!</span>
            )}
          </div>
        </div>
      );
    }
    // Fallback if step index is invalid
     return <p>Tarif adımı bulunamadı.</p>;
  };

  // Function to reset state and start over
  const handleStartOver = () => {
     setSelectedIngredients([]);
     setShowSelector(false);
     setIsLoading(false);
     setRecipe(null);
     setError(null);
     setCurrentStep(0);
  }

  // Main render logic for CustomRecipePage
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans relative">
       {/* Back to Landing button (only show if not loading) */}
       {!isLoading && (
         <button
           onClick={() => onNavigate('/landing')}
           className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow z-10"
         >
           &larr; Geri
         </button>
       )}

      <h1 className="text-2xl font-bold mb-4 text-center pt-8">Kendi Tarifini Oluştur</h1>

      {/* Conditional Rendering: Loading / Recipe / Ingredient Selection */}
      {isLoading ? (
        // Show Loading Indicator when loading
        <LoadingIndicator />
      ) : recipe ? (
        // Show Recipe Card and Start Over button if recipe exists
         <>
           <div className="mt-6">
             {renderCurrentCard()}
           </div>
           <div className="text-center mt-6">
              <button
                 onClick={handleStartOver}
                 // Green, rounded-full button style
                 className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                 Yeni Tarif Oluştur
              </button>
           </div>
         </>
      ) : (
        // Show Ingredient Selection UI if not loading and no recipe
        <>
           {/* Display selected ingredients */}
           <div className="mb-4 p-3 border rounded bg-white/50 min-h-[5rem]">
             <h2 className="text-sm font-semibold mb-2">Seçilen Malzemeler:</h2>
             {selectedIngredients.length === 0 ? (
               <p className="text-sm text-gray-500 italic">Başlamak için malzeme ekleyin.</p>
             ) : (
               <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                 {selectedIngredients.map((i) => (
                   <span key={i.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
                     {/* Conditionally render emoji */}
                     {i.emoji && <span className="mr-1">{i.emoji}</span>}
                     <span>{i.name.tr}</span>
                     {/* Remove ingredient button */}
                     <button onClick={() => setSelectedIngredients(selectedIngredients.filter((item) => item.id !== i.id))} className="ml-2 text-red-500 hover:text-red-700 font-bold" aria-label={`Remove ${i.name.tr}`}>✕</button>
                   </span>
                 ))}
               </div>
             )}
           </div>

          {/* Toggle Ingredient Selector button - Green, rounded-full */}
          <button onClick={() => setShowSelector(!showSelector)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full mb-4 shadow-md transition duration-300 transform hover:scale-105">
            {showSelector ? 'Malzeme Seçiciyi Gizle' : 'Malzeme Ekle/Göster'}
          </button>

          {/* Conditionally render Ingredient Selector */}
          {showSelector && (
            <MockIngredientSelector
              selected={selectedIngredients}
              onSelect={handleSelectIngredient}
              onClose={() => setShowSelector(false)}
            />
          )}

          {/* Generate Recipe button - Main style */}
          <div className="text-center mt-4">
            <button
              onClick={handleGenerateRecipe}
              disabled={selectedIngredients.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105"
            >
               Tarif Oluştur
            </button>
          </div>
        </>
      )}

      {/* Display error message if exists (and not loading) */}
      {!isLoading && error && (
         <p className="text-red-600 mt-4 p-3 bg-red-100 border border-red-400 rounded text-center">Hata: {error}</p>
      )}

       {/* CSS for animations */}
       <style jsx global>{`
         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
         .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
         @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
         .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
       `}</style>

    </div>
  );
}


// --- Main App Component (Handles Routing) ---
// This component simulates page navigation for the preview environment.
// In a real Next.js app, you would use file-based routing or App Router.
export default function App() {
  // State to keep track of the currently displayed page
  const [currentPage, setCurrentPage] = useState('landing'); // Can be 'landing' or 'custom'

  // Function passed to child components to trigger navigation
  const handleNavigate = (path: string) => {
    console.log(`Simulating navigation to: ${path}`);
    // Update state based on the requested path
    if (path === '/custom') {
      setCurrentPage('custom');
    } else {
      // Default to landing page for any other path
      setCurrentPage('landing');
    }
  };

  // Render the component corresponding to the current page state
  return (
    <ErrorBoundary> { /* Wrap main content in Error Boundary */ }
      <div>
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'custom' && <CustomRecipePage onNavigate={handleNavigate} />}

        {/* Include Tailwind CSS - Necessary for standalone preview */}
        {/* Remove or comment out if Tailwind is configured via build process in your project */}
        <script src="https://cdn.tailwindcss.com"></script>
      </div>
    </ErrorBoundary>
  );
}
