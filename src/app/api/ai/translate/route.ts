import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

const LANG_NAMES: Record<string, string> = {
  ru: "Russian", en: "English", hy: "Armenian", fr: "French",
  de: "German", es: "Spanish", it: "Italian", ar: "Arabic",
  zh: "Chinese (Simplified)", fa: "Persian (Farsi)",
};

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.AI_API_KEY || "placeholder",
      baseURL: process.env.AI_BASE_URL,
    });
  }
  return _client;
}

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  let body: { texts?: unknown; fromLang?: unknown; toLang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { texts, fromLang, toLang } = body;

  if (!Array.isArray(texts) || texts.length === 0 || texts.length > 20) {
    return NextResponse.json({ error: "texts must be a non-empty array of up to 20 items" }, { status: 400 });
  }
  if (typeof toLang !== "string" || !LANG_NAMES[toLang]) {
    return NextResponse.json({ error: "Invalid toLang" }, { status: 400 });
  }

  const strTexts = texts.map((t) => (typeof t === "string" ? t : "")).filter(Boolean);
  if (strTexts.length === 0) {
    return NextResponse.json({ translations: [] });
  }

  const from = typeof fromLang === "string" && LANG_NAMES[fromLang] ? LANG_NAMES[fromLang] : "auto-detect";
  const to = LANG_NAMES[toLang];

  // Build numbered list for translation
  const numbered = strTexts.map((t, i) => `${i + 1}. ${t}`).join("\n");
  const prompt = `Translate the following text items from ${from} to ${to}.\nRules:\n- Keep proper nouns (personal names, place names, brand names) unchanged\n- Keep numbers, phone numbers, email addresses unchanged\n- Return ONLY a numbered list in the same order, no explanations\n\n${numbered}`;

  try {
    const model = process.env.AI_MODEL || "glm-5.2";
    const response = await getClient().chat.completions.create({
      model,
      max_tokens: 1500,
      temperature: 0.2,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = response.choices?.[0]?.message as any;
    const content = (msg?.content?.trim() || msg?.reasoning_content?.trim() || "");

    if (!content) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 503 });
    }

    // Parse numbered list back — match lines that start with a number
    const lines = content.split("\n");
    const translations: string[] = strTexts.map((original, i) => {
      const match = lines.find((l: string) => l.match(new RegExp(`^${i + 1}[.)\\s]`)));
      if (match) return match.replace(/^\d+[.)]\s*/, "").trim();
      return original;
    });

    return NextResponse.json({ translations });
  } catch (err) {
    console.error("[AI] translate error:", err);
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 503 });
  }
}
