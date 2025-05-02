// pages/odeme-basarili.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function OdemeBasariliPage() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Gerekirse kullanıcıya bilgi yenileme veya animation eklenebilir
    const timeout = setTimeout(() => {
      router.push("/"); // Anasayfaya otomatik yönlendirme (opsiyonel)
    }, 4000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ {t("payment.successTitle", "Ödeme Başarılı!")}
      </h1>
      <p className="text-gray-700 text-lg">
        {t("payment.successMessage", "Kredileriniz hesabınıza tanımlandı. Teşekkür ederiz.")}
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {t("payment.goHome", "Anasayfaya Dön")}
      </button>
    </div>
  );
}