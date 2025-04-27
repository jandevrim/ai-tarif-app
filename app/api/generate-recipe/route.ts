// app/api/generate-recipe/route.ts

import { NextRequest } from "next/server";
import OpenAI from "openai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Firebase setup
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(firebaseApp);

export const runtime = "edge";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { ingredients, cihazMarkasi = "tumu" } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: "Malzeme listesi boş olamaz." }), { status: 400 });
    }

    const validCihazMarkasi = ["thermomix", "thermogusto", "tumu"];
    if (!validCihazMarkasi.includes(cihazMarkasi)) {
      return new Response(JSON.stringify({ error: "Geçersiz cihaz markası" }), { status: 400 });
    }

    const selectedNames = ingredients.map((i: any) =>
      typeof i === "string" ? i : i?.name?.tr || i?.name
    ).filter(Boolean);

    let baseSystemPrompt = process.env.SYSTEM_PROMPT || "";
    if (cihazMarkasi === "thermomix") {
      baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOMIX || baseSystemPrompt;
    } else if (cihazMarkasi === "thermogusto") {
      baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOGUSTO || baseSystemPrompt;
    }

    const finalPrompt = `${baseSystemPrompt}

Seçilen malzemeler: ${selectedNames.join(", ")}

Yanıtı aşağıdaki JSON formatında döndür:

{
  "title": "...",
  "summary": "...",
  "duration": "...",
  "ingredients": ["...", "..."],
  "steps": ["...", "..."]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: finalPrompt },
        { role: "user", content: "Tarifi oluştur" },
      ],
      temperature: 0.7,
    });

    const rawText = response.choices[0]?.message?.content?.trim() || "";
    const cleanJson = rawText.replace(/^```json|```$/g, "").trim();
    let recipe;
    try {
      recipe = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(JSON.stringify({ error: "Invalid JSON response from AI", raw: rawText }), { status: 500 });
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Tarif oluşturulamadı:", error);
    return new Response(JSON.stringify({ error: "Sunucu hatası: " + error.message }), {
      status: 500,
    });
  }
}