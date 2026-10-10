/**
 * UGC translation and name transliteration module.
 * Providers: 'none' | 'anthropic' | 'deepl' | 'google'
 *
 * Never called during page render, only at write time or in backfill scripts.
 */

export type TranslateProvider = "none" | "anthropic" | "deepl" | "google"

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/

export function detectLanguage(text: string): "en" | "ar" {
  if (!text) return "en"
  return ARABIC_CHAR_REGEX.test(text) ? "ar" : "en"
}

// Arabic to Latin name transliteration lookup for common Egyptian/Arab names and titles
const NAME_TRANSLITERATIONS: Record<string, string> = {
  "م.": "Eng.",
  "مهندس": "Eng.",
  "المهندس": "Eng.",
  "د.": "Dr.",
  "دكتور": "Dr.",
  "الدكتور": "Dr.",
  "سعادة": "H.E.",
  "السفير": "Ambassador",
  "أسرة": "Family of",
  "محمود": "Mahmoud",
  "عبد العزيز": "Abdel Aziz",
  "عبدالعزيز": "Abdel Aziz",
  "سارة": "Sarah",
  "إبراهيم": "Ibrahim",
  "كريم": "Karim",
  "فهمي": "Fahmy",
  "أحمد": "Ahmed",
  "الشريف": "Al-Sharif",
  "طارق": "Tarek",
  "منصور": "Mansour",
  "عمر": "Omar",
  "خالد": "Khaled",
  "منى": "Mona",
  "زكي": "Zaki",
  "هاني": "Hany",
  "رضوان": "Radwan",
  "ياسين": "Yassin",
  "المنشاوي": "Al-Minshawi",
  "هشام": "Hesham",
  "مصطفى": "Mostafa",
  "جاد": "Gad",
  "أشرف": "Ashraf",
  "كمال": "Kamal",
  "حسام": "Hossam",
  "حسن": "Hassan",
  "ناصر": "Nasser",
  "العتيبي": "Al-Otaibi",
  "وليد": "Walid",
  "صبري": "Sabry",
  "إسلام": "Islam",
  "نجاتي": "Nagaty",
  "زياد": "Ziad",
  "حمدي": "Hamdy",
  "علي": "Ali",
  "محمد": "Mohamed",
  "النجار": "El-Naggar",
}

export function transliterateArabicNameToEnglish(arabicName: string): string {
  if (!arabicName) return ""
  let clean = arabicName.trim()

  // Replace compound names first
  for (const [ar, en] of Object.entries(NAME_TRANSLITERATIONS)) {
    if (clean.includes(ar)) {
      clean = clean.split(ar).join(en)
    }
  }

  // Basic transliteration for remaining Arabic characters if not in map
  const charMap: Record<string, string> = {
    ا: "a",
    أ: "A",
    إ: "I",
    آ: "Aa",
    ب: "b",
    ت: "t",
    ث: "th",
    ج: "g",
    ح: "h",
    خ: "kh",
    د: "d",
    ذ: "dh",
    ر: "r",
    ز: "z",
    س: "s",
    ش: "sh",
    ص: "s",
    ض: "d",
    ط: "t",
    ظ: "z",
    ع: "a",
    غ: "gh",
    ف: "f",
    ق: "q",
    ك: "k",
    ل: "l",
    م: "m",
    ن: "n",
    ه: "h",
    و: "w",
    ي: "y",
    ى: "a",
    ئ: "'",
    ء: "'",
    ؤ: "w",
    ة: "a",
  }

  return clean
    .split("")
    .map((c) => charMap[c] ?? c)
    .join("")
    .replace(/\s+/g, " ")
    .trim()
}

export function transliterateEnglishNameToArabic(englishName: string): string {
  if (!englishName) return ""
  const reverseMap: Record<string, string> = {}
  for (const [ar, en] of Object.entries(NAME_TRANSLITERATIONS)) {
    reverseMap[en.toLowerCase()] = ar
  }

  let words = englishName.trim().split(/\s+/)
  return words
    .map((w) => reverseMap[w.toLowerCase()] || w)
    .join(" ")
}

export async function translateText(
  text: string,
  sourceLang: "en" | "ar",
  targetLang: "en" | "ar"
): Promise<string> {
  if (!text || sourceLang === targetLang) return text

  const provider = (process.env.TRANSLATE_PROVIDER || "none") as TranslateProvider

  if (provider === "none") {
    // In demo / test mode without external API key, return null or fallback
    return text
  }

  try {
    if (provider === "google" && process.env.GOOGLE_TRANSLATE_API_KEY) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
          }),
        }
      )
      const data = await res.json()
      return data?.data?.translations?.[0]?.translatedText || text
    }

    if (provider === "deepl" && process.env.DEEPL_API_KEY) {
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang.toUpperCase(),
        }),
      })
      const data = await res.json()
      return data?.translations?.[0]?.text || text
    }

    return text
  } catch (err) {
    console.error("[translateText] Translation provider error:", err)
    return text
  }
}
