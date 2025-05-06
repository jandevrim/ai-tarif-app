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
async function loadLocale(locale: string, req: NextRequest) {
  try {

    const queryLang = new URL(req.url).searchParams.get("lang");
    const body = await req.json();
    const { ingredients, cihazMarkasi = "tumu" } = body;
    const langFromBody = body.lang;
    const effectiveLang = queryLang || langFromBody || "tr";

    const filePath = path.resolve(process.cwd(), `public/locales/${locale}.json`);
    console.log(`📁 Locale dosyası okunuyor: ${filePath}`);
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);
    console.log(`✅ Locale yüklendi: ${locale}`);

    data.extraInstruction = locale === "en" ? "Please prepare the recipe in English." : "";
    console.log(`📌 extraInstruction: "${data.extraInstruction}"`);

    return data;

  } catch (error) {
    console.error(`❌ Dil dosyası (${locale}) yüklenemedi: ${error}. Türkçe yedeğe geçiliyor.`);
    const fallbackPath = path.resolve(process.cwd(), "public/locales/tr.json");
    const fallbackContent = await fs.readFile(fallbackPath, "utf8");
    const fallbackData = JSON.parse(fallbackContent);
    fallbackData.extraInstruction = "";
    return fallbackData;
  }
}

// --- Main Handler ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, cihazMarkasi = "tumu", lang = "tr" } = body;

    // Lang kontrolü ve log
    const queryLang = new URL(req.url).searchParams.get("lang");
    const effectiveLang = queryLang || lang || "tr";
    console.log(`🌐 Detected language: "${effectiveLang}"`);

    const texts = await loadLocale(effectiveLang, req);

    // Validasyon
    if (!ingredients || ingredients.length === 0) {
      console.warn("⚠️ ingredients boş!");
      return new Response(JSON.stringify({ error: texts.emptyIngredients }), { status: 400 });
    }

    const validCihazMarkasi = ["thermomix", "thermogusto", "tumu"];
    if (!validCihazMarkasi.includes(cihazMarkasi)) {
      console.warn(`⚠️ Geçersiz cihaz markası: ${cihazMarkasi}`);
      return new Response(JSON.stringify({ error: texts.invalidDevice }), { status: 400 });
    }

    const selectedNames = ingredients.map((i: any) =>
      typeof i === "string" ? i : i?.name?.tr || i?.name
    ).filter(Boolean);

    console.log("🧂 Seçilen malzemeler:", selectedNames);

    let baseSystemPrompt = process.env.SYSTEM_PROMPT || "";
    if (cihazMarkasi === "thermomix") {
      baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOMIX || baseSystemPrompt;
    } else if (cihazMarkasi === "thermogusto") {
      baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOGUSTO || baseSystemPrompt;
    }

    const finalPrompt = `${baseSystemPrompt}

Seçilen malzemeler: ${selectedNames.join(", ")}

${texts.extraInstruction}

Yanıtı aşağıdaki JSON formatında döndür:

{
  "title": "...",
  "summary": "...",
  "duration": "...",
  "ingredients": ["...", "..."],
  "steps": ["...", "..."]
}
`;

    console.log("🧠 Final Prompt:\n", finalPrompt);

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
      console.error("❌ JSON parse hatası:", parseError);
      console.log("🧾 Ham yanıt:", rawText);
      return new Response(JSON.stringify({ error: texts.parseError, raw: rawText }), { status: 500 });
    }

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("❌ Tarif oluşturulamadı:", error);
    return new Response(JSON.stringify({ error: `Sunucu hatası: ${error.message}` }), {
      status: 500,
    });
  }
}