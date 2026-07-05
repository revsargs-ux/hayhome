"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

export default function MobileBottomBar() {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const pathname = usePathname();

  const tabs = [
    {
      href: "/",
      icon: "🏠",
      labelRu: "Главная",
      labelEn: "Home",
      match: (p: string) => p === "/",
    },
    {
      href: "/hosts",
      icon: "👨‍👩‍👧",
      labelRu: "Семьи",
      labelEn: "Families",
      match: (p: string) => p.startsWith("/hosts"),
    },
    {
      href: "/services",
      icon: "✨",
      labelRu: "Услуги",
      labelEn: "Services",
      match: (p: string) => p.startsWith("/services"),
    },
    {
      href: "/requests",
      icon: "📋",
      labelRu: "Заявки",
      labelEn: "Requests",
      match: (p: string) => p.startsWith("/requests"),
    },
    {
      href: "/dashboard",
      icon: "👤",
      labelRu: "Профиль",
      labelEn: "Profile",
      match: (p: string) => p.startsWith("/dashboard") || p.startsWith("/profile"),
    },
  ];

  return (
    <>
      {/* Bottom fixed bar — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const active = tab.match(pathname);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 active:bg-gray-50 transition ${
                  active ? "text-red-600" : "text-gray-600"
                }`}
              >
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium leading-tight text-center">
                  {isRu ? tab.labelRu : tab.labelEn}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer to prevent content being hidden behind bar */}
      <div className="md:hidden h-14" />
    </>
  );
}
