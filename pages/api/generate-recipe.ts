// ✅ app/api/generate-recipe/route.ts — Vercel Edge API Route
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // Vercel Edge Function olarak çalıştır

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, systemPrompt } = body;

    if (!ingredients || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Malzeme listesi boş olamaz." }),
        { status: 400 }
      );
    }

    const selectedNames = ingredients.map((i: any) =>
      typeof i === "string" ? i : i?.name?.tr || i?.name
    );

    const fullPrompt = `${
      systemPrompt || process.env.SYSTEM_PROMPT
    }

Seçilen malzemeler: ${selectedNames.join(", ")}

Lütfen Thermomix TM6 veya Arzum Thermogusto cihazına uygun tarif oluştur. Aşağıdaki jargonu kullan:

- 5 saniye / hız 5
- Ölçüm kabını çıkarın
- Yoğurma modu
- Varoma ile buharda pişirme
- Ters dönüş
- 100°C’de 10 dakika
- Karıştırıcı modu
- Buhar fonksiyonu

Yanıtı yalnızca aşağıdaki şekilde, JSON olarak dön:

{
  "title": "...",
  "summary": "...",
  "duration": "...",
  "ingredients": ["...", "..."],
  "steps": ["...", "..."]
}
`;

    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { role: "system", content: fullPrompt },
        { role: "user", content: "Tarifi oluştur." },
      ],
      temperature: 0.7,
      max_tokens: 750,
    });

    const rawText = completion.choices?.[0]?.message?.content;
    console.log("⏱ Yanıt süresi:", Date.now() - startTime);
    console.log("OpenAI raw:", rawText);

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: "OpenAI yanıtı boş geldi." }),
        { status: 500 }
      );
    }

    const raw = rawText.trim().replace(/^```json|```$/g, "").trim();
    const recipe = JSON.parse(raw);
    console.log("✅ Tarif JSON:", JSON.stringify(recipe));

    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Tarif oluşturulamadı:", err);
    return new Response(
      JSON.stringify({ error: "Sunucu hatası: " + (err.message || err) }),
      { status: 500 }
    );
  }
}
