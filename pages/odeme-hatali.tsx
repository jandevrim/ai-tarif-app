// pages/odeme-hatali.tsx
"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function OdemeHataliPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ {t("payment.errorTitle", "Ödeme Başarısız!")}
      </h1>
      <p className="text-gray-700 text-lg">
        {t("payment.errorMessage", "Bir sorun oluştu. Lütfen tekrar deneyin veya bizimle iletişime geçin.")}
      </p>
      <button
        onClick={() => router.push("/kredi")}
        className="mt-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        {t("payment.retry", "Tekrar Dene")}
      </button>
    </div>
  );
}