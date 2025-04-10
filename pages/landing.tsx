import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="ThermoChefAI Logo" width={40} height={40} />
          <span className="text-xl font-bold text-green-600">ThermoChefAI</span>
        </div>
        <button
          onClick={() => router.push("/custom")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow"
        >
          Uygulamaya Başla
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center px-6 py-10 flex-1">
        {/* Hero Image */}
        <div className="relative w-full max-w-md mb-6">
          <Image
            src="/hero.png"
            alt="ThermoChefAI Hero"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
            priority
          />
          <div className="absolute -top-4 -left-4 bg-white p-2 rounded-full shadow">
            <Image src="/emoji1.png" alt="Emoji 1" width={30} height={30} />
          </div>
          <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow">
            <Image src="/emoji2.png" alt="Emoji 2" width={30} height={30} />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            Yemekleri Yapay Zeka ile Keşfedin 🍳
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir.
            Pratik, yaratıcı ve lezzetli yemekler artık bir tık uzakta!
          </p>
          <button
            onClick={() => router.push("/custom")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-md w-full sm:w-auto"
          >
            Tarif Oluştur 🚀
          </button>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-md">
          <button className="category-btn">
            <Image src="/food-icon.png" alt="Food Icon" width={40} height={40} />
            <span>Food</span>
            <span className="text-sm text-gray-500">15+</span>
          </button>
          <button className="category-btn">
            <Image src="/drink-icon.png" alt="Drink Icon" width={40} height={40} />
            <span>Drink</span>
            <span className="text-sm text-gray-500">21+</span>
          </button>
          <button className="category-btn">
            <Image src="/dessert-icon.png" alt="Dessert Icon" width={40} height={40} />
            <span>Dessert</span>
            <span className="text-sm text-gray-500">19+</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2025 ThermoChefAI. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}