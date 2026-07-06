"use client";
import { useEffect, useRef, useState } from "react";

interface AutoTranslateOptions {
  /** Current UI language */
  lang: string;
  /** Current form values (all fields) */
  form: Record<string, string>;
  /** Callback to update a single field */
  setField: (key: string, value: string) => void;
  /** Field keys that contain free-text and should be auto-translated */
  translatableFields: string[];
}

interface AutoTranslateResult {
  isTranslating: boolean;
  translatedAt: string | null;
}

export function useAutoTranslate({
  lang,
  form,
  setField,
  translatableFields,
}: AutoTranslateOptions): AutoTranslateResult {
  const prevLang = useRef<string>(lang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAt, setTranslatedAt] = useState<string | null>(null);

  useEffect(() => {
    const fromLang = prevLang.current;
    if (fromLang === lang) return;
    prevLang.current = lang;

    // Collect non-empty translatable fields
    const toTranslate = translatableFields.filter((k) => {
      const v = form[k];
      return v && v.trim().length > 2;
    });
    if (toTranslate.length === 0) return;

    const texts = toTranslate.map((k) => form[k]);
    setIsTranslating(true);
    setTranslatedAt(null);

    fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, fromLang, toLang: lang }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(({ translations }: { translations: string[] }) => {
        if (!Array.isArray(translations)) return;
        translations.forEach((translated, i) => {
          if (translated && toTranslate[i]) {
            setField(toTranslate[i], translated);
          }
        });
        setTranslatedAt(lang);
      })
      .catch((err) => console.error("[AutoTranslate]", err))
      .finally(() => setIsTranslating(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return { isTranslating, translatedAt };
}
