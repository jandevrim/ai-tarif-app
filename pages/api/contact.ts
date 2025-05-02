// pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // .env.local içinde tanımlanmalı

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Eksik alanlar var." });
  }

  try {
    await resend.emails.send({
      from: "ThermoChefAI <jandevrim@gmail.com>", // doğrulanmış domain olmalı
      to: "jandevrim@gmail.com", // mesajları alacağın adres
      subject: `📨 Yeni İletişim Formu: ${name}`,
      html: `
        <p><strong>Ad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend hata:", error);
    res.status(500).json({ message: "Mesaj gönderilemedi." });
  }
}