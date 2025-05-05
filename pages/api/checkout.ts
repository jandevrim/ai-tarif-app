// pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { auth } from "../../utils/firebaseconfig";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { app } from "../../utils/firebaseconfig";
import { useTranslation } from "react-i18next";


const user = auth.currentUser;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // ⚠️ Güncellenmiş versiyon
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { priceId, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/odeme-basarili`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/odeme-hatali`,
      customer_email: email || undefined, // ✅ email burada kullanılabilir
      metadata: {
        priceId, // ✅ Webhook için gerekli
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session hatası:", err);
    res.status(500).json({ error: "Stripe bağlantı hatası" });
  }
}