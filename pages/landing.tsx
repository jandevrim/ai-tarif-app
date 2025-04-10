// ✅ app/landing/page.tsx – ThermoChefAI Landing Page
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 text-gray-800">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="ThermoChefAI" width={40} height={40} />
          <h1 className="text-2xl font-bold">ThermoChefAI</h1>
        </div>
        <button
          onClick={() => router.push("/index")}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Uygulamaya Başla
        </button>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold mb-4">Yemekleri Yapay Zeka ile Keşfedin 🍳</h2>
          <p className="text-lg text-gray-700 mb-6">
            ThermoChefAI, evinizdeki malzemelere göre Thermomix ve ThermoGusto cihazlarına özel tarifler üretir. Pratik, yaratıcı ve lezzetli yemekler artık bir tık uzakta!
          </p>
          <button
            onClick={() => router.push("/index")}
            className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700"
          >
            Tarif Oluştur 🚀
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          <Image
            src="/hero.png"
            alt="ThermoChefAI Illustration"
            width={500}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ThermoChefAI. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
