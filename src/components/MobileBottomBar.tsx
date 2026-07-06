"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

const labels: Record<string, { home: string; families: string; services: string; requests: string; profile: string }> = {
  ru: { home: "Главная", families: "Семьи", services: "Услуги", requests: "Заявки", profile: "Профиль" },
  en: { home: "Home", families: "Families", services: "Services", requests: "Requests", profile: "Profile" },
  hy: { home: "Գլխավոր", families: "Ընտանիքներ", services: "Ծառայություններ", requests: "Հայցեր", profile: "Պրոֆիլ" },
  fr: { home: "Accueil", families: "Familles", services: "Services", requests: "Demandes", profile: "Profil" },
  de: { home: "Startseite", families: "Familien", services: "Dienste", requests: "Anfragen", profile: "Profil" },
  es: { home: "Inicio", families: "Familias", services: "Servicios", requests: "Solicitudes", profile: "Perfil" },
  it: { home: "Home", families: "Famiglie", services: "Servizi", requests: "Richieste", profile: "Profilo" },
  ar: { home: "الرئيسية", families: "العائلات", services: "الخدمات", requests: "الطلبات", profile: "الملف" },
  zh: { home: "首页", families: "家庭", services: "服务", requests: "请求", profile: "个人" },
  fa: { home: "خانه", families: "خانواده‌ها", services: "خدمات", requests: "درخواست‌ها", profile: "پروفایل" },
};

export default function MobileBottomBar() {
  const { lang } = useLang();
  const pathname = usePathname();
  const t = labels[lang] || labels.ru;

  const tabs = [
    { href: "/", icon: "🏠", label: t.home, match: (p: string) => p === "/" },
    { href: "/hosts", icon: "👨👩👧", label: t.families, match: (p: string) => p.startsWith("/hosts") },
    { href: "/services", icon: "✨", label: t.services, match: (p: string) => p.startsWith("/services") },
    { href: "/requests", icon: "📋", label: t.requests, match: (p: string) => p.startsWith("/requests") },
    { href: "/dashboard", icon: "👤", label: t.profile, match: (p: string) => p.startsWith("/dashboard") || p.startsWith("/profile") },
  ];

  return (
    <>
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
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="md:hidden h-14" />
    </>
  );
}
