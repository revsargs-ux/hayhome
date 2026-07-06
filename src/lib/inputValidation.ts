// Always accepted regardless of language: Latin letters (incl. diacritics), digits, whitespace, punctuation
const LATIN_AND_UNIVERSAL =
  /^[a-zA-ZÀ-ÖØ-öø-ÿ\d\s.,!?@#$%^&*()\-_+=[\]{};':"\\|/<>~`''«»—–…№ ​]*$/;

// Non-Latin script patterns, keyed by language code
const SCRIPT_PATTERNS: Record<string, RegExp> = {
  ru: /[Ѐ-ӿ]/,                              // Cyrillic
  hy: /[԰-֏ՙ-՟ﬓ-ﬗ]/,  // Armenian
  ar: /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/,  // Arabic
  fa: /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/,  // Persian (Arabic block)
  zh: /[一-鿿㐀-䶿　-〿]/,  // CJK + CJK punctuation
};

// Which languages have non-Latin scripts
const NON_LATIN_LANGS = new Set(["ru", "hy", "ar", "fa", "zh"]);

export function isCharAllowed(char: string, lang: string): boolean {
  if (LATIN_AND_UNIVERSAL.test(char)) return true;
  const scriptPattern = SCRIPT_PATTERNS[lang];
  return !!(scriptPattern && scriptPattern.test(char));
}

/** Strip characters not allowed for the given UI language, return cleaned string */
export function stripInvalidChars(text: string, lang: string): string {
  return text.split("").filter((c) => isCharAllowed(c, lang)).join("");
}

/** Returns true if text contains characters that don't belong to the selected language */
export function hasInvalidChars(text: string, lang: string): boolean {
  return text !== stripInvalidChars(text, lang);
}

// Phone / numeric-ish fields: digits, +, -, space, (, ), /
const PHONE_RE = /^[\d\s+\-()./*]*$/;

/** Strip everything except digits and common phone punctuation */
export function stripNonPhone(text: string): string {
  return text.replace(/[^\d\s+\-()./*]/g, "");
}

/** Strip everything except digits (for purely numeric fields like count, price) */
export function stripNonDigits(text: string): string {
  return text.replace(/[^\d]/g, "");
}

/** For mixed numeric fields: digits, decimal point, space, dash */
export function stripNonNumeric(text: string): string {
  return text.replace(/[^\d.\s\-]/g, "");
}

export function isPhoneClean(text: string): boolean {
  return PHONE_RE.test(text);
}

// Script display names for error messages
export const SCRIPT_NAMES: Record<string, Record<string, string>> = {
  ru: { ru: "кириллицу", en: "Cyrillic", hy: "կիրիլլագիր", fr: "cyrillique", de: "Kyrillisch", es: "cirílico", it: "cirillico", ar: "الحروف السيريلية", zh: "西里尔文", fa: "حروف سیریلیک" },
  hy: { ru: "армянский", en: "Armenian script", hy: "հայերեն", fr: "arménien", de: "Armenisch", es: "armenio", it: "armeno", ar: "الأرمنية", zh: "亚美尼亚文", fa: "ارمنی" },
  ar: { ru: "арабский", en: "Arabic", hy: "արաբերեն", fr: "arabe", de: "Arabisch", es: "árabe", it: "arabo", ar: "العربية", zh: "阿拉伯文", fa: "عربی" },
  fa: { ru: "персидский", en: "Persian", hy: "պարսկերեն", fr: "persan", de: "Persisch", es: "persa", it: "persiano", ar: "الفارسية", zh: "波斯文", fa: "فارسی" },
  zh: { ru: "китайский", en: "Chinese", hy: "չինարեն", fr: "chinois", de: "Chinesisch", es: "chino", it: "cinese", ar: "الصينية", zh: "中文", fa: "چینی" },
  en: { ru: "латиницу", en: "Latin", hy: "լատիներեն", fr: "latin", de: "Lateinisch", es: "latino", it: "latino", ar: "اللاتينية", zh: "拉丁文", fa: "لاتین" },
};

/** Human-readable name of the selected language for error messages */
export const LANG_NAMES: Record<string, Record<string, string>> = {
  ru: { ru: "русском", en: "Russian", hy: "ռուսերեն", fr: "russe", de: "Russisch", es: "ruso", it: "russo", ar: "الروسية", zh: "俄语", fa: "روسی" },
  en: { ru: "английском", en: "English", hy: "անգլերեն", fr: "anglais", de: "Englisch", es: "inglés", it: "inglese", ar: "الإنجليزية", zh: "英语", fa: "انگلیسی" },
  hy: { ru: "армянском", en: "Armenian", hy: "հայերեն", fr: "arménien", de: "Armenisch", es: "armenio", it: "armeno", ar: "الأرمنية", zh: "亚美尼亚语", fa: "ارمنی" },
  fr: { ru: "французском", en: "French", hy: "ֆրանսերեն", fr: "français", de: "Französisch", es: "francés", it: "francese", ar: "الفرنسية", zh: "法语", fa: "فرانسوی" },
  de: { ru: "немецком", en: "German", hy: "գերմաներեն", fr: "allemand", de: "Deutsch", es: "alemán", it: "tedesco", ar: "الألمانية", zh: "德语", fa: "آلمانی" },
  es: { ru: "испанском", en: "Spanish", hy: "իսպաներեն", fr: "espagnol", de: "Spanisch", es: "español", it: "spagnolo", ar: "الإسبانية", zh: "西班牙语", fa: "اسپانیایی" },
  it: { ru: "итальянском", en: "Italian", hy: "իտալերեն", fr: "italien", de: "Italienisch", es: "italiano", it: "italiano", ar: "الإيطالية", zh: "意大利语", fa: "ایتالیایی" },
  ar: { ru: "арабском", en: "Arabic", hy: "արաբերեն", fr: "arabe", de: "Arabisch", es: "árabe", it: "arabo", ar: "العربية", zh: "阿拉伯语", fa: "عربی" },
  zh: { ru: "китайском", en: "Chinese", hy: "չինարեն", fr: "chinois", de: "Chinesisch", es: "chino", it: "cinese", ar: "الصينية", zh: "中文", fa: "چینی" },
  fa: { ru: "персидском", en: "Persian", hy: "պարսկերեն", fr: "persan", de: "Persisch", es: "persa", it: "persiano", ar: "الفارسية", zh: "波斯语", fa: "فارسی" },
};

/** Error message for wrong script */
export function scriptErrorMsg(lang: string): string {
  const msgs: Record<string, string> = {
    ru: `Пожалуйста, вводите текст на русском языке`,
    en: `Please enter text in English`,
    hy: `Խնդրում ենք մուտքագրել հայերեն`,
    fr: `Veuillez saisir le texte en français`,
    de: `Bitte geben Sie Text auf Deutsch ein`,
    es: `Por favor ingrese texto en español`,
    it: `Si prega di inserire il testo in italiano`,
    ar: `يرجى إدخال النص باللغة العربية`,
    zh: `请用中文输入`,
    fa: `لطفاً متن را به فارسی وارد کنید`,
  };
  return msgs[lang] || msgs.en;
}

/** Error message for non-numeric input */
export function numericErrorMsg(lang: string): string {
  const msgs: Record<string, string> = {
    ru: `Только цифры`,
    en: `Digits only`,
    hy: `Միայն թվեր`,
    fr: `Chiffres uniquement`,
    de: `Nur Ziffern`,
    es: `Solo dígitos`,
    it: `Solo cifre`,
    ar: `أرقام فقط`,
    zh: `仅限数字`,
    fa: `فقط عدد`,
  };
  return msgs[lang] || msgs.en;
}

/** Error message for invalid phone */
export function phoneErrorMsg(lang: string): string {
  const msgs: Record<string, string> = {
    ru: `Только цифры и + - ( )`,
    en: `Digits and + - ( ) only`,
    hy: `Թվեր և + - ( )`,
    fr: `Chiffres et + - ( ) seulement`,
    de: `Nur Ziffern und + - ( )`,
    es: `Solo dígitos y + - ( )`,
    it: `Solo cifre e + - ( )`,
    ar: `أرقام و + - ( ) فقط`,
    zh: `仅限数字和 + - ( )`,
    fa: `فقط اعداد و + - ( )`,
  };
  return msgs[lang] || msgs.en;
}
