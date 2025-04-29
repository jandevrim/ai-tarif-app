"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface ShareButtonsProps {
  title: string;
  recipeText: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, recipeText }) => {
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${recipeText}`);
      console.log(t("share.copiedSuccess"));
    } catch (err) {
      console.error(t("share.copyFailed"), err);
    }
  };

  const handleShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({ title: `Tarif: ${title}`, text: recipeText });
        console.log(t("share.sharedSuccess"));
      } catch (err) {
        console.warn(t("share.shareFailed"), err);
      }
    }
  };

  return (
    <div className="mt-6 flex gap-4 justify-center">
      <button
        onClick={handleCopy}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
      >
        📋 {t("share.copy")}
      </button>
      {'share' in navigator ? (
        <button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition duration-300"
        >
          📤 {t("share.share")}
        </button>
      ) : (
        <p className="text-sm text-gray-500">{t("share.notSupported")}</p>
      )}
    </div>
  );
};

export default ShareButtons;