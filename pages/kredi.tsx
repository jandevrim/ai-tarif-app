// pages/kredi.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const creditOptions = [
    {
      id: "basic",
      amount: 20,
      price: 3.99,
      label: "🍳",
      stripePriceId: "prod_SEleKjN92JaFhj" // Stripe Price ID burada tanımlanacak
    },
    {
      id: "standard",
      amount: 50,
      price: 7.99,
      label: "🍳🍳🍳",
      stripePriceId: "prod_SElfvbj5NkuTIe"
    },
    {
      id: "pro",
      amount: 100,
      price: 13.99,
      label: "🥚🥚🥚🥚🥚🥚🥚 ",
      stripePriceId: "prod_SElgmMocGVVCTa"
    },
  ];

export default function KrediYuklePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleSelect = (option: any) => {
    // Gerçek ödeme sayfasına yönlendirme burada yapılır
    router.push(`/odeme?paket=${option.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">{t("credit.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditOptions.map((option) => (
          <div
            key={option.id}
            className="cursor-pointer border border-gray-300 shadow-lg rounded-2xl p-6 text-center hover:border-green-500 hover:shadow-xl transition"
            onClick={() => handleSelect(option)}
          >
            <div className="text-5xl mb-2">{option.label.split(" ")[0]}</div>
            <h3 className="text-xl font-semibold">{option.label.split(" ").slice(1).join(" ")}</h3>
            <p className="text-gray-600 mt-2">{option.amount} {t("credit.unit")}</p>
            <p className="text-green-700 font-bold text-lg mt-2">{option.price} ₺</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              {t("credit.buyButton")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}