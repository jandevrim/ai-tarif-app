import React, { useState, useEffect } from 'react';
import RecipeFeedback from "../components/RecipeFeedback";
import LikedRecipesPage from './liked-recipes';
import { app } from "../utils/firebaseconfig";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { User } from "firebase/auth";
import { ensureUserInFirestore } from "../utils/userCredits";
import { getUserRecipeCredits } from "../utils/userCredits";
import { decrementRecipeCredit } from "../utils/firebaseconfig"; // sayfanın en üstüne ekle
import { getUserCredits, decrementCredits } from "../utils/userCredits";
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import HeroSection from "../components/HeroSection";
import DeviceSelector from "../components/DeviceSelector";
import CategoryButtons from "../components/CategoryButtons";
import LikedRecipesButton from "../components/LikedRecipesButton";
import AuthSection from "../components/AuthSection";
import Footer from "../components/Footer";
import ShareButtons from "../components/ShareButtons";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorBoundary from "../components/ErrorBoundary";
import MockIngredientSelector from "../components/MockIngredientSelector";
import i18n from '../utils/i18n';
import { query, where } from "firebase/firestore";


const db = getFirestore(app);
interface Ingredient {
  id: string;
  name: { tr: string; en: string };
  category: string;
  tags: string[];
  emoji?: string;
}

// --- Environment Variable Simulation ---
const IS_DEMO_MODE = false;
// --- Data Loading Logic ---
const demoIngredients: Ingredient[] = [
  { id: "domates", name: { tr: "domates", en: "Tomato" }, category: "sebze", tags: ['sebze', 'taze', 'kırmızı'], emoji: "🍅" },
  
];
// --- Helper Functions ---
const getStepWithEmoji = (step: string): string => {
  const mappings: { [key: string]: string } = {
    karıştır: "🌀", doğra: "🔪", kıy: "🔪", buhar: "♨️", sote: "🍳",
    kavur: "🍳", ısıt: "🔥", soğut: "🧊", hız: "💨", dakika: "⏱️",
    saniye: "⏱️", derece: "🌡️", yoğur: "🥖", tart: "⚖️", turbo: "🚀",
    smoothie: "🥤",
  };
  let result = step;
  for (const keyword in mappings) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(step)) {
      result = `${mappings[keyword]} ${step}`;
      break;
    }
  }
  return result;
};

const extractDeviceCommand = (text: string): string | null => {
  const regex = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
  const match = text.match(regex);
  return match ? match[0].replace(/\s+/g, ' ').trim() : null;
};

<LoadingIndicator />

