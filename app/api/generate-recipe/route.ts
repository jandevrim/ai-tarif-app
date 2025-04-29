import { NextRequest } from "next/server";
import OpenAI from "openai";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import path from "path";
import { promises as fs } from "fs";

// --- Firebase Setup ---
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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// --- Locale Loader ---
async function loadLocale(locale: string) {
  try {
    const filePath = path.resolve(process.cwd(), `public/locales/${locale}.json`);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`Dil dosyası (${locale}) yüklenemedi, Türkçe yedeğe geçiliyor.`);
    const fallbackPath = path.resolve(process.cwd(), "public/locales/tr.json");
    const fallbackContent = await fs.readFile(fallbackPath, "utf8");
    return JSON.parse(fallbackContent);
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const localeFromQuery = url.searchParams.get("lang");
    const localeFromHeader = req.headers.get("accept-language")?.split(",")[0]?.slice(0, 2)?.toLowerCase();
    const locale = localeFromQuery || localeFromHeader || "tr";

    const texts = await loadLocale(locale);

    const { ingredients, cihazMarkasi = "tumu" } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: texts.emptyIngredients }), { status: 400 });
    }

    const validCihazMarkasi = ["thermomix", "thermogusto", "tumu"];
    if (!validCihazMarkasi.includes(cihazMarkasi)) {
      return new Response(JSON.stringify({ error: texts.invalidDevice }), { status: 400 });
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

${texts.extraInstruction || ""}

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
      return new Response(JSON.stringify({ error: texts.parseError, raw: rawText }), { status: 500 });
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Tarif oluşturulamadı:", error);
    return new Response(JSON.stringify({ error: `Sunucu hatası: ${error.message}` }), {
      status: 500,
    });
  }
}