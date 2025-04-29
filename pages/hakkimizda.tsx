"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hakkimizda() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t("about.title")}</h1>
        <p className="mb-4">
          <strong>ThermoChefAI</strong>, {t("about.paragraph1")}
        </p>
        <p className="mb-4">
          {t("about.paragraph2")}
        </p>
        <p>
          {t("about.paragraph3")}
        </p>
      </div>
    </div>
  );
}