// --- Page Components ---
function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedDevice, setSelectedDevice] = useState<"thermomix" | "thermogusto">("thermomix");
  const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider(); // Provider burada tanımlandı
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      await ensureUserInFirestore(currentUser); // artık doğru
    }
  });

  return () => unsubscribe();
}, []);
const fetchRecipeCount = async () => {
  try {
    const currentLang: "tr" | "en" = i18n.language.startsWith("en") ? "en" : "tr";
    const recipeQuery = query(
      collection(db, "likedRecipes"),

      where("tarifDili", "==", currentLang)
    );
    const snapshot = await getDocs(recipeQuery);
    setRecipeCount(snapshot.size);
  } catch (error) {
    console.error("Tarif sayısı alınamadı:", error);
  }
};
    fetchRecipeCount();
  const handleLogin = async () => {
    try {
      await signInWithPopup(getAuth(), provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await getAuth().signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleStart = async () => {
  if (!user) {
    await handleLogin();
    return;
  }

  const credits = await getUserRecipeCredits();
  if (credits <= 0) {
    router.push("/membership");
    return;
  }

  localStorage.setItem("cihazMarkasi", selectedDevice);
  onNavigate("/custom");
};

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      <main className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
       
        <div className="text-center space-y-5">
         
         <HeroSection onStart={handleStart} />
         <DeviceSelector
            selectedDevice={selectedDevice}
            onSelectDevice={setSelectedDevice}
            />
          <LikedRecipesButton recipeCount={recipeCount} onClick={() => onNavigate("/liked-recipes")} />
        </div>
        <CategoryButtons />
        <AuthSection
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onNavigateToUserPage={() => router.push("/user")}
        />
      </main>
      <Footer />
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const snapshot = await getDocs(collection(db, "ingredients"));
        if (snapshot.empty) {
          console.warn("Firebase'de 'ingredients' koleksiyonu boş.");
          setIngredients([]);
          return;
        }
        const data: Ingredient[] = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            name: docData.name && typeof docData.name === 'object'
              ? { tr: docData.name.tr || '', en: docData.name.en || '' }
              : { tr: docData.name || '', en: docData.name || '' },
            category: docData.category || 'diğer',
            tags: Array.isArray(docData.tags) ? docData.tags : [],
            emoji: docData.emoji || undefined
          } as Ingredient;
        });
        console.log("Firebase'den çekilen veriler:", data);
        setIngredients(data);
      } catch (err) {
        console.error("Firebase hatası:", crossOriginIsolated);
        setError("Malzemeler yüklenemedi.");
        setIngredients([]);
      }
    };
    fetchIngredients();
  }, []);

  const ingredientsToUse = IS_DEMO_MODE ? demoIngredients : ingredients;

  const handleSelectIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.find((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

   const handleLike = async () => {
        try {
          const user = getAuth().currentUser;
          if (!user) {
            alert(t('customRecipe.mustLoginToLike'));
            return;
          }
      
          await addDoc(collection(db, "likedRecipes"), {
            title: recipe.title,
            summary: recipe.summary,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            cihazMarkasi: recipe.cihazMarkasi || "tumu",
            tarifDili: i18n.language.startsWith("en") ? "en" : "tr",
            kullaniciTarifi: false,
            begeniSayisi: 1,
            userId: user.uid,
            createdAt: new Date(),
            recipeText: recipe.steps.join('\n')
          });
      
          alert(t('customRecipe.likeSuccess'));
        } catch (err) {
          alert(t('customRecipe.saveError'));
          console.error(err);
        }
      };


  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setCurrentStep(0);
    setShowSelector(false);

    const cihazMarkasi = localStorage.getItem("cihazMarkasi") || "tumu"; // Cihaz markasını al
    //bu aşaya dil kısmını ekle TODO
    const payload = {
      ingredients: selectedIngredients.map(i => ({ id: i.id, name: i.name.tr })),
      cihazMarkasi, // Cihaz markasını payload'a ekle
      lang: i18n.language.startsWith("en") ? "en" : "tr",
    };
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Sunucu hatası: ${response.statusText}` }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || typeof data !== 'object' || !data.steps || !data.ingredients || typeof data.title !== 'string') {
        throw new Error("API'den geçersiz veya eksik tarif verisi alındı.");
      }

      setRecipe({ ...data, cihazMarkasi }); // Cihaz markasını recipe'ye ekle
      
      const user = getAuth().currentUser;
      if (user) {
        await decrementRecipeCredit(user.uid);
        await handleLike(); //
      }
    } catch (err: any) {
      setError(err.message || t('customRecipe.errorCreatingRecipe'));
      setRecipe(null);
    } finally {
      setIsLoading(false);
    }
  };
  const handleStartOver = () => {
    setSelectedIngredients([]);
    setShowSelector(false);
    setIsLoading(false);
    setRecipe(null);
    setError(null);
    setCurrentStep(0);
  };

  const renderCurrentCard = () => {
    if (!recipe) return null;
     const extractDeviceCommandLocal = (text: string): string | null => {
      const regexTR = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|varoma|buharda pişirme|rendeleme|doğrama|yavaş pişirme|kaynatma|otomatik temizleme|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
    
      const regexEN = /(kneading mode|turbo(?:\s*\d*\s*(?:s|sec|seconds))?|reverse|varoma|steaming|steam cooking|chopping|slow cooking|grating|boiling|self-cleaning|auto clean|[\d\.]+\s*(?:s|sec|seconds|min|minutes)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:speed|rpm)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:speed|rpm)\s*[\d\.-]+)?|(?:speed|rpm)\s*[\d\.-]+)/i;
    
      const regex = i18n.language.startsWith("en") ? regexEN : regexTR;
    
      const slicedText = text.slice(2); // Adım başındaki "1." gibi kısımları at
      const match = slicedText.match(regex);
    
      return match ? match[0].replace(/\s+/g, " ").trim() : null;
    };
  //  const extractDeviceCommandLocal = (text: string): string | null => {
  //    const regexTR = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
  //    const regexEN = /(kneading mode|turbo(?:\s*\d*\s*(?:s|sec|seconds))?|reverse|[\d\.]+\s*(?:s|sec|seconds|min|minutes)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:speed|rpm)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:speed|rpm)\s*[\d\.-]+)?|(?:speed|rpm)\s*[\d\.-]+)/i; 
  //    const regex = i18n.language === "en" ? regexEN : regexTR;
  //    const match = text.match(regex);
  //return match ? match[0].replace(/\s+/g, ' ').trim() : null;
  //  };
  
    if (currentStep === 0) {
      // Başlangıç kartı
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-center"> 📋 {recipe.title || "Başlık yok"} </h2>
          <p className="italic text-sm mb-2 text-gray-600 text-center">{recipe.summary || "Özet yok"}</p>
          <p className="text-center mb-4"> {recipe.duration || "Belirtilmemiş"} </p>
          <div className="mb-4 p-3 border rounded bg-gray-50 max-h-32 overflow-y-auto">
          <h3 className="font-semibold mb-1">{t('customRecipe.requiredIngredients')}</h3>
            <ul className="list-disc list-inside text-sm">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing: string, idx: number) => (
                  <li key={idx}>{ing}</li>
                ))
              ) : (
                <li>{t('customRecipe.noIngredients')}</li>
              )}
            </ul>
          </div>
          <div className="text-center mt-4">
            {recipe.steps && recipe.steps.length > 0 && (
             <button
             onClick={() => setCurrentStep(1)}
             className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
           >
             {t('customRecipe.startPreparation')} →
           </button>
            )}
          </div>
        </div>
      );
    }
  
    if (currentStep >= 1 && currentStep <= recipe.steps.length) {
      // Adım kartları
      const stepIndex = currentStep - 1;
      const stepText = recipe.steps[stepIndex];
      const command = extractDeviceCommandLocal(stepText);
  
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-center">
          {t('customRecipe.stepstext')}{currentStep} / {recipe.steps.length}
          </h2>
          {command && (
            <div className="text-center text-lg font-bold text-green-700 mb-2 p-2 bg-green-50 rounded">
              {command}
            </div>
          )}
          <p className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded min-h-[6rem]">
            {getStepWithEmoji(stepText)}
          </p>
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full shadow-md transition duration-300"
            >
              ← {currentStep === 1 ? t('customRecipe.summary') : t('customRecipe.back')}
            </button>
            {currentStep < recipe.steps.length ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                {t('customRecipe.next')}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                {t('customRecipe.finish')}

              </button>
            )}
          </div>
        </div>
      );
    }
  
    if (currentStep > recipe.steps.length) {
      const cihazMarkasiLocal = recipe.cihazMarkasi || "tumu";
    
      const handleCopy = async () => {
        <ShareButtons title={recipe.title} recipeText={recipe.steps.join('\n')} />
        try {
          await navigator.clipboard.writeText(`${recipe.title}\n\n${recipe.steps.join('\n')}`);
        } catch (err) {
        }
      };
     
      const handleShare = async () => {
        if ('share' in navigator) {
          try {
            await navigator.share({ title: `Tarif: ${recipe.title}`, text: recipe.steps.join('\n') });
            
          } catch (err) {
            
          }
        }
      };
    
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in text-center">
          <h2 className="text-2xl font-bold mb-6">{t('customRecipe.didyoulikeit')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleLike}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
            >
             {t('customRecipe.like')}
            </button>
            <button
              onClick={handleCopy}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
            >
             {t('customRecipe.copy')}
            </button>
            {'share' in navigator ? (
              <button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
              >
                {t('customRecipe.share')}
              </button>
            ) : (
              <p className="text-sm text-gray-500">{t('customRecipe.pleaseshare')}</p>
            )}
          </div>
        </div>
      );
    };
    const handleStartOver = () => {
      setSelectedIngredients([]);
      setShowSelector(false);
      setIsLoading(false);
      setRecipe(null);
      setError(null);
      setCurrentStep(0);
    };
  
    return null; // Ensure the function returns something if no conditions are met
  };


  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans relative">
      {!isLoading && (
        <button
          onClick={() => onNavigate('/landing')}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow z-10"
        >
         {t('customRecipe.back')}
        </button>
      )}
      <h1 className="text-2xl font-bold mb-4 text-center pt-8">{t('customRecipe.createyourownrecipe')}</h1>
      {isLoading ? (
        <LoadingIndicator />
      ) : recipe ? (
        <>
          <div className="mt-6"> {renderCurrentCard()} </div>
          <div className="text-center mt-6">
            <button
              onClick={handleStartOver}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
            >
              {t('customRecipe.createNewRecipe')}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 p-3 border rounded bg-white/50 min-h-[5rem]">
            <h2 className="text-sm font-semibold mb-2">{t('customRecipe.selectedIngredients')}:</h2>
            {selectedIngredients.length === 0 ? (
              <p className="text-sm text-gray-500 italic">{t('customRecipe.addIngredient')}</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {selectedIngredients.map((i) => (
                  <span
                    key={i.id}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center shadow-sm"
                  >
                    {i.emoji && <span className="mr-1">{i.emoji}</span>}
                    <span>{i.name?.[i18n.language as "tr" | "en"] || i.name.tr || i.name.en || "?"}</span>
                    <button
                      onClick={() => setSelectedIngredients(selectedIngredients.filter((item) => item.id !== i.id))}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      aria-label={`Remove ${i.name?.[i18n.language as "tr" | "en"] || i.name.tr || i.name.en || "?"}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full mb-4 shadow-md transition duration-300 transform hover:scale-105"
          >
            {showSelector ? t('customRecipe.hideIngredientSelector') : t('customRecipe.showIngredientSelector')}
          </button>
          {showSelector && (
            <MockIngredientSelector
              selected={selectedIngredients}
              ingredients={ingredientsToUse}
              onSelect={handleSelectIngredient}
              onClose={() => setShowSelector(false)}
            />
          )}
          <div className="text-center mt-4">
            <button
              onClick={handleGenerateRecipe}
              disabled={selectedIngredients.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105"
            >
              {t('customRecipe.createRecipe')}
            </button>
          </div>
        </>
      )}
      {!isLoading && error && (
        <p className="text-red-600 mt-4 p-3 bg-red-100 border border-red-400 rounded text-center">
          {t('customRecipe.error')}: {error}
        </p>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

// --- Main App Component ---
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
  );
}
