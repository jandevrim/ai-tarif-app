// ✅ pages/hakkimizda.tsx
import React from 'react';

export default function Hakkimizda() {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Hakkımızda</h1>
        <p className="mb-4">
          <strong>ThermoChefAI</strong>, Birleşik Arap Emirlikleri merkezli{' '}
          <strong>charge.consulting</strong> şirketi tarafından 2025 yılında hayata geçirilmiş,
          mutfak teknolojilerine yapay zeka desteği getirmeyi hedefleyen bir projedir. Amacımız, ev
          kullanıcılarının mutfakta geçirdiği zamanı verimli hale getirmek ve eldeki malzemelerle
          yaratıcı tarifler üretmektir.
        </p>
        <p className="mb-4">
          Uygulamamız, Thermomix ve ThermoGusto cihazları ile uyumlu tarifler oluşturur. Tarifler,
          sizin belirlediğiniz malzemelere göre, adım adım kolayca uygulanabilecek şekilde
          oluşturulur.
        </p>
        <p>
          Geri bildirimlerinizi bizimle paylaşarak, ThermoChefAI'nin gelişimine katkıda
          bulunabilirsiniz.
        </p>
      </div>
    </div>
  );
}