"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LoadingIndicator: React.FC = () => {
  const { t } = useTranslation();
  const loadingEmojis = ['🍳', '🥕', '🍅', '🧅', '🌶️', '🍲', '🥣', '🔪'];
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % loadingEmojis.length);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white/50 rounded-lg shadow-inner min-h-[200px]">
      <span className="text-6xl animate-pulse mb-4">
        {loadingEmojis[currentEmojiIndex]}
      </span>
      <p className="text-lg font-semibold text-gray-700">
        {t("loading.message")}
      </p>
    </div>
  );
};

export default LoadingIndicator;