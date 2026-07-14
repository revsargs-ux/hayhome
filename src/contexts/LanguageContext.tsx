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
  lang: "hy",
  setLang: () => {},
  tr: t["hy"],
  isRtl: false,
});

function applyLang(l: LangCode) {
  const isRtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
  document.documentElement.lang = l;
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("hy");

  useEffect(() => {
    // Priority: ?lang= URL param → localStorage → default
    const urlLang = new URLSearchParams(window.location.search).get("lang") as LangCode | null;
    const saved   = localStorage.getItem("hayhome_lang") as LangCode | null;
    const resolved = (urlLang && t[urlLang]) ? urlLang
                   : (saved   && t[saved])   ? saved
                   : null;

    if (resolved) {
      setLangState(resolved);
      localStorage.setItem("hayhome_lang", resolved);
      applyLang(resolved);
    } else {
      // apply default
      applyLang("hy");
    }
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
