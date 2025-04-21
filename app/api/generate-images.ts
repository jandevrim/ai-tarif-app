/ app/api/generate-images.ts

import { NextApiRequest, NextApiResponse } from "next";
import { generateAndUploadImages } from "../../utils/generateAndUploadImages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await generateAndUploadImages();
    res.status(200).json({ message: "Image generation completed." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Image generation failed." });
  }
}