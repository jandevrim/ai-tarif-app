import React from 'react';

// Main App component that renders the LandingPage
export default function App() {
  // In a real Next.js app, you'd use the actual router.
  // Here, we simulate navigation clicks with console logs.
  // Added 'string' type annotation to 'path' parameter to fix TypeScript error.
  const handleNavigate = (path: string) => {
    console.log(`Navigating to ${path}...`);
    // In a real app: router.push(path);
  };

  return <LandingPage onNavigate={handleNavigate} />;
}

// LandingPage component definition
// Added type annotation for the 'onNavigate' prop
function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    // Main container with min height, white background, and gray text
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      {/* Header Section - Removed */}

      {/* Main Content Area - Added padding top as header is removed */}
      <main className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
        {/* Hero Image Section - Replaced with Logo */}
        <div className="relative w-full max-w-xs mb-8">
          {/* Main Logo Display - Path updated for local use */}
          <img
            src="/logo.png" // Yerel kullanım için /logo.png olarak güncellendi
            alt="ThermoChefAI Ana Logo"
            width={300}
            height={300}
            className="rounded-2xl shadow-lg object-contain mx-auto"
            // Add error handling for local image loading if needed
            onError={(e) => {
              const target = e.target as HTMLImageElement; // Type assertion for target
              target.onerror = null; // Prevent infinite loop
              // Optionally display a placeholder or hide the image on error
              target.src="https://placehold.co/300x300/e0f2fe/334155?text=Logo+Bulunamadı";
              console.error("Logo yüklenemedi: /logo.png");
            }}
          />
        </div>

        {/* Text Content Section */}
        <div className="text-center space-y-5">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
            Yemekleri Yapay Zeka ile Keşfedin 🍳
          </h1>
          {/* Subtitle/Description */}
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir.
            Pratik, yaratıcı ve lezzetli yemekler artık bir tık uzakta!
          </p>
          {/* Call to Action Button */}
          <button
            onClick={() => onNavigate('/custom')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md w-full sm:w-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            Tarif Oluştur 🚀
          </button>
        </div>

        {/* Category Buttons Section - Updated with large Emojis */}
        <div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-md">
          {/* Category Button: Food */}
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
            {/* Large Emoji Food Icon */}
            <span className="text-4xl mb-1">🍲</span> {/* SVG replaced with Emoji */}
            <span className="font-medium text-gray-700">Food</span>
            <span className="text-xs text-gray-500">15+</span>
          </button>
          {/* Category Button: Drink */}
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
             {/* Large Emoji Drink Icon */}
             <span className="text-4xl mb-1">🍹</span> {/* SVG replaced with Emoji */}
            <span className="font-medium text-gray-700">Drink</span>
            <span className="text-xs text-gray-500">21+</span>
          </button>
          {/* Category Button: Dessert */}
          <button className="category-btn flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-center space-y-1 transition duration-300 ease-in-out">
             {/* Large Emoji Dessert Icon */}
             <span className="text-4xl mb-1">🍰</span> {/* SVG replaced with Emoji */}
            <span className="font-medium text-gray-700">Dessert</span>
            <span className="text-xs text-gray-500">19+</span>
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-center py-5 text-sm text-gray-500 border-t border-gray-200 mt-10">
        © 2025 ThermoChefAI. Tüm hakları saklıdır.
      </footer>

      {/* Include Tailwind CSS - Necessary for standalone preview */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
