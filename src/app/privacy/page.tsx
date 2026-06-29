"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { privacyTexts } from "@/lib/privacyTexts";

export default function PrivacyPage() {
  const { lang, tr } = useLang();
  const l = tr.legal;
  const t = privacyTexts[lang] || privacyTexts.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> {l.back}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {t.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                {section.body.map((p, j) => (
                  <p key={j} className="mt-2">{p}</p>
                ))}
                {section.list && (
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    {section.list.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-400">
            <p>{t.updated}</p>
            <p className="mt-1">{t.contact}: <a href="mailto:info@hayhome.am" className="text-red-600 hover:underline">info@hayhome.am</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
