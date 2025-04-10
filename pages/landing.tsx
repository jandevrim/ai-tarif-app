// ✅ pages/landing.tsx – Açılış Sayfası
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex flex-col items-center justify-center text-center p-6">
      <Image
        src="/thermochefai-logo.png"
        alt="ThermoChefAI Logo"
        width={180}
        height={180}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold text-green-800 mb-4">
        Hoş Geldiniz, ThermoChefAI!
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        AI destekli, Thermomix ve ThermoGusto uyumlu, yaratıcı tarifler oluşturun. Malzemelerinizi seçin, AI sizin için tarif oluştursun.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push("/custom")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg shadow"
        >
          Kendi Tarifini Oluştur
        </button>

        <button
          onClick={() => alert("Bu özellik yakında eklenecek 🚧")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-6 rounded text-lg shadow"
        >
          Mevcut Tarifleri Kullan
        </button>
      </div>
    </div>
  );
}
