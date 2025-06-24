"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { auth } from "../utils/firebaseconfig"; // doğruysa sorun yok
import { onAuthStateChanged } from "firebase/auth";

const creditOptions = [
  {
    id: "basic",
    amount: 20,
    price: 3.99,
    label: "🍳",
    stripePriceId: "price_0RKI7IvafFXLIFZkLLt1OA2H",
  },
  {
    id: "standard",
    amount: 50,
    price: 7.99,
    label: "🍳🍳🍳",
    stripePriceId: "price_0RKI88vafFXLIFZk9Xxpf1ai",
  },
  {
    id: "pro",
    amount: 100,
    price: 13.99,
    label: "🥚🥚🥚🥚🥚🥚🥚",
    stripePriceId: "price_0RKI9MvafFXLIFZkgjOev9IP",
  },
];

export default function KrediYuklePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        alert(t("auth.loginRequired", "Önce giriş yapmalısınız."));
        router.push("/");
      } else {
        setUser(firebaseUser);
      }
    });
    return () => unsubscribe();
    //const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    //  setUser(firebaseUser);
    //});
    //return () => unsubscribe();
  }, []);

  const handleSelect = async (option: any) => {
    if (!user) {
      alert("Önce giriş yapmalısınız.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: option.stripePriceId,
          email: user.email,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ödeme başlatılamadı.");
      }
    } catch (err) {
      console.error("Stripe yönlendirme hatası:", err);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-10">{t("credit.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditOptions.map((option) => (
          <div
            key={option.id}
            className="flex flex-col justify-between min-h-[280px] border border-gray-300 shadow-lg rounded-2xl p-6 text-center hover:border-green-500 hover:shadow-xl transition"
          >
            <div>
              <div className="text-5xl mb-2">{option.label.split(" ")[0]}</div>
              <h3 className="text-xl font-semibold">{option.label.split(" ").slice(1).join(" ")}</h3>
              <p className="text-gray-600 mt-2">{option.amount} {t("credit.unit")}</p>
              <p className="text-green-700 font-bold text-lg mt-2">${option.price.toFixed(2)} USD</p>
            </div>
            <button
              onClick={() => handleSelect(option)}
              disabled={loading}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {t("credit.buyButton")}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          ← {t("credit.backButton", "Geri Dön")}
        </button>
      </div>
    </div>
  );
}