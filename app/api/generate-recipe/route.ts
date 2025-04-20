// ✅ app/api/generate-recipe/route.ts

import { NextRequest } from "next/server";
import OpenAI from "openai";
// useState import'u teknik olarak burada olmamalı ama kaldırmamam istendi.
import { useState } from "react";

export const runtime = "edge"; // Vercel Edge Function

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// !!! UYARI: Bu kod API route içinde çalışmaz !!!
// Cihaz markası için değişkeni alıyoruz
const [cihazMarkasi, setCihazMarkasi] = useState<"thermomix" | "thermogusto" | "tumu">("tumu");
const cihazMarkasiFromStorage = typeof window !== 'undefined' // Bu her zaman false dönecek
  ? (localStorage.getItem("cihazMarkasi") as "thermomix" | "thermogusto" | null)
  : null;
// Bitti bu bölüm.
// !!! UYARI BİTTİ !!!

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // body'den systemPrompt'ı kaldırdık, çünkü aşağıda belirleniyor varsayımıyla.
    const { ingredients } = body;

    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: "Malzeme listesi boş olamaz." }), {
        status: 400,
      });
    }

    const selectedNames = ingredients.map((i: any) =>
      typeof i === "string" ? i : i?.name?.tr || i?.name
    ).filter(Boolean); // Olası null/undefined değerleri filtrele

    // !!! UYARI: Buradaki 'cihazMarkasi' değişkeni yukarıdaki useState'den gelir
    // !!! ve API route'unda doğru değeri almaz/çalışmaz.
    // Cihaz markasına göre sistem prompt'unu seçiyoruz
    let baseSystemPrompt = process.env.SYSTEM_PROMPT || ""; // Temel prompt'u tanımla
    if (cihazMarkasi === "thermomix") {
       baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOMIX || baseSystemPrompt;
    } else if (cihazMarkasi === "thermogusto") {
       baseSystemPrompt = process.env.SYSTEM_PROMPT_THERMOGUSTO || baseSystemPrompt;
    }
    // !!! UYARI BİTTİ !!!


    // *** DÜZELTME: Prompt string'ini bir değişkene ata ***
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
`; // Değişkene atandı

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        // *** DÜZELTME: Oluşturulan finalPrompt'u kullan ***
        { role: "system", content: finalPrompt }, // Sistem mesajı olarak tüm prompt'u gönderiyoruz
        { role: "user", content: "Tarifi oluştur" }, // Veya bu mesajı boş bırakabilir veya kaldırabilirsiniz.
      ],
      temperature: 0.7,
    });

    const rawText = response.choices[0]?.message?.content?.trim() || "";

    // JSON'ı temizle ve ayrıştır (Bu kısım aynı kalabilir)
    const cleanJson = rawText.replace(/^```json|```$/g, "").trim();
    let recipe;
    try {
      recipe = JSON.parse(cleanJson);
    } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw text received:", rawText);
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