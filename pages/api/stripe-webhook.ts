// pages/api/stripe-webhook.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import admin from "firebase-admin";

// 🔐 Stripe + Firebase ayarları
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // Güncel ve stabil versiyon kullan
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
  });
}

const db = admin.firestore();

// ⛔️ Next.js'in body parser'ını devre dışı bırakıyoruz
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook doğrulama hatası:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email ?? session.metadata?.email;
    const priceId = session.metadata?.priceId;

    const creditMap: Record<string, number> = {
      "price_0RKI7IvafFXLIFZkLLt1OA2H": 20,
      "price_0RKI88vafFXLIFZk9Xxpf1ai": 50,
      "price_0RKI9MvafFXLIFZkgjOev9IP": 100,
    };

    const credits = creditMap[priceId ?? ""] ?? 0;
    console.log("✅ Webhook tetiklendi:", email, credits, priceId);

    if (email && credits > 0) {
      const snapshot = await db.collection("users").where("email", "==", email).get();
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await db.doc(`users/${userDoc.id}`).update({
          recipeCredits: admin.firestore.FieldValue.increment(credits),
        });

        await db.collection("creditPurchases").add({
          userId: userDoc.id,
          email,
          creditsAdded: credits,
          priceId,
          stripeAmountUSD: (session.amount_total ?? 0) / 100,
          createdAt: admin.firestore.Timestamp.now(),
        });

        console.log(`🎉 ${credits} kredi yüklendi: ${email}`);
      } else {
        console.warn(`⚠️ Kullanıcı bulunamadı: ${email}`);
      }
    }
  }

  res.status(200).json({ received: true });
}