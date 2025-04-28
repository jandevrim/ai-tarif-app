import React, { useState, useEffect } from 'react';
import RecipeFeedback from "../components/RecipeFeedback";
import LikedRecipesPage from './liked-recipes';
import { app } from "../utils/firebaseconfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { User } from "firebase/auth";
import { ensureUserInFirestore } from "../utils/userCredits";
import { getUserRecipeCredits } from "../utils/userCredits";
import { decrementRecipeCredit } from "../utils/firebaseconfig"; // sayfanın en üstüne ekle
import { getUserCredits, decrementCredits } from "../utils/userCredits";
import { useRouter } from 'next/router';

const db = getFirestore(app);
interface Ingredient {
  id: string;
  name: { tr: string; en: string };
  category: string;
  tags: string[];
  emoji?: string;
}

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', margin: '20px', border: '2px dashed red', borderRadius: '8px', backgroundColor: '#fff0f0' }}>
          <h1 style={{ color: 'red', marginBottom: '10px' }}>Oops! Bir Hata Oluştu.</h1>
          <p>Uygulamanın bu bölümü görüntülenirken bir sorun yaşandı.</p>
          <p>Lütfen tarayıcı konsolunu kontrol edin veya daha sonra tekrar deneyin.</p>
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

// --- Share Component ---
interface ShareButtonsProps { title: string; recipeText: string; }
const ShareButtons: React.FC<ShareButtonsProps> = ({ title, recipeText }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${recipeText}`);
      console.log("Tarif panoya kopyalandı ✅");
    } catch (err) {
      console.error("Kopyalama işlemi başarısız:", err);
    }
  };

  const handleShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({ title: `Tarif: ${title}`, text: recipeText });
        console.log("Paylaşım başarılı.");
      } catch (err) {
        console.warn("Paylaşım iptal edildi veya başarısız:", err);
      }
    }
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleCopy}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
      >
        📋 Kopyala
      </button>
      {'share' in navigator ? (
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
        >
          📤 Paylaş
        </button>
      ) : (
        <p className="text-sm text-gray-500">Paylaşım desteklenmiyor, lütfen kopyalayın.</p>
      )}
    </div>
  );
};

// --- Mock Components ---
function MockIngredientSelector({
  selected,
  onSelect,
  onClose,
  ingredients = demoIngredients
}: {
  selected: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  onClose: () => void;
  ingredients?: Ingredient[];
}) {
  const categories = React.useMemo(() => {
    if (!Array.isArray(ingredients)) {
      console.error("Ingredients data is not an array!", ingredients);
      return [];
    }
    const uniqueCategories = new Set(ingredients.map((ing) => ing.category));
    const categoryOrder = ['sebze', 'meyveler', 'et ürünleri', 'süt ürünleri', 'bakliyat', 'baharatlar', 'sıvılar', 'diğer'];
    return Array.from(uniqueCategories).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.toLowerCase());
      const indexB = categoryOrder.indexOf(b.toLowerCase());
      if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'tr');
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [ingredients]);

  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    } else if (categories.length === 0) {
      setActiveCategory('');
    }
  }, [categories, activeCategory, ingredients]);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md mb-4">
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
      <h3 className="font-semibold mb-2 text-gray-600">
        {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'Malzeme'} Listesi:
      </h3>
      <div key={activeCategory} className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mb-4 pr-2">
        {(ingredients || []).filter((ing) => ing.category === activeCategory).map((ing) => {
          if (!ing || typeof ing.id !== 'string') {
            console.warn("Skipping ingredient with invalid id:", ing);
            return null;
          }
          const isSelected = selected.some((sel) => sel.id === ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => onSelect(ing)}
              disabled={isSelected}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition duration-200 ease-in-out shadow-sm ${
                isSelected ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gray-100 hover:bg-green-100 text-gray-800'
              }`}
            >
              {ing.emoji && <span className="mr-1">{ing.emoji}</span>}
              <span>{ing.name?.tr || 'İsimsiz'}</span>
            </button>
          );
        })}
        {(ingredients || []).filter((ing) => ing.category === activeCategory).length === 0 && activeCategory && (
          <p className="text-sm text-gray-500 italic">Bu kategoride malzeme bulunamadı.</p>
        )}
      </div>
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

