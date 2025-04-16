// ✅ app/api/generate-recipe/route.ts

import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // Vercel Edge Function

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, systemPrompt } = body;

    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: "Malzeme listesi boş olamaz." }), {
        status: 400,
      });
    }

    const selectedNames = ingredients.map((i: any) =>
      typeof i === "string" ? i : i?.name?.tr || i?.name
    );

    const prompt = `${systemPrompt || process.env.SYSTEM_PROMPT}

Seçilen malzemeler: ${selectedNames.join(", ")}

Lütfen Thermomix TM6 veya Arzum Thermogusto cihazına uygun tarif oluştur.
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
        { role: "system", content: prompt },
        { role: "user", content: "Tarifi oluştur" },
      ],
      temperature: 0.7,
    });

    const rawText = response.choices[0]?.message?.content?.trim() || "";

    const cleanJson = rawText.replace(/^```json|```$/g, "").trim();
    const recipe = JSON.parse(cleanJson);

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