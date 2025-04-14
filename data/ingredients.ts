// ✅ ingredients.ts – Düzeltilmiş: Tekrarlar kaldırıldı, ID'ler benzersiz yapıldı.

// Ingredient tip tanımı (Projende merkezi bir yerde veya burada olabilir)
export type Ingredient = {
  id: string;
  name: { tr: string; en: string };
  category: string;
  tags: string[];
  emoji?: string; // Emoji opsiyonel
};

export const ingredients: Ingredient[] = [
  // Sebzeler
  { id: "domates", name: { tr: "domates", en: "Tomato" }, category: "sebze", tags: ['sebze', 'taze', 'kırmızı'], emoji: "🍅" },
  { id: "salatalık", name: { tr: "salatalık", en: "Cucumber" }, category: "sebze", tags: ['sebze', 'yeşil', 'serin'], emoji: "🥒" },
  { id: "patates", name: { tr: "patates", en: "Potato" }, category: "sebze", tags: ['sebze', 'yumru', 'nişastalı'], emoji: "🥔" },
  { id: "soğan", name: { tr: "soğan", en: "Onion" }, category: "sebze", tags: ['sebze', 'keskin', 'aromatik'], emoji: "🧅" },
  { id: "sarımsak", name: { tr: "sarımsak", en: "Garlic" }, category: "sebze", tags: ['sebze', 'aromatik', 'küçük'], emoji: "🧄" },
  { id: "havuç", name: { tr: "havuç", en: "Carrot" }, category: "sebze", tags: ['sebze', 'turuncu', 'kök'], emoji: "🥕" },
  { id: "biber", name: { tr: "biber", en: "Pepper" }, category: "sebze", tags: ['sebze', 'renkli', 'baharatlı'], emoji: "🌶️" },
  { id: "ıspanak", name: { tr: "ıspanak", en: "Spinach" }, category: "sebze", tags: ['sebze', 'yeşil', 'yapraklı'], emoji: "🥬" },
  { id: "marul", name: { tr: "marul", en: "Lettuce" }, category: "sebze", tags: ['sebze', 'yeşil', 'taze'], emoji: "🥬" },
  { id: "lahana", name: { tr: "lahana", en: "Cabbage" }, category: "sebze", tags: ['sebze', 'beyaz', 'katmanlı'], emoji: "🥬" },
  { id: "brokoli", name: { tr: "brokoli", en: "Broccoli" }, category: "sebze", tags: ['sebze', 'yeşil', 'çiçekli'], emoji: "🥦" },
  { id: "karnabahar", name: { tr: "karnabahar", en: "Cauliflower" }, category: "sebze", tags: ['sebze', 'beyaz', 'çiçekli'], emoji: "🥦" },
  { id: "kabak", name: { tr: "kabak", en: "Zucchini" }, category: "sebze", tags: ['sebze', 'yeşil', 'yumuşak'] },
  { id: "patlıcan", name: { tr: "patlıcan", en: "Eggplant" }, category: "sebze", tags: ['sebze', 'mor', 'etli'] },
  { id: "taze_fasulye", name: { tr: "taze fasulye", en: "Green Bean" }, category: "sebze", tags: ['sebze', 'yeşil', 'kılçıklı'] },
  { id: "pırasa", name: { tr: "pırasa", en: "Leek" }, category: "sebze", tags: ['sebze', 'uzun', 'aromatik'] },
  { id: "turp", name: { tr: "turp", en: "Radish" }, category: "sebze", tags: ['sebze', 'keskin', 'köklü'] },
  { id: "kereviz", name: { tr: "kereviz", en: "Celery" }, category: "sebze", tags: ['sebze', 'lifli', 'aromatik'] },
  { id: "şalgam", name: { tr: "şalgam", en: "Turnip" }, category: "sebze", tags: ['sebze', 'beyaz', 'sert'] },
  { id: "bezelye_sebze", name: { tr: "bezelye", en: "Pea" }, category: "sebze", tags: ['sebze', 'yeşil', 'tatlı'] }, // ID değiştirildi

  // Et Ürünleri
  { id: "dana_eti", name: { tr: "dana eti", en: "Beef" }, category: "et ürünleri", tags: ['et', 'kırmızı', 'protein'] },
  { id: "kuzu_eti", name: { tr: "kuzu eti", en: "Lamb" }, category: "et ürünleri", tags: ['et', 'kırmızı', 'yağlı'] },
  { id: "tavuk_göğsü", name: { tr: "tavuk göğsü", en: "Chicken Breast" }, category: "et ürünleri", tags: ['et', 'beyaz', 'yağsız'] },
  { id: "tavuk_but", name: { tr: "tavuk but", en: "Chicken Thigh" }, category: "et ürünleri", tags: ['et', 'beyaz', 'sulu'] },
  { id: "hindi_eti", name: { tr: "hindi eti", en: "Turkey" }, category: "et ürünleri", tags: ['et', 'beyaz', 'hafif'] },
  { id: "sucuk", name: { tr: "sucuk", en: "Sujuk" }, category: "et ürünleri", tags: ['et', 'baharatlı', 'kuru'] },
  { id: "pastırma", name: { tr: "pastırma", en: "Pastirma" }, category: "et ürünleri", tags: ['et', 'kurutulmuş', 'baharatlı'] },
  { id: "sosis", name: { tr: "sosis", en: "Sausage" }, category: "et ürünleri", tags: ['et', 'işlenmiş', 'atıştırmalık'] },
  { id: "kıyma", name: { tr: "kıyma", en: "Minced Meat" }, category: "et ürünleri", tags: ['et', 'kırmızı', 'çok yönlü'] },
  { id: "et_suyu", name: { tr: "et suyu", en: "Beef Stock" }, category: "et ürünleri", tags: ['et', 'yoğun', 'baz'] },
  { id: "bonfile", name: { tr: "bonfile", en: "Tenderloin" }, category: "et ürünleri", tags: ['et', 'kırmızı', 'yumuşak'] },
  { id: "pirzola", name: { tr: "pirzola", en: "Chop" }, category: "et ürünleri", tags: ['et', 'kemikli', 'ızgara'] },
  { id: "kanat", name: { tr: "kanat", en: "Chicken Wing" }, category: "et ürünleri", tags: ['et', 'beyaz', 'atıştırmalık'] },
  { id: "kavurma", name: { tr: "kavurma", en: "Fried Meat" }, category: "et ürünleri", tags: ['et', 'pişmiş', 'yoğun'] },
  { id: "ciğer", name: { tr: "ciğer", en: "Liver" }, category: "et ürünleri", tags: ['et', 'organ', 'yoğun'] },

  // Süt Ürünleri
  { id: "sut_urun", name: { tr: "süt", en: "Milk" }, category: "süt ürünleri", tags: ['süt', 'beyaz', 'sıvı'], emoji: "🥛" }, // ID değiştirildi
  { id: "yoğurt", name: { tr: "yoğurt", en: "Yogurt" }, category: "süt ürünleri", tags: ['süt', 'probiyotik', 'yoğun'], emoji: "🍶" },
  { id: "peynir", name: { tr: "peynir", en: "Cheese" }, category: "süt ürünleri", tags: ['süt', 'katı', 'fermente'], emoji: "🧀" },
  { id: "tereyagi_urun", name: { tr: "tereyağı", en: "Butter" }, category: "süt ürünleri", tags: ['süt', 'yağlı', 'katı'] }, // ID değiştirildi
  { id: "krema", name: { tr: "krema", en: "Cream" }, category: "süt ürünleri", tags: ['süt', 'yoğun', 'tatlı'] },
  { id: "kaymak", name: { tr: "kaymak", en: "Clotted Cream" }, category: "süt ürünleri", tags: ['süt', 'yoğun', 'kahvaltı'] },
  { id: "labne", name: { tr: "labne", en: "Labneh" }, category: "süt ürünleri", tags: ['süt', 'yumuşak', 'tatlı'] },
  { id: "kefir", name: { tr: "kefir", en: "Kefir" }, category: "süt ürünleri", tags: ['süt', 'fermente', 'içecek'] },
  { id: "süt_tozu", name: { tr: "süt tozu", en: "Milk Powder" }, category: "süt ürünleri", tags: ['süt', 'kurutulmuş', 'saklanabilir'] },
  { id: "çökelek", name: { tr: "çökelek", en: "Curd" }, category: "süt ürünleri", tags: ['süt', 'parçalı', 'yoğun'] },
  { id: "lor_peyniri", name: { tr: "lor peyniri", en: "Ricotta" }, category: "süt ürünleri", tags: ['süt', 'yumuşak', 'tatlı'] },
  { id: "kaşar_peyniri", name: { tr: "kaşar peyniri", en: "Kashar Cheese" }, category: "süt ürünleri", tags: ['süt', 'sert', 'eritilebilir'] },
  { id: "beyaz_peynir", name: { tr: "beyaz peynir", en: "Feta" }, category: "süt ürünleri", tags: ['süt', 'tuzlu', 'yumuşak'] },
  { id: "mozzarella", name: { tr: "mozzarella", en: "Mozzarella" }, category: "süt ürünleri", tags: ['süt', 'italyan', 'eritilebilir'] },
  { id: "parmesan", name: { tr: "parmesan", en: "Parmesan" }, category: "süt ürünleri", tags: ['süt', 'sert', 'rendelenmiş'] },

  // Bakliyat
  { id: "kuru_fasulye", name: { tr: "kuru fasulye", en: "White Beans" }, category: "bakliyat", tags: ['bakliyat', 'kuru', 'protein'] },
  { id: "nohut", name: { tr: "nohut", en: "Chickpeas" }, category: "bakliyat", tags: ['bakliyat', 'yuvarlak', 'protein'] },
  { id: "mercimek", name: { tr: "mercimek", en: "Lentils" }, category: "bakliyat", tags: ['bakliyat', 'küçük', 'protein'] },
  { id: "yeşil_mercimek", name: { tr: "yeşil mercimek", en: "Green Lentils" }, category: "bakliyat", tags: ['bakliyat', 'lifli', 'kuru'] },
  { id: "kırmızı_mercimek", name: { tr: "kırmızı mercimek", en: "Red Lentils" }, category: "bakliyat", tags: ['bakliyat', 'çorbalık', 'protein'] },
  { id: "barbunya", name: { tr: "barbunya", en: "Kidney Beans" }, category: "bakliyat", tags: ['bakliyat', 'kırmızı', 'kuru'] },
  { id: "bezelye_bakliyat", name: { tr: "bezelye (kuru)", en: "Split Peas" }, category: "bakliyat", tags: ['bakliyat', 'yeşil', 'kurutulmuş'] }, // ID değiştirildi
  { id: "bakla", name: { tr: "bakla", en: "Broad Beans" }, category: "bakliyat", tags: ['bakliyat', 'kurutulmuş', 'protein'] },
  { id: "maş_fasulyesi", name: { tr: "maş fasulyesi", en: "Mung Beans" }, category: "bakliyat", tags: ['bakliyat', 'yeşil', 'kuru'] },
  { id: "kara_fasulye", name: { tr: "kara fasulye", en: "Black Beans" }, category: "bakliyat", tags: ['bakliyat', 'siyah', 'yoğun'] },
  { id: "pirinç", name: { tr: "pirinç", en: "Rice" }, category: "bakliyat", tags: ['bakliyat', 'beyaz', 'temel'] },
  { id: "bulgur", name: { tr: "bulgur", en: "Bulgur" }, category: "bakliyat", tags: ['bakliyat', 'buğday', 'kırık'] },
  { id: "kinoa", name: { tr: "kinoa", en: "Quinoa" }, category: "bakliyat", tags: ['bakliyat', 'glutensiz', 'modern'] },
  { id: "arpa", name: { tr: "arpa", en: "Barley" }, category: "bakliyat", tags: ['bakliyat', 'tahıl', 'lifli'] },
  { id: "çavdar", name: { tr: "çavdar", en: "Rye" }, category: "bakliyat", tags: ['bakliyat', 'tahıl', 'koyu'] },

  // Baharatlar
  { id: "karabiber_baharat", name: { tr: "karabiber", en: "Black Pepper" }, category: "baharatlar", tags: ['baharat', 'keskin', 'toz'] }, // ID değiştirildi
  { id: "pul_biber_baharat", name: { tr: "pul biber", en: "Red Pepper Flakes" }, category: "baharatlar", tags: ['baharat', 'acı', 'kırmızı'] }, // ID değiştirildi
  { id: "kimyon", name: { tr: "kimyon", en: "Cumin" }, category: "baharatlar", tags: ['baharat', 'yoğun', 'toz'] },
  { id: "kekik_baharat", name: { tr: "kekik", en: "Oregano" }, category: "baharatlar", tags: ['baharat', 'kurutulmuş', 'aromatik'] }, // ID değiştirildi
  { id: "nane", name: { tr: "nane", en: "Mint" }, category: "baharatlar", tags: ['baharat', 'serin', 'kurutulmuş'] },
  { id: "sumak", name: { tr: "sumak", en: "Sumac" }, category: "baharatlar", tags: ['baharat', 'ekşi', 'mor'] },
  { id: "zencefil", name: { tr: "zencefil", en: "Ginger" }, category: "baharatlar", tags: ['baharat', 'köklü', 'keskin'] },
  { id: "zerdeçal", name: { tr: "zerdeçal", en: "Turmeric" }, category: "baharatlar", tags: ['baharat', 'sarı', 'şifalı'] },
  { id: "tarçın", name: { tr: "tarçın", en: "Cinnamon" }, category: "baharatlar", tags: ['baharat', 'tatlı', 'çubuk'] },
  { id: "karanfil", name: { tr: "karanfil", en: "Clove" }, category: "baharatlar", tags: ['baharat', 'keskin', 'koku'] },
  { id: "muskat", name: { tr: "muskat", en: "Nutmeg" }, category: "baharatlar", tags: ['baharat', 'tatlı', 'rendelenmiş'] },
  { id: "defne_yaprağı", name: { tr: "defne yaprağı", en: "Bay Leaf" }, category: "baharatlar", tags: ['baharat', 'aromatik', 'yaprak'] },
  { id: "biberiye", name: { tr: "biberiye", en: "Rosemary" }, category: "baharatlar", tags: ['baharat', 'yoğun', 'kurutulmuş'] },
  { id: "yenibahar", name: { tr: "yenibahar", en: "Allspice" }, category: "baharatlar", tags: ['baharat', 'yoğun', 'toz'] },
  { id: "susam", name: { tr: "susam", en: "Sesame" }, category: "baharatlar", tags: ['baharat', 'tohum', 'gevrek'] },

  // Sıvılar
  { id: "zeytinyagi_sivi", name: { tr: "zeytinyağı", en: "Olive Oil" }, category: "sıvılar", tags: ['sıvı', 'yağ', 'soğuk'], emoji: "🫒" }, // ID değiştirildi
  { id: "ayçiçek_yağı", name: { tr: "ayçiçek yağı", en: "Sunflower Oil" }, category: "sıvılar", tags: ['sıvı', 'yağ', 'kızartma'] },
  { id: "sirke", name: { tr: "sirke", en: "Vinegar" }, category: "sıvılar", tags: ['sıvı', 'ekşi', 'temizleyici'] },
  { id: "soya_sosu", name: { tr: "soya sosu", en: "Soy Sauce" }, category: "sıvılar", tags: ['sıvı', 'tuzlu', 'koyu'] },
  { id: "balzamik_sirke", name: { tr: "balzamik sirke", en: "Balsamic Vinegar" }, category: "sıvılar", tags: ['sıvı', 'tatlı', 'yoğun'] },
  { id: "susam_yağı", name: { tr: "susam yağı", en: "Sesame Oil" }, category: "sıvılar", tags: ['sıvı', 'aromatik', 'asma'] },
  { id: "limon_suyu", name: { tr: "limon suyu", en: "Lemon Juice" }, category: "sıvılar", tags: ['sıvı', 'asitli', 'taze'] },
  { id: "nar_ekşisi", name: { tr: "nar ekşisi", en: "Pomegranate Molasses" }, category: "sıvılar", tags: ['sıvı', 'ekşi', 'koyu'] },
  { id: "sebze_suyu", name: { tr: "sebze suyu", en: "Vegetable Broth" }, category: "sıvılar", tags: ['sıvı', 'baz', 'hafif'] },
  { id: "hindistancevizi_sütü", name: { tr: "hindistancevizi sütü", en: "Coconut Milk" }, category: "sıvılar", tags: ['sıvı', 'tatlı', 'egzotik'] },
  { id: "üzüm_suyu", name: { tr: "üzüm suyu", en: "Grape Juice" }, category: "sıvılar", tags: ['sıvı', 'meyve', 'doğal'] },
  { id: "şarap", name: { tr: "şarap", en: "Wine" }, category: "sıvılar", tags: ['sıvı', 'fermente', 'tatlandırıcı'] },
  { id: "süt_kreması", name: { tr: "süt kreması", en: "Liquid Cream" }, category: "sıvılar", tags: ['sıvı', 'yoğun', 'tatlı'] },
  { id: "acılı_sos", name: { tr: "acılı sos", en: "Hot Sauce" }, category: "sıvılar", tags: ['sıvı', 'baharatlı', 'kırmızı'] },

  // Tatlılar ve Hamur İşleri Malzemeleri
  { id: "toz_seker", name: { tr: "Toz Şeker", en: "Sugar" }, category: "tatlılar", tags: ["tatlı", "beyaz", "kristal"], emoji: "🍚" },
  { id: "un", name: { tr: "Un", en: "Flour" }, category: "tatlılar", tags: ["toz", "temel", "hamur"], emoji: "🌾" },
  { id: "yumurta_tatli", name: { tr: "Yumurta", en: "Egg" }, category: "tatlılar", tags: ["protein", "sarısı", "beyazı"], emoji: "🥚" }, // ID değiştirildi
  { id: "sut_tatli", name: { tr: "Süt", en: "Milk" }, category: "tatlılar", tags: ["sıvı", "süt ürünleri"], emoji: "🥛" }, // ID değiştirildi
  { id: "kabartma_tozu", name: { tr: "Kabartma Tozu", en: "Baking Powder" }, category: "tatlılar", tags: ["hamur", "kabartıcı", "toz"], emoji: "🎈" },
  { id: "vanilin", name: { tr: "Vanilin", en: "Vanillin" }, category: "tatlılar", tags: ["aroma", "tatlı", "toz"], emoji: "🌼" },
  { id: "kakao", name: { tr: "Kakao", en: "Cocoa Powder" }, category: "tatlılar", tags: ["çikolata", "toz", "bitter"], emoji: "🍫" },
  { id: "çikolata", name: { tr: "Çikolata", en: "Chocolate" }, category: "tatlılar", tags: ["tatlı", "bitter", "sütlü"], emoji: "🍬" },
  { id: "tereyagi_tatli", name: { tr: "Tereyağı", en: "Butter" }, category: "tatlılar", tags: ["yağ", "katı", "süt ürünleri"], emoji: "🧈" }, // ID değiştirildi
  { id: "muz", name: { tr: "Muz", en: "Banana" }, category: "tatlılar", tags: ["meyve", "tatlı", "yumuşak"], emoji: "🍌" },
  { id: "irmik", name: { tr: "İrmik", en: "Semolina" }, category: "tatlılar", tags: ["geleneksel", "un", "şerbetli"], emoji: "🌾" },
  { id: "nişasta", name: { tr: "Nişasta", en: "Starch" }, category: "tatlılar", tags: ["yoğunlaştırıcı", "şeffaf", "toz"], emoji: "🥄" },
  { id: "bal", name: { tr: "Bal", en: "Honey" }, category: "tatlılar", tags: ["doğal", "tatlandırıcı", "sıvı"], emoji: "🍯" },
  { id: "pekmez", name: { tr: "Pekmez", en: "Molasses" }, category: "tatlılar", tags: ["doğal", "üzüm", "besleyici"], emoji: "🟤" },
  { id: "gülsuyu", name: { tr: "Gülsuyu", en: "Rose Water" }, category: "tatlılar", tags: ["aromatik", "osmanlı", "likit"], emoji: "🌹" },
  { id: "fındık", name: { tr: "Fındık", en: "Hazelnut" }, category: "tatlılar", tags: ["kuruyemiş", "yağlı", "kavrulmuş"], emoji: "🌰" },
  { id: "ceviz", name: { tr: "Ceviz", en: "Walnut" }, category: "tatlılar", tags: ["kuruyemiş", "kıtır", "geleneksel"], emoji: "🥥" }, // Belki ceviz için farklı emoji? 🌰 daha uygun olabilir.
  { id: "badem", name: { tr: "Badem", en: "Almond" }, category: "tatlılar", tags: ["kuruyemiş", "rafine", "beyaz"], emoji: "🌰" },
  { id: "hindistan_cevizi", name: { tr: "Hindistan Cevizi", en: "Coconut" }, category: "tatlılar", tags: ["aromalı", "kıyılmış", "beyaz"], emoji: "🥥" },
  { id: "krem_santi", name: { tr: "Krem Şanti", en: "Whipped Cream" }, category: "tatlılar", tags: ["süsleme", "hafif", "kremalı"], emoji: "🍦" },
  { id: "puding_tozu", name: { tr: "Puding Tozu", en: "Pudding Mix" }, category: "tatlılar", tags: ["hazır", "kıvamlı", "çocuklar"], emoji: "🍮" },
  { id: "dondurma", name: { tr: "Dondurma", en: "Ice Cream" }, category: "tatlılar", tags: ["soğuk", "tatlı", "yaz"], emoji: "🍨" },

  // Meyveler (Eksikse ekleyelim)
  { id: "çilek", name: { tr: "Çilek", en: "Strawberry" }, category: "meyveler", tags: ["meyve", "kırmızı", "tatlı"], emoji: "🍓" },
  { id: "portakal", name: { tr: "Portakal", en: "Orange" }, category: "meyveler", tags: ["meyve", "turuncu", "sulu"], emoji: "🍊" },
  { id: "üzüm", name: { tr: "Üzüm", en: "Grape" }, category: "meyveler", tags: ["meyve", "mor", "tatlı"], emoji: "🍇" },
  { id: "karpuz", name: { tr: "Karpuz", en: "Watermelon" }, category: "meyveler", tags: ["meyve", "sulu", "yaz"], emoji: "🍉" },
  { id: "kiraz", name: { tr: "Kiraz", en: "Cherry" }, category: "meyveler", tags: ["meyve", "kırmızı", "küçük"], emoji: "🍒" },
];

