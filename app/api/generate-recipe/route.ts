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
getStorage(firebaseApp);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// --- Locale Loader ---
async function loadLocale(locale: string) {
  try {
    const filePath = path.resolve(process.cwd(), `public/locales/${locale}.json`);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    const fallbackPath = path.resolve(process.cwd(), "public/locales/tr.json");
    const fallbackContent = await fs.readFile(fallbackPath, "utf8");
    return JSON.parse(fallbackContent);
  }
}

// --- System Prompt Seçici ---
function getSystemPrompt(cihaz: string, lang: string) {
  const suffix = cihaz === "thermomix"
    ? "THERMOMIX"
    : cihaz === "thermogusto"
    ? "THERMOGUSTO"
    : "";

  const envKey = `SYSTEM_PROMPT_${suffix}${lang === "en" ? "_EN" : ""}`;
  return process.env[envKey] || process.env.SYSTEM_PROMPT || "";
}

// --- Final Prompt Oluşturucu ---
function buildPrompt(basePrompt: string, ingredients: string[], lang: string) {
  const list = ingredients.join(", ");
  const label = lang === "en" ? "Selected ingredients" : "Seçilen malzemeler";
  const instruction = lang === "en"
    ? `Please respond in the following JSON format:\n\n{\n  "title": "...",\n  "summary": "...",\n  "duration": "...",\n  "ingredients": ["...", "..."],\n  "steps": ["...", "..."]\n}`
    : `Yanıtı aşağıdaki JSON formatında döndür:\n\n{\n  "title": "...",\n  "summary": "...",\n  "duration": "...",\n  "ingredients": ["...", "..."],\n  "steps": ["...", "..."]\n}`;

  return `${basePrompt}\n\n${label}: ${list}\n\n${instruction}`;
}

// --- Main Handler ---
export async function POST(req: NextRequest) {
  try {
    const queryLang = new URL(req.url).searchParams.get("lang");
    const body = await req.json();
    const { ingredients, cihazMarkasi = "tumu", lang: bodyLang } = body;
    const effectiveLang = queryLang ?? bodyLang ?? "tr";

    const texts = await loadLocale(effectiveLang);

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

    const baseSystemPrompt = getSystemPrompt(cihazMarkasi, effectiveLang);
    const finalPrompt = buildPrompt(baseSystemPrompt, selectedNames, effectiveLang);

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
    } catch {
      return new Response(JSON.stringify({ error: texts.parseError, raw: rawText }), { status: 500 });
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: `Sunucu hatası: ${error.message}` }), {
      status: 500,
    });
  }
}