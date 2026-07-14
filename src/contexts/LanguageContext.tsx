"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import t, { LangCode, Translations, LANGUAGES } from "@/lib/translations";

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  tr: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "hy",
  setLang: () => {},
  tr: t["hy"],
  isRtl: false,
});

function applyLang(l: LangCode) {
  const isRtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", l);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("hy");
  const searchParams = useSearchParams();

  // Init: URL param → localStorage → default
  useEffect(() => {
    const urlLang = searchParams.get("lang") as LangCode | null;
    const saved = localStorage.getItem("hayhome_lang") as LangCode | null;
    const init = urlLang && t[urlLang] ? urlLang : saved && t[saved] ? saved : "hy";
    setLangState(init);
    applyLang(init);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("hayhome_lang", l);
    applyLang(l);
  };

  const isRtl = LANGUAGES.find((x) => x.code === lang)?.rtl ?? false;

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang], isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
