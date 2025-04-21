import type { NextApiRequest, NextApiResponse } from "next";
import { generateAndUploadImages } from "../../utils/generateAndUploadImages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("🟡 [generate-images] Başlatılıyor...");
    await generateAndUploadImages();
    console.log("🟢 [generate-images] Tüm tarifler başarıyla işlendi.");
    res.status(200).json({ message: "Tarif görselleri başarıyla işlendi." });
  } catch (error: any) {
    console.error("🔴 [generate-images] HATA:", error.message || error);
    res.status(500).json({ error: error.message || "Bilinmeyen hata" });
  }
}