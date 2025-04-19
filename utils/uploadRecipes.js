"use strict";
// ⚠️ Bu dosya 39 tarif içerir: 20 Thermomix + 19 ThermoGusto tarifi.
// Kaynaklar: Christmas With Thermomix PDF + Arzum ThermoGusto Web
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
var firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
var app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
var db = (0, firestore_1.getFirestore)(app);
var recipes = [
    // 🔁 Diğer tarifler burada...
    {
        title: "Etsiz Çiğ Köfte",
        summary: "ThermoGusto ile kolay ve hijyenik şekilde hazırlanan etsiz çiğ köfte.",
        duration: "45 dakika",
        ingredients: [
            "1 demet maydanoz (sadece yaprakları)",
            "4 diş sarımsak",
            "25 g tatlı toz kırmızı biber",
            "15 g sumak",
            "1 çay kaşığı toz karabiber",
            "75 g tatlı biber salçası",
            "70 ml zeytinyağı",
            "2 tatlı kaşığı toz şeker",
            "300 g çiğ köftelik ince esmer bulgur",
            "2 adet kırmızı soğan (orta boy / 4’e bölünmüş)",
            "1 adet domates (soyulmuş / 4’e bölünmüş)",
            "30 g isot",
            "10 g toz kimyon",
            "1 çk karabiber",
            "1 tatlı kaşığı tuz",
            "50 g domates salçası",
            "50 ml nar ekşisi",
            "220 ml su"
        ],
        steps: [
            "Karıştırma kabının içerisine doğrayıcı bıçağı yerleştirin ve karıştırma kabını cihaza takın. Maydanoz yapraklarını hazneye ekleyerek kapağı kapatın. Cihazı 10 saniye/ Hız 6’a ayarlayın. İlerleyin ve başlat tuşuna basın.",
            "Kapağı açın maydanozları bir kaba alın ve hazneyi temizleyin. Diğer malzemeleri (soğan, domates, salçalar, baharatlar, su) hazneye ekleyin. Cihazı 10 saniye / Hız 10’a ayarlayın.",
            "Kapağı açın ve karışımı geniş bir kaba alın. Üzerini streç film ile kapatıp en az 30 dakika buzdolabında dinlendirin.",
            "Soğuyan karışıma ince kıydığınız maydanozu ekleyip elinizle yoğurun. İstediğiniz şekli vererek servis edin."
        ],
        cihazMarkasi: "thermogusto",
        tarifDili: "tr",
        kullaniciTarifi: false,
        begeniSayisi: 0,
        createdAt: firestore_1.Timestamp.now()
    },
    {
        title: "İrmik Helvası",
        summary: "ThermoGusto ile kolayca hazırlanan klasik irmik helvası.",
        duration: "40 dakika",
        ingredients: [
            "200 g irmik",
            "400 ml süt",
            "300 g toz şeker",
            "25 g dolmalık fıstık",
            "100 ml su",
            "75 g tereyağı"
        ],
        steps: [
            "Yüksek ateşte ocak üzerine bir tava alın, irmik ve dolmalık fıstığı renkleri koyulaşana kadar sürekli karıştırarak kavurun. Soğuması için bir kaba alın. İlerleyin.",
            "Karıştırma kabına 400 ml süt, 100 ml su, 275 g toz şeker ve 75 g tereyağını ekleyip kapağını kapatın. Cihazı 10 dakika / 110 derece/ Hız 1’e ayarlayın.",
            "Kapağı açın, kavrulmuş irmiği ekleyin. Cihazı 10 saniye/ Hız 3’e ayarlayın.",
            "Kapağı açın, spatula ile karıştırın. Cihazı 10 dakika/ 95 derece/ Hız 2’ye ayarlayın.",
            "Hazırladığınız helvayı bir kaba alın. Soğuduktan sonra dondurma ile servis edin."
        ],
        cihazMarkasi: "thermogusto",
        tarifDili: "tr",
        kullaniciTarifi: false,
        begeniSayisi: 0,
        createdAt: firestore_1.Timestamp.now()
    },
    {
        title: "Granola",
        summary: "ThermoGusto ile hazırlanmış sağlıklı ve lezzetli granola tarifi.",
        duration: "40 dakika",
        ingredients: [
            "275 g yulaf ezmesi",
            "50 g badem",
            "30 g ceviz",
            "1 yemek kaşığı akçaağaç şurubu",
            "44 g kuru kayısı (küçük parçalar)",
            "70 g kuru üzüm",
            "51 g goji berry",
            "135 ml bal",
            "100 g fındık",
            "40 g kaju"
        ],
        steps: [
            "Fırın 160 dereceye ısıtılır.",
            "Karıştırma kabına doğrayıcı bıçak takılır, fındık, kaju ve ceviz eklenir. 5 saniye / Hız 6’ya ayarlanır.",
            "Yulaf ezmesi, şurup, meyveler ve bal eklenir. 25 saniye / Hız 5’e ters yönde çalıştırılır.",
            "Fırın tepsisine yayılır. 160 derecede 30 dakika pişirilir.",
            "Soğuduktan sonra 30 saniye / Hız 3 ile karıştırılır.",
            "Kavanozda saklanır."
        ],
        cihazMarkasi: "thermogusto",
        tarifDili: "tr",
        kullaniciTarifi: false,
        begeniSayisi: 0,
        createdAt: firestore_1.Timestamp.now()
    },
    {
        title: "Kahvaltılık Ezme",
        summary: "Sabah kahvaltılarınız için ThermoGusto ile hazırlanmış ezme.",
        duration: "15 dakika",
        ingredients: [
            "2 diş sarımsak",
            "25 g çiğ fındık",
            "25 g çiğ badem",
            "6-8 dal taze kekik (yaprakları)",
            "20 ml zeytinyağı",
            "30 g domates salçası",
            "30 g tatlı biber salçası",
            "50 g kuru domates",
            "10 adet siyah zeytin (çekirdeksiz)",
            "50 g tulum peyniri",
            "1 çay kaşığı karabiber",
            "1 tatlı kaşığı kuru nane"
        ],
        steps: [
            "Doğrayıcı bıçak takılır. Sarımsak ve kekik yaprakları eklenir. 10 saniye / Hız 6.",
            "Fındık ve badem eklenir. 10 saniye / Hız 6.",
            "Zeytinyağı, salçalar, domates, zeytin, peynir ve baharatlar eklenir. 30 saniye / Hız 8.",
            "Servis tabağına alınır. Kızarmış ekmekle servis edilir."
        ],
        cihazMarkasi: "thermogusto",
        tarifDili: "tr",
        kullaniciTarifi: false,
        begeniSayisi: 0,
        createdAt: firestore_1.Timestamp.now()
    }
];
// Veri yükleme işlemi
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, recipes_1, recipe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loop_1 = function (recipe) {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("📤 Gönderiliyor:", recipe.title);
                                console.log("🧪 Veri:", JSON.stringify(recipe, null, 2));
                                return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(db, "likedRecipes"), recipe)
                                        .then(function () {
                                        console.log("✅ Yüklendi:", recipe.title);
                                    })
                                        .catch(function (error) {
                                        console.error("❌ HATA:", recipe.title);
                                        console.error("🔥 Firebase Hata Mesajı:", error.message || error);
                                    })];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, recipes_1 = recipes;
                _a.label = 1;
            case 1:
                if (!(_i < recipes_1.length)) return [3 /*break*/, 4];
                recipe = recipes_1[_i];
                return [5 /*yield**/, _loop_1(recipe)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); })();
