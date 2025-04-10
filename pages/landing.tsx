// ✅ pages/landing.tsx - Modern ve mobil uyumlu açılış sayfası

import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="ThermoChefAI Logo"
          width={180}
          height={180}
          className="mx-auto"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-4">
        Hoş Geldiniz, ThermoChefAI!
      </h1>

      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-6">
        AI destekli, Thermomix ve ThermoGusto uyumlu yaratıcı tarifler oluşturun. Malzemelerinizi seçin, AI sizin için tarifi oluştursun.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/custom")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-all"
        >
          Kendi Tarifini Oluştur
        </button>

        <button
          onClick={() => alert("Bu özellik yakında eklenecek 🚧")}
          className="bg-white border border-gray-300 hover:border-emerald-400 text-gray-700 px-6 py-3 rounded-xl text-lg shadow-sm transition-all"
        >
          Mevcut Tarifleri Kullan
        </button>
      </div>
    </div>
  );
}
