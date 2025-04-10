// ✅ generate-recipe.ts – Environment üzerinden systemPrompt kullanımı
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ingredients = req.body.ingredients;
  const systemPrompt = process.env.SYSTEM_PROMPT;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Eksik veya hatalı veri gönderildi." });
  }

  if (!systemPrompt) {
    return res.status(500).json({ error: "System prompt tanımlı değil." });
  }

  const userPrompt = `Lütfen şu malzemeleri içeren bir tarif öner: ${ingredients
    .map((i: string) => `"${i}"`)
    .join(", ")}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const rawText = completion.choices[0].message.content;
    const recipe = JSON.parse(rawText || "{}");

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Tarif oluşturulamadı:", error);
    return res.status(500).json({ error: "Tarif oluşturulurken hata oluştu." });
  }
}