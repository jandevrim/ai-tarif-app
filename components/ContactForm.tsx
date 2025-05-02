"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Form gönderimi başarısız:", err);
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">{t("contact.title")}</h2>

      {sent ? (
        <p className="text-green-600">{t("contact.successMessage")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t("contact.namePlaceholder")}
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder={t("contact.emailPlaceholder")}
            className="w-full border rounded p-2"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            placeholder={t("contact.messagePlaceholder")}
            className="w-full border rounded p-2 h-24"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            {t("contact.sendButton")}
          </button>
          {error && <p className="text-red-600">{t("contact.errorMessage")}</p>}
        </form>
      )}
    </div>
  );
}