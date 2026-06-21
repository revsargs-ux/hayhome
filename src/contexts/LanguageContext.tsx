"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import t, { LangCode, Translations, LANGUAGES } from "@/lib/translations";

interface LanguageContextType {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  tr: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  setLang: () => {},
  tr: t["ru"],
  isRtl: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("hayhome_lang") as LangCode | null;
    if (saved && t[saved]) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("hayhome_lang", l);
    // RTL support
    const isRtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  };

  const isRtl = LANGUAGES.find((x) => x.code === lang)?.rtl ?? false;

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang], isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