// --- Helper Components ---
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
      <span className="text-6xl animate-pulse mb-4"> {loadingEmojis[currentEmojiIndex]} </span>
      <p className="text-lg font-semibold text-gray-700">Tarifiniz hazırlanıyor...</p>
    </div>
  );
}

// --- Page Components ---
function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedDevice, setSelectedDevice] = useState<"thermomix" | "thermogusto">("thermomix");
  const [user, setUser] = useState<User | null>(null);
  const provider = new GoogleAuthProvider(); // Provider burada tanımlandı
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const router = useRouter();


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
        const snapshot = await getDocs(collection(db, "likedRecipes"));
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
        <div className="relative w-full max-w-xs mb-8">
          <img
            src="/logo.png"
            alt="ThermoChefAI Ana Logo"
            width={300}
            height={300}
            className="rounded-2xl object-contain mx-auto"
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
          <button
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tarif Oluştur 🚀
          </button>
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
          <button
  onClick={() => onNavigate("/liked-recipes")}
  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
>
  💚 {recipeCount !== null
    ? `ThermoChef AI'dan ${recipeCount} Hazır Tarif!`
   : "Tarifler Yükleniyor..."}
</button>  
        </div>

        <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-sm">
          <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
            <span className="text-2xl">🍲</span>
            <span className="text-xs font-medium text-gray-700 text-center">Malzemelerini Seç</span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
            <span className="text-2xl">🍹</span>
            <span className="text-xs font-medium text-gray-700 text-center">AI Tarif Oluştursun</span>
          </button>
          <button className="category-btn flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center space-y-1 transition duration-200 ease-in-out">
            <span className="text-2xl">🍰</span>
            <span className="text-xs font-medium text-gray-700 text-center">Adım Adım Pişir</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          {user ? (
            <div className="flex flex-col items-center gap-2">
          
<p
  onClick={() => router.push("/user")}
  className="text-sm cursor-pointer hover:underline"
>
  👋 Hoş geldin, <strong>{user.displayName || "Kullanıcı"}</strong>
</p>

             <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 underline text-sm"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-white text-gray-800 font-semibold px-6 py-2 border border-gray-300 rounded-lg shadow hover:shadow-md flex items-center gap-2 mx-auto"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              Google ile Giriş Yap
            </button>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2025 ThermoChefAI. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <a href="/hakkimizda" className="hover:underline">Hakkımızda</a>
            <a href="/iletisim" className="hover:underline">İletişim</a>
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setCurrentStep(0);
    setShowSelector(false);

    const cihazMarkasi = localStorage.getItem("cihazMarkasi") || "tumu"; // Cihaz markasını al
    console.log("Cihaz markası (handleGenerateRecipe):", cihazMarkasi); // Log ekledim

    const payload = {
      ingredients: selectedIngredients.map(i => ({ id: i.id, name: i.name.tr })),
      cihazMarkasi, // Cihaz markasını payload'a ekle
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
        console.error("Invalid recipe data structure received from API:", data);
        throw new Error("API'den geçersiz veya eksik tarif verisi alındı.");
      }

      setRecipe({ ...data, cihazMarkasi }); // Cihaz markasını recipe'ye ekle
      console.log("API'den dönen veri:", data);

      const user = getAuth().currentUser;
      if (user) {
        await decrementRecipeCredit(user.uid);
      }
    } catch (err: any) {
      console.error("API call failed:", err);
      setError(err.message || "Tarif oluşturulurken bir hata oluştu.");
      setRecipe(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentCard = () => {
    if (!recipe) return null;
  
    const extractDeviceCommandLocal = (text: string): string | null => {
      const regex = /(yoğurma modu|turbo(?:\s*\d*\s*(?:sn|saniye))?|ters dönüş|[\d\.]+\s*(?:sn|saniye|dk|dakika)(?:\s*\/\s*\d+°C)?(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|\d+°C(?:\s*\/\s*(?:hız|devir)\s*[\d\.-]+)?|(?:hız|devir)\s*[\d\.-]+)/i;
      const match = text.match(regex);
      return match ? match[0].replace(/\s+/g, ' ').trim() : null;
    };
  
    if (currentStep === 0) {
      // Başlangıç kartı
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
          <h2 className="text-xl font-bold mb-2 text-center"> 📋 {recipe.title || "Başlık yok"} </h2>
          <p className="italic text-sm mb-2 text-gray-600 text-center">{recipe.summary || "Özet yok"}</p>
          <p className="text-center mb-4"> <strong>Süre:</strong> {recipe.duration || "Belirtilmemiş"} </p>
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
          <div className="text-center mt-4">
            {recipe.steps && recipe.steps.length > 0 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                Hazırlanışa Başla →
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
            🍳 Hazırlık Adımı {currentStep} / {recipe.steps.length}
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
              ← {currentStep === 1 ? "Özet" : "Geri"}
            </button>
            {currentStep < recipe.steps.length ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                Sonraki →
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                Bitti →
              </button>
            )}
          </div>
        </div>
      );
    }
  
    if (currentStep > recipe.steps.length) {
      const cihazMarkasiLocal = recipe.cihazMarkasi || "tumu";
    
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(`${recipe.title}\n\n${recipe.steps.join('\n')}`);
          console.log("Tarif panoya kopyalandı ✅");
        } catch (err) {
          console.error("Kopyalama işlemi başarısız:", err);
        }
      };
    
      const handleLike = async () => {
        try {
          const user = getAuth().currentUser;
          if (!user) {
            alert("Giriş yapmadan beğenemezsiniz.");
            return;
          }
    
          await RecipeFeedback({
            title: recipe.title,
            summary: recipe.summary,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            cihazMarkasi: cihazMarkasiLocal,
            tarifDili: "tr",
            kullaniciTarifi: false,
            begeniSayisi: 1,
            userId: user.uid,
            recipeText: recipe.steps.join('\n')
          });
    
          alert("Beğendiğinize Sevindik! 🎉");
        } catch (err) {
          alert("Kaydetme sırasında hata oluştu.");
          console.error(err);
        }
      };
    
      const handleShare = async () => {
        if ('share' in navigator) {
          try {
            await navigator.share({ title: `Tarif: ${recipe.title}`, text: recipe.steps.join('\n') });
            console.log("Paylaşım başarılı.");
          } catch (err) {
            console.warn("Paylaşım iptal edildi veya başarısız:", err);
          }
        }
      };
    
      return (
        <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in text-center">
          <h2 className="text-2xl font-bold mb-6">Tarifi Beğendiniz mi?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleLike}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
            >
              👍 Beğendim
            </button>
            <button
              onClick={handleCopy}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
            >
              📋 Kopyala
            </button>
            {'share' in navigator ? (
              <button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
              >
                📤 Paylaş
              </button>
            ) : (
              <p className="text-sm text-gray-500">Paylaşım desteklenmiyor, lütfen kopyalayın.</p>
            )}
          </div>
        </div>
      );
    }
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

  function handleStartOver(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 text-gray-900 font-sans relative">
      {!isLoading && (
        <button
          onClick={() => onNavigate('/landing')}
          className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow z-10"
        >
          ← Geri
        </button>
      )}
      <h1 className="text-2xl font-bold mb-4 text-center pt-8">Kendi Tarifini Oluştur</h1>
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
              Yeni Tarif Oluştur
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 p-3 border rounded bg-white/50 min-h-[5rem]">
            <h2 className="text-sm font-semibold mb-2">Seçilen Malzemeler:</h2>
            {selectedIngredients.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Başlamak için malzeme ekleyin.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {selectedIngredients.map((i) => (
                  <span
                    key={i.id}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center shadow-sm"
                  >
                    {i.emoji && <span className="mr-1">{i.emoji}</span>}
                    <span>{i.name.tr}</span>
                    <button
                      onClick={() => setSelectedIngredients(selectedIngredients.filter((item) => item.id !== i.id))}
                      className="ml-2 text-red-500 hover:text-red-700 font-bold"
                      aria-label={`Remove ${i.name.tr}`}
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
            {showSelector ? 'Malzeme Seçiciyi Gizle' : 'Malzeme Ekle/Göster'}
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
              Tarif Oluştur
            </button>
          </div>
        </>
      )}
      {!isLoading && error && (
        <p className="text-red-600 mt-4 p-3 bg-red-100 border border-red-400 rounded text-center">
          Hata: {error}
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