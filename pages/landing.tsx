// pages/landing.tsx
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion"; // For animations

export default function LandingPage() {
  const router = useRouter();

  // Animation variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[#A7D7C5] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/kitchen-pattern.png')] bg-repeat"></div>
      </div>

      {/* Logo */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <Image
          src="/logo.png"
          alt="ThermoChefAI Logo"
          width={200}
          height={200}
          className="mx-auto"
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-4xl md:text-5xl font-extrabold text-[#1A3C34] mb-4 font-['Nunito'] tracking-wide"
      >
        Hoş Geldiniz, ThermoChefAI! 👨‍🍳
      </motion.h1>

      {/* Description */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-lg md:text-xl text-gray-800 max-w-2xl mb-6 font-['Inter']"
      >
        AI destekli, Thermomix ve ThermoGusto uyumlu yaratıcı tarifler oluşturun. Malzemelerinizi seçin, AI sizin için tarifi oluştursun! 🍳
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => router.push("/custom")}
          className="bg-[#F4A261] hover:bg-[#E48F45] text-white px-6 py-3 rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Kendi Tarifini Oluştur
        </button>

        <button
          onClick={() => alert("Bu özellik yakında eklenecek 🚧")}
          className="bg-white border border-[#1A3C34] hover:bg-[#1A3C34] hover:text-white text-[#1A3C34] px-6 py-3 rounded-full text-lg shadow-sm transition-all transform hover:scale-105"
        >
          Mevcut Tarifleri Kullan
        </button>
      </motion.div>
    </div>
  );
}