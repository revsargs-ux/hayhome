"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all duration-200 text-sm font-medium text-gray-600"
        title="Select language"
      >
        <Globe size={14} style={{ color: "#F2A900" }} />
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1">
          {LANGUAGES.map((l) => {
            const isActive = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${isActive ? "font-semibold" : "font-medium text-gray-700 hover:bg-gray-50"}`}
                dir={l.rtl ? "rtl" : "ltr"}
                style={isActive ? { background: "linear-gradient(135deg, rgba(212,0,26,0.05), rgba(242,169,0,0.08))", color: "#D4001A" } : undefined}
              >
                <span className="text-lg flex-shrink-0">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {isActive && <Check size={14} style={{ color: "#D4001A" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
