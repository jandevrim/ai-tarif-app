
// ✅ pages/api/generate-recipe.ts – Güncellenmiş: OpenAI çağrısı ve loglama ile
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed." });
  }

  const { ingredients, systemPrompt } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "Malzeme listesi boş olamaz." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API anahtarı eksik." });
  }

  const selectedNames = ingredients.map((i: any) =>
    typeof i === "string" ? i : i?.name?.tr || i?.name
  );

  const fullPrompt = `${systemPrompt || process.env.SYSTEM_PROMPT}

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

{
  "title": "...",
  "summary": "...",
  "duration": "...",
  "ingredients": ["...", "..."],
  "steps": ["...", "..."]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { role: "system", content: fullPrompt },
        { role: "user", content: "Tarifi oluştur" },
      ],
      temperature: 0.7,
    });

    const rawText = completion.choices?.[0]?.message?.content;

    console.log("OpenAI yanıtı:", rawText);

    if (!rawText) {
      throw new Error("OpenAI yanıtı boş geldi.");
    }

    const recipe = JSON.parse(rawText);
    res.status(200).json(recipe);
  } catch (error: any) {
    console.error("Tarif oluşturulamadı:", error.message || error);
    res.status(500).json({ error: "Tarif oluşturulurken hata oluştu." });
  }
}

