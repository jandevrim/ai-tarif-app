// pages/api/stripe-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import admin from "firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Firebase Admin Init (gerekirse)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  });
}
const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false, // Stripe imzası için body ham formatta kalmalı
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await buffer(req);
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook doğrulama hatası:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const priceId = session.metadata?.priceId || session.metadata?.packageId;

    console.log("✅ Ödeme tamamlandı:", email, priceId);

    // 📌 Örnek eşleştirme (Price ID → kredi sayısı)
    const creditMap: Record<string, number> = {
      price_1YUMURTA20: 20,
      price_3YUMURTA50: 50,
      price_YUMURTALAR100: 100,
    };

    const credits = creditMap[priceId ?? ""] ?? 0;

    if (email && credits > 0) {
      const userSnapshot = await db.collection("users").where("email", "==", email).get();
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userId = userDoc.id;

        // 🔼 Kredi artır
        await db.doc(`users/${userId}`).update({
          credits: admin.firestore.FieldValue.increment(credits),
        });

        // 📄 Satın alma geçmişine ekle
        await db.collection("creditPurchases").add({
          userId,
          email,
          creditsAdded: credits,
          priceId,
          amountUSD: (session.amount_total ?? 0) / 100,
          createdAt: admin.firestore.Timestamp.now(),
        });

        console.log("✅ Kredi yüklendi ve kayıt oluşturuldu");
      } else {
        console.warn("⚠️ Kullanıcı bulunamadı:", email);
      }
    }
  }

  res.status(200).json({ received: true });
}