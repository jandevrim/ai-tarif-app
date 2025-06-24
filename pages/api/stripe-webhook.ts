import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import admin from "firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // Stabil versiyona güncelle
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)
    ),
  });
}
const db = admin.firestore();

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

  // Ham gövdeyi logla (sorun giderme için)
  console.log("Raw Body:", rawBody.toString());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook Error:", {
      message: (err as Error).message,
      stack: (err as Error).stack,
      signature: sig,
      rawBody: rawBody.toString(),
    });
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email ?? session.metadata?.email;
    const priceId = session.metadata?.priceId || session.metadata?.packageId || "";

    const creditMap: Record<string, number> = {
      price_0RKI7IvafFXLIFZkLLt1OA2H: 20,
      price_0RKI88vafFXLIFZk9Xxpf1ai: 50,
      price_0RKI9MvafFXLIFZkgjOev9IP: 100,
    };

    const creditsToAdd = creditMap[priceId] ?? 0;
    console.log("📡 DEBUG – email:", email, "| priceId:", priceId, "| creditsToAdd:", creditsToAdd);

    if (!email || creditsToAdd === 0) {
      console.warn("⚠️ Geçersiz veri:", { email, priceId, creditsToAdd });
      return res.status(200).json({ received: true });
    }

    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    console.log("💡 LOG – email:", email, "priceId:", priceId, "credits:", creditsToAdd);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;

      await db.doc(`users/${userId}`).update({
        recipeCredits: admin.firestore.FieldValue.increment(creditsToAdd),
      });

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
  }

  res.status(200).json({ received: true });
}