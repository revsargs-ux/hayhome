"use client";
import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Star, MapPin, Search } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import type { Service } from "@/lib/types";

const ServiceMap = dynamic(() => import("@/components/ServiceMap"), { ssr: false });

const REGIONS = [
  "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

const PRICE_UNIT_LABELS: Record<string, Record<string, string>> = {
  per_hour: { ru: "/час", en: "/hour", hy: "/ժամ", fr: "/heure", de: "/Std.", es: "/hora", it: "/ora", ar: "/ساعة", zh: "/小时", fa: "/ساعت" },
  per_event: { ru: "/мероприятие", en: "/event", hy: "/միջոցառում", fr: "/événement", de: "/Event", es: "/evento", it: "/evento", ar: "/حدث", zh: "/活动", fa: "/رویداد" },
  per_person: { ru: "/гость", en: "/person", hy: "/հյուր", fr: "/personne", de: "/Person", es: "/persona", it: "/persona", ar: "/شخص", zh: "/人", fa: "/نفر" },
};

// Category metadata — emoji + ui key
const CAT_META: { key: string; uiKey: "catPhoto" | "catVideo" | "catMusic" | "catCostume" | "catDecor" | "catDance" | "catGuide" | "catChef" | "catCustom" }[] = [
  { key: "photo", uiKey: "catPhoto" },
  { key: "video", uiKey: "catVideo" },
  { key: "music", uiKey: "catMusic" },
  { key: "costume", uiKey: "catCostume" },
  { key: "decor", uiKey: "catDecor" },
  { key: "dance", uiKey: "catDance" },
  { key: "guide", uiKey: "catGuide" },
  { key: "chef", uiKey: "catChef" },
  { key: "custom", uiKey: "catCustom" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useLang();
  const u = getUI(lang);

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [providerNames, setProviderNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Fetch all available services on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/services?available=true");
        const data = await res.json();
        const services = Array.isArray(data) ? data : [];
        setAllServices(services);

        // Fetch provider names
        const providerIds = [...new Set(services.map((s: Service) => s.provider_id))];
        if (providerIds.length > 0) {
          try {
            const nameRes = await fetch("/api/providers?ids=" + providerIds.join(","));
            if (nameRes.ok) {
              const nameData = await nameRes.json();
              setProviderNames(nameData || {});
            }
          } catch {
            // fallback: no provider names
          }
        }
      } catch {
        setAllServices([]);
      }
      setLoading(false);
    })();
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Extract unique categories from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set(allServices.map((s) => s.category));
    return CAT_META.filter((c) => cats.has(c.key));
  }, [allServices]);

  // Filter services
  const filteredServices = useMemo(() => {
    return allServices.filter((s) => {
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (selectedRegion !== "all" && s.region !== selectedRegion) return false;
      if (debouncedSearch && !s.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      return true;
    });
  }, [allServices, selectedCategory, selectedRegion, debouncedSearch]);

  const getCatLabel = (catKey: string): string => {
    const meta = CAT_META.find((c) => c.key === catKey);
    if (!meta) return catKey;
    return u[meta.uiKey];
  };

  const getUnitLabel = (unit: string): string => {
    return (PRICE_UNIT_LABELS[unit] || PRICE_UNIT_LABELS.per_event)[lang] || PRICE_UNIT_LABELS.per_event.en;
  };

  const getProviderName = (providerId: string): string => {
    return providerNames[providerId] || "";
  };

  // Localization helpers
  const T = {
    pageTitle: { ru: "Услуги в Армении", en: "Services in Armenia", hy: "Ծառայություններ Հայաստանում", fr: "Services en Arménie", de: "Dienste in Armenien", es: "Servicios en Armenia", it: "Servizi in Armenia", ar: "خدمات في أرمينيا", zh: "亚美尼亚的服务", fa: "خدمات در ارمنستان" },
    allRegions: { ru: "Все регионы", en: "All regions", hy: "Բոլոր մարզերը", fr: "Toutes les régions", de: "Alle Regionen", es: "Todas las regiones", it: "Tutte le regioni", ar: "جميع المناطق", zh: "所有地区", fa: "همه مناطق" },
    order: { ru: "Заказать", en: "Order", hy: "Պատվիրել", fr: "Commander", de: "Bestellen", es: "Pedir", it: "Ordina", ar: "طلب", zh: "订购", fa: "سفارش" },
    notFound: { ru: "Услуги не найдены", en: "No services found", hy: "Ծառայություններ չեն գտնվել", fr: "Aucun service trouvé", de: "Keine Dienste gefunden", es: "No se encontraron servicios", it: "Nessun servizio trovato", ar: "لم يتم العثور على خدمات", zh: "未找到服务", fa: "خدماتی یافت نشد" },
    subtitle: { ru: "Фотографы, повара, гиды и другие специалисты для вашего визита", en: "Photographers, chefs, guides and more for your visit", hy: "Լուսանկարիչներ, խոհարարներ, ուղեկցորդներ և այլ մասնագետներ ձեր այցի համար", fr: "Photographes, chefs, guides et autres pour votre visite", de: "Fotografen, Köche, Führer und mehr für Ihren Besuch", es: "Fotógrafos, chefs, guías y más para su visita", it: "Fotografi, cuochi, guide e altro per la tua visita", ar: "مصورون وطهاة ومرشدون وغيرهم لزيارتك", zh: "摄影师、厨师、导游等专家为您的访问服务", fa: "عکاسان، آشپزها، راهنمایان و متخصصان دیگر برای بازدید شما" },
    rating: { ru: "нет отзывов", en: "no reviews", hy: "կարծիքներ չկան", fr: "aucun avis", de: "keine Bewertungen", es: "sin reseñas", it: "nessuna recensione", ar: "لا تقييمات", zh: "没有评价", fa: "بدون نظر" },
  };
  const t = (k: keyof typeof T): string => (T[k] as Record<string, string>)[lang] || (T[k] as Record<string, string>).en;

  // Build markers for map
  const mapMarkers = useMemo(() =>
    filteredServices.map((s) => ({
      id: s.id,
      title: s.title,
      region: s.region,
      price: s.price,
      priceUnit: getUnitLabel(s.price_unit),
      categoryLabel: getCatLabel(s.category),
      coverPhoto: s.photos && s.photos.length > 0 ? s.photos[0] : null,
    })),
  [filteredServices, lang]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ {t("pageTitle")}</h1>
          <p className="text-gray-500 text-sm">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={u.searchServices}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-orange-400"
            />
          </div>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="all">{t("allRegions")}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Category pills — dynamic */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${!selectedCategory ? "text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            style={!selectedCategory ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
          >
            {u.allText}
          </button>
          {availableCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === c.key ? "text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              style={selectedCategory === c.key ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
            >
              {u[c.uiKey]}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">
            {loading ? "" : `${filteredServices.length}`}
          </span>
          {filteredServices.length > 0 && (
            <div className="flex bg-white rounded-full border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "list" ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
                style={viewMode === "list" ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
              >
                {u.listViewBtn}
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "map" ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
                style={viewMode === "map" ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
              >
                {u.mapViewBtn}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">{t("notFound")}</p>
          </div>
        ) : viewMode === "map" ? (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">{u.servicesOnMap}</h2>
            <ServiceMap services={mapMarkers} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                catLabel={getCatLabel(svc.category)}
                unitLabel={getUnitLabel(svc.price_unit)}
                providerName={getProviderName(svc.provider_id)}
                orderText={t("order")}
                ratingText={t("rating")}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, catLabel, unitLabel, providerName, orderText, ratingText, lang }: {
  service: Service;
  catLabel: string;
  unitLabel: string;
  providerName: string;
  orderText: string;
  ratingText: string;
  lang: string;
}) {
  const coverPhoto = service.photos && service.photos.length > 0 ? service.photos[0] : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Photo */}
      <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-100 relative">
        {coverPhoto ? (
          <img src={coverPhoto} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {catLabel.split(" ")[0]}
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-gray-700">
          {catLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{service.title}</h3>
        {providerName && (
          <p className="text-xs text-gray-400 mb-1 line-clamp-1">{providerName}</p>
        )}
        <p className="text-gray-500 text-xs mb-2 line-clamp-2 flex-1">
          {service.description || ""}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MapPin size={12} />
          <span>{service.region}</span>
          {service.rating > 0 && (
            <>
              <span className="mx-1">·</span>
              <Star size={12} fill="#D4A04A" color="#D4A04A" />
              <span className="font-semibold text-gray-700">{service.rating}</span>
              <span className="text-gray-400">({service.review_count})</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-gray-900">${service.price}</span>
            <span className="text-xs text-gray-400 ml-1">{unitLabel}</span>
          </div>
          <Link
            href={`/services/book/${service.id}`}
            className="px-4 py-2 rounded-full text-white text-xs font-semibold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
          >
            {orderText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" /></div>}>
      <ServicesContent />
    </Suspense>
  );
}
