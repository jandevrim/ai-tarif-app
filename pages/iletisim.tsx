// ✅ pages/iletisim.tsx
import React from 'react';

export default function Iletisim() {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">İletişim</h1>
        <p className="mb-4">
          Sorularınız, önerileriniz ya da iş birlikleri için bizimle iletişime geçebilirsiniz:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>E-posta:</strong> destek@thermochefai.com</li>
          <li><strong>Instagram:</strong> <a href="https://instagram.com/thermochefai" target="_blank" className="text-blue-600 underline">@thermochefai</a></li>
          <li><strong>Adres:</strong> İstanbul, Türkiye</li>
        </ul>
        <p>
          Size en kısa sürede geri dönüş yapmaya çalışacağız. İlginiz için teşekkür ederiz.
        </p>
      </div>
    </div>
  );
}