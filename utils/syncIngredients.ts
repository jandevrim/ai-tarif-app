// utils/syncIngredients.ts
import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { ingredients as localIngredients } from "../data/ingredients";

const EMOJI_MAP: Record<string, string> = {
  domates: "🍅",
  patates: "🥔",
  soğan: "🧅",
  sarımsak: "🧄",
  havuç: "🥕",
  limon: "🍋",
  yumurta: "🥚",
  süt: "🥛",
  yoğurt: "🥣",
  peynir: "🧀",
  zeytin: "🫒",
  salatalık: "🥒",
  biber: "🌶️",
  un: "🌾",
  tuz: "🧂",
  şeker: "🍬",
  et: "🥩",
  tavuk: "🍗",
  balık: "🐟",
  ekmek: "🍞",
  su: "💧",
  tereyağı: "🧈",
  maydanoz: "🌿",
  nane: "🌿",
  çilek: "🍓",
  muz: "🍌",
  elma: "🍎",
  portakal: "🍊",
  karabiber: "⚫",
  pulbiber: "🔴",
  ceviz: "🌰",
  fındık: "🥜",
  kaju: "🥜",
  badem: "🌰",
  üzüm: "🍇",
  kayısı: "🍑",
  incir: "🍈",
  nar: "🍎",
  kekik: "🌿",
  kimyon: "🟤"
};
async function syncIngredientsToFirestore() {
  const snapshot = await getDocs(collection(db, "ingredients"));
  const existingNames = snapshot.docs.map((doc) =>
    doc.data().name.toLowerCase().trim() // Assuming Firestore 'name' is a string
  );

  const newOnes = localIngredients.filter(
    (item) => !existingNames.includes(item.name.tr.toLowerCase().trim()) // FIX: Use item.name.tr
  );

  console.log(`🎯 Toplam ${newOnes.length} yeni malzeme eklenecek.`);

  for (const item of newOnes) {
    // FIX: Use item.name.tr here too
    const cleanName = item.name.tr.trim();
    const emoji =
      EMOJI_MAP[cleanName.toLowerCase()] ||
      EMOJI_MAP[cleanName.toLowerCase().split(" ")[0]] ||
      "";

    try {
      // Ensure the 'name' field in Firestore stores the Turkish name
      await addDoc(collection(db, "ingredients"), {
        name: cleanName, // cleanName is now the Turkish name
        emoji,
        // Optional: You might want to store the English name too
        // name_en: item.name.en.trim(),
      });
      console.log(`✅ Eklendi: ${cleanName} ${emoji}`);
    } catch (error) {
      console.error(`❌ HATA: ${cleanName}`, error);
    }
  }
}

syncIngredientsToFirestore();