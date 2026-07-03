"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

export default function MobileBottomBar() {
  const { lang } = useLang();
  const isRu = lang === "ru";

  return (
    <>
      {/* Bottom fixed bar — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-stretch">
          <Link
            href="/requests/new"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 active:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">💭</span>
            <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">
              {isRu ? "Искать впечатления" : "Experiences"}
            </span>
          </Link>

          <Link
            href="/hosts"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 active:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">🏠</span>
            <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">
              {isRu ? "Семьи" : "Families"}
            </span>
          </Link>

          <Link
            href="/services"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 active:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">✨</span>
            <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">
              {isRu ? "Услуги" : "Services"}
            </span>
          </Link>

          <Link
            href="/requests"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 active:bg-gray-50 transition"
          >
            <span className="text-lg leading-none">🔍</span>
            <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">
              {isRu ? "Найти гостей" : "Find guests"}
            </span>
          </Link>
        </div>
      </div>

      {/* Spacer to prevent content being hidden behind bar */}
      <div className="md:hidden h-14" />
    </>
  );
}
