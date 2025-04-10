// ✅ pages/index.tsx – Giriş sayfası
import React from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-100 to-blue-100">
      <h1 className="text-3xl font-bold mb-6">🍽️ AI Tarif Uygulaması</h1>

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