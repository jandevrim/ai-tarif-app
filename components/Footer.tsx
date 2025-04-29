"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="text-center py-6 text-sm text-gray-500 border-t mt-10 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>{t('landing.footerCopyright')}</p>
        <div className="flex gap-4">
          <a href="/hakkimizda" className="hover:underline">{t('landing.aboutUs')}</a>
          <a href="/iletisim" className="hover:underline">{t('landing.contact')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;