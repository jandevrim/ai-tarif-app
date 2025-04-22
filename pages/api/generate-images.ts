// app/api/generate-images.ts
import type { NextApiRequest, NextApiResponse } from "next";
import generateAndUploadImages from "../../utils/generateAndUploadImages";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🚀 [API] /api/generate-images çağrıldı");

  if (req.method !== "GET") {
    console.log("❌ Yalnızca GET isteği destekleniyor");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("⏳ Görseller üretilmeye başlanıyor...");
    await generateAndUploadImages();
    console.log("✅ Görseller başarıyla işlendi.");
    res.status(200).json({ message: "Görseller başarıyla işlendi." });
  } catch (error: any) {
    console.error("🔥 HATA:", error.message || error);
    res.status(500).json({ error: error.message || "Bilinmeyen hata" });
  }
}