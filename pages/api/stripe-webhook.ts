import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import admin from "firebase-admin";

// Stripe başlat
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // stabilize edilmiş versiyon
});

// Firebase init (tek seferlik)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  });
}
const db = admin.firestore();

// Stripe Webhook yapılandırması
export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe Webhook doğrulama hatası:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const priceId = session.metadata?.priceId || session.metadata?.packageId;

    // Stripe fiyat ID'sine göre kredi sayısı
    const creditMap: Record<string, number> = {
      "price_1RKIW3S8FEqkrKCh7YYRLRfo": 20,
      "price_1RKIWiS8FEqkrKChEfwiMBZB": 50,
      "price_1RKIXGS8FEqkrKChkWOGsH4l": 100,
    };

    const creditsToAdd = creditMap[priceId ?? ""] ?? 0;

    if (email && creditsToAdd > 0) {
      const userSnapshot = await db.collection("users").where("email", "==", email).get();
      console.log("💡 LOG – email:", email, "priceId:", priceId, "credits:", creditsToAdd);
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        // 🔼 recipeCredits alanına ekleme
        await db.doc(`users/${userId}`).update({
          recipeCredits: admin.firestore.FieldValue.increment(creditsToAdd),
        });

        // 📄 İşlem geçmişi
        await db.collection("creditPurchases").add({
          userId,
          email,
          creditsAdded: creditsToAdd,
          priceId,
          stripeAmountUSD: (session.amount_total ?? 0) / 100,
          createdAt: admin.firestore.Timestamp.now(),
        });

        console.log(`✅ ${creditsToAdd} kredi yüklendi → ${email}`);
      } else {
        console.warn(`⚠️ Kullanıcı bulunamadı: ${email}`);
      }
    } else {
      console.warn("⚠️ email veya kredi eşleşmesi başarısız:", { email, priceId });
    }
  }

  res.status(200).json({ received: true });
}