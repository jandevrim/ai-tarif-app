"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Iletisim() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t("contact.title")}</h1>
        <p className="mb-4">{t("contact.paragraph1")}</p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>{t("contact.emailLabel")}:</strong> destek@thermochefai.com</li>
          <li><strong>{t("contact.instagramLabel")}:</strong> <a href="https://instagram.com/thermochefai" target="_blank" className="text-blue-600 underline">@thermochefai</a></li>
          <li><strong>{t("contact.addressLabel")}:</strong> </li>
        </ul>
        <p>{t("contact.paragraph2")}</p>
      </div>
    </div>
  );
}