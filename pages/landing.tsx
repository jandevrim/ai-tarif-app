// ✅ landing.tsx - Düzenlenmiş cihaz seçimi ve navigasyon düzeltmeleriyle
import React, { useState, useEffect } from 'react';
import RecipeFeedback from "../components/RecipeFeedback";
import LikedRecipesPage from './liked-recipes';
import { app } from "../utils/firebaseconfig";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(app);

// --- ErrorBoundary (değişmedi) ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#fee', borderRadius: 8 }}>
          <h2 style={{ color: 'red' }}>Bir hata oluştu</h2>
          <p>Lütfen sayfayı yenileyin.</p>
          {this.state.error && <pre>{this.state.error.toString()}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}

function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [selectedDevice, setSelectedDevice] = useState<'thermomix' | 'thermogusto' | null>(null);

  const handleDeviceSelect = (device: 'thermomix' | 'thermogusto') => {
    setSelectedDevice(device);
  };

  const handleStart = () => {
    if (!selectedDevice) {
      alert("Lütfen bir cihaz seçin: Thermomix veya ThermoGusto");
      return;
    }
    localStorage.setItem("cihazMarkasi", selectedDevice);
    onNavigate('/custom');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      <main className="flex flex-col items-center px-6 py-10 pt-16 flex-1">
        <div className="text-center space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Yemekleri Yapay Zeka ile Keşfedin 🍳</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir.
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={() => handleDeviceSelect('thermomix')}
              className={`px-6 py-2 rounded-full border shadow-sm font-medium transition duration-200 ${
                selectedDevice === 'thermomix' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              Thermomix
            </button>
            <button
              onClick={() => handleDeviceSelect('thermogusto')}
              className={`px-6 py-2 rounded-full border shadow-sm font-medium transition duration-200 ${
                selectedDevice === 'thermogusto' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              ThermoGusto
            </button>
          </div>
          <button
            onClick={handleStart}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300"
          >
            Tarif Oluştur 🚀
          </button>
          <button
            onClick={() => onNavigate('/liked-recipes')}
            className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-8 py-3 rounded-full shadow-md"
          >
            💚 Beğenilen Tarifleri Gör
          </button>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const handleNavigate = (path: string) => {
    setCurrentPage(path === '/custom' ? 'custom' : path === '/liked-recipes' ? 'liked' : 'landing');
  };

  return (
    <ErrorBoundary>
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'custom' && <div>CustomRecipePage geliyor...</div>}
      {currentPage === 'liked' && <LikedRecipesPage onNavigate={handleNavigate} />}
    </ErrorBoundary>
  );
}
