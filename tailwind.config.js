/** @type {import('tailwindcss').Config} */
module.exports = {
  // Stillerin uygulanacağı dosyaların yollarını buraya ekleyin
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Eğer Next.js App Router kullanıyorsanız aşağıdaki satırı da ekleyin:
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Eğer React kodunuz farklı bir klasördeyse, o yolu da ekleyin:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Burada projenize özel tema ayarlarını genişletebilirsiniz
      // Örnek:
      // colors: {
      //   'custom-green': '#10B981',
      // },
    },
  },
  plugins: [
    // Gerekirse Tailwind plugin'lerini buraya ekleyebilirsiniz
  ],
}
