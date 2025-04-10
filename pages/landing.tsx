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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Animation for button hover
  const buttonHover = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4A261] via-[#A7D7C5] to-[#84C7AE] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('/kitchen-pattern.png')] bg-repeat"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-[url('/spoon-fork.png')] bg-contain bg-no-repeat opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[url('/chef-hat.png')] bg-contain bg-no-repeat opacity-30"></div>

      {/* Logo */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-10"
      >
        <Image
          src="/logo.png"
          alt="ThermoChefAI Logo"
          width={250}
          height={250}
          className="mx-auto drop-shadow-lg"
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-5xl md:text-6xl font-extrabold text-[#1A3C34] mb-6 font-['Nunito'] tracking-wide drop-shadow-md"
      >
        Hoş Geldiniz, ThermoChefAI! 👨‍🍳
      </motion.h1>

      {/* Description */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="text-xl md:text-2xl text-[#2D5A4E] max-w-3xl mb-8 font-['Inter'] leading-relaxed"
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
        <motion.button
          onClick={() => router.push("/custom")}
          className="bg-[#F4A261] hover:bg-[#E48F45] text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-all"
          whileHover="hover"
          variants={buttonHover}
        >
          Kendi Tarifini Oluştur
        </motion.button>

        <motion.button
          onClick={() => alert("Bu özellik yakında eklenecek 🚧")}
          className="bg-[#1A3C34] hover:bg-[#2D5A4E] text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-all"
          whileHover="hover"
          variants={buttonHover}
        >
          Mevcut Tarifleri Kullan
        </motion.button>
      </motion.div>

      {/* Additional Fun Element: Floating Ingredients */}
      <motion.div
        className="absolute bottom-10 left-10 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Image src="/carrot.png" alt="Carrot" width={50} height={50} />
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
      >
        <Image src="/tomato.png" alt="Tomato" width={50} height={50} />
      </motion.div>
    </div>
  );
}