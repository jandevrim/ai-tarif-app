// ✅ pages/landing.tsx – Modern Landing Page

import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-yellow-100 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="ThermoChefAI Logo" width={50} height={50} />
          <span className="text-xl font-bold">ThermoChefAI</span>
        </div>
        <button
          onClick={() => router.push("/custom")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Uygulamaya Başla
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row flex-1 items-center justify-between px-8 md:px-20 py-10">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Yemekleri Yapay Zeka ile Keşfedin 🍳
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir.
            Pratik, yaratıcı ve lezzetli yemekler artık bir tık uzakta!
          </p>
          <button
            onClick={() => router.push("/custom")}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full shadow-md"
          >
            Tarif Oluştur 🚀
          </button>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <Image
            src="/hero.png"
            alt="ThermoChefAI Hero"
            width={600}
            height={400}
            className="rounded-xl shadow-xl"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2025 ThermoChefAI. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
