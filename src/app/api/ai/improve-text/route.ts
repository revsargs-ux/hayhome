import OpenAI from "openai";
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

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

  const user = await getAuthUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { text, type } = await req.json();

  if (!text || text.trim().length < 5) {
    return new Response("Текст слишком короткий", { status: 400 });
  }
  if (text.length > 5000) {
    return new Response("Текст слишком длинный (макс. 5000 символов)", { status: 400 });
  }

  const model = process.env.AI_MODEL || "glm-5.2";

  const userPrompt =
    type === "short"
      ? `Ты помогаешь армянским семьям описать гостеприимство для платформы HayHome.\nУлучши краткое описание (1-2 предложения), сделай тёплым и привлекательным. Отвечай только на русском.\nВерни ТОЛЬКО улучшенный текст:\n\n${text}`
      : `Ты помогаешь армянским семьям описать гостеприимство для платформы HayHome.\nУлучши описание: сохрани факты, но сделай его теплее, живее, как личную историю. Отвечай только на русском.\nВерни ТОЛЬКО улучшенный текст:\n\n${text}`;

  try {
    const response = await getClient().chat.completions.create({
      model,
      max_tokens: 800,
      temperature: 0.85,
      stream: false,
      messages: [{ role: "user", content: userPrompt }],
    });

    const choice = response.choices?.[0];

    // GLM thinking models: сначала reasoning_content, потом content
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = choice?.message as any;
    const improved = (msg?.content?.trim() || msg?.reasoning_content?.trim() || "");

    if (!improved) {
      return new Response("ИИ не вернул текст. Попробуйте ещё раз.", { status: 500 });
    }

    // Если в reasoning_content есть финальный ответ — извлекаем последний абзац
    let finalText = improved;
    if (!msg?.content && msg?.reasoning_content) {
      // Берём последний значимый абзац из размышлений
      const lines = improved.split("\n").filter((l: string) => l.trim().length > 10);
      finalText = lines[lines.length - 1] || improved;
    }

    // Анимация набора текста
    const readable = new ReadableStream({
      async start(controller) {
        for (const char of finalText.split("")) {
          controller.enqueue(new TextEncoder().encode(char));
          await new Promise((r) => setTimeout(r, 8));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (err: unknown) {
    console.error("[AI] improve-text error:", err);
    return new Response("Сервис временно недоступен. Попробуйте позже.", { status: 503 });
  }
}
