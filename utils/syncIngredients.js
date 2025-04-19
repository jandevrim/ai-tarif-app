"use strict";
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
// utils/syncIngredients.ts
var dotenv = require("dotenv");
dotenv.config();
var firebase_1 = require("./firebase");
var firestore_1 = require("firebase/firestore");
var ingredients_1 = require("../data/ingredients");
var EMOJI_MAP = {
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
function syncIngredientsToFirestore() {
    return __awaiter(this, void 0, void 0, function () {
        var snapshot, existingNames, newOnes, _i, newOnes_1, item, cleanName, emoji, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "ingredients"))];
                case 1:
                    snapshot = _a.sent();
                    existingNames = snapshot.docs.map(function (doc) {
                        return doc.data().name.toLowerCase().trim();
                    } // Assuming Firestore 'name' is a string
                    );
                    newOnes = ingredients_1.ingredients.filter(function (item) { return !existingNames.includes(item.name.tr.toLowerCase().trim()); } // FIX: Use item.name.tr
                    );
                    console.log("\uD83C\uDFAF Toplam ".concat(newOnes.length, " yeni malzeme eklenecek."));
                    _i = 0, newOnes_1 = newOnes;
                    _a.label = 2;
                case 2:
                    if (!(_i < newOnes_1.length)) return [3 /*break*/, 7];
                    item = newOnes_1[_i];
                    cleanName = item.name.tr.trim();
                    emoji = EMOJI_MAP[cleanName.toLowerCase()] ||
                        EMOJI_MAP[cleanName.toLowerCase().split(" ")[0]] ||
                        "";
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    // Ensure the 'name' field in Firestore stores the Turkish name
                    return [4 /*yield*/, (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, "ingredients"), {
                            name: cleanName, // cleanName is now the Turkish name
                            emoji: emoji,
                            // Optional: You might want to store the English name too
                            // name_en: item.name.en.trim(),
                        })];
                case 4:
                    // Ensure the 'name' field in Firestore stores the Turkish name
                    _a.sent();
                    console.log("\u2705 Eklendi: ".concat(cleanName, " ").concat(emoji));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u274C HATA: ".concat(cleanName), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
syncIngredientsToFirestore();
