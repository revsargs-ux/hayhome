"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Search, Filter } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import type { Service } from "@/lib/types";

const CATEGORIES = [
  { key: "photo", icon: "📸", label: { ru: "Фото", en: "Photo", hy: "Լուսանկար", fr: "Photo", de: "Foto", es: "Foto", it: "Foto", ar: "صور", zh: "摄影", fa: "عکس" } },
  { key: "video", icon: "🎥", label: { ru: "Видео", en: "Video", hy: "Տեսանկար", fr: "Vidéo", de: "Video", es: "Vídeo", it: "Video", ar: "فيديو", zh: "视频", fa: "ویدیو" } },
  { key: "music", icon: "🎵", label: { ru: "Музыка", en: "Music", hy: "Երաժշտություն", fr: "Musique", de: "Musik", es: "Música", it: "Musica", ar: "موسيقى", zh: "音乐", fa: "موسیقی" } },
  { key: "costume", icon: "👗", label: { ru: "Костюмы", en: "Costumes", hy: "Հագուստ", fr: "Costumes", de: "Kostüme", es: "Disfraces", it: "Costumi", ar: "أزياء", zh: "服装", fa: "لباس" } },
  { key: "decor", icon: "🎨", label: { ru: "Оформление", en: "Decor", hy: "Դեկոր", fr: "Décoration", de: "Dekoration", es: "Decoración", it: "Decorazione", ar: "ديكور", zh: "装饰", fa: "تزئین" } },
  { key: "dance", icon: "💃", label: { ru: "Танцы", en: "Dance", hy: "Պար", fr: "Danse", de: "Tanz", es: "Baile", it: "Danza", ar: "رقص", zh: "舞蹈", fa: "رقص" } },
  { key: "guide", icon: "🗺️", label: { ru: "Гид", en: "Guide", hy: "Ուղեկցորդ", fr: "Guide", de: "Führer", es: "Guía", it: "Guida", ar: "مرشد", zh: "导游", fa: "راهنما" } },
  { key: "chef", icon: "👨‍🍳", label: { ru: "Повар", en: "Chef", hy: "Խոհարար", fr: "Chef", de: "Koch", es: "Chef", it: "Cuoco", ar: "طاهي", zh: "厨师", fa: "آشپز" } },
  { key: "custom", icon: "✨", label: { ru: "Другое", en: "Custom", hy: "Այլ", fr: "Autre", de: "Sonstiges", es: "Otro", it: "Altro", ar: "أخرى", zh: "其他", fa: "سایر" } },
];

const REGIONS = [
  "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

const PRICE_UNIT_LABELS: Record<string, Record<string, string>> = {
  per_hour: { ru: "/час", en: "/hour", hy: "/ժամ", fr: "/heure", de: "/Std.", es: "/hora", it: "/ora", ar: "/ساعة", zh: "/小时", fa: "/ساعت" },
  per_event: { ru: "/мероприятие", en: "/event", hy: "/միջոցառում", fr: "/événement", de: "/Event", es: "/evento", it: "/evento", ar: "/حدث", zh: "/活动", fa: "/رویداد" },
  per_person: { ru: "/гость", en: "/person", hy: "/հյուր", fr: "/personne", de: "/Person", es: "/persona", it: "/persona", ar: "/شخص", zh: "/人", fa: "/نفر" },
};

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { lang } = useLang();
  const u = getUI(lang);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const category = searchParams.get("category") || "";
  const region = searchParams.get("region") || "all";

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (region && region !== "all") params.set("region", region);
    if (search) params.set("search", search);

    const res = await fetch(`/api/services?${params}`);
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [category, region, search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat) params.set("category", cat);
    else params.delete("category");
    router.push(`/services?${params}`);
  };

  const setRegion = (r: string) => {
    const params = new URLSearchParams(searchParams);
    if (r && r !== "all") params.set("region", r);
    else params.delete("region");
    router.push(`/services?${params}`);
  };

  const getCatLabel = (catKey: string): string => {
    const c = CATEGORIES.find((c) => c.key === catKey);
    return c ? `${c.icon} ${c.label[lang] || c.label.en}` : catKey;
  };

  const getUnitLabel = (unit: string): string => {
    return (PRICE_UNIT_LABELS[unit] || PRICE_UNIT_LABELS.per_event)[lang] || PRICE_UNIT_LABELS.per_event.en;
  };

  // Localization helpers
  const T = {
    pageTitle: { ru: "Услуги в Армении", en: "Services in Armenia", hy: "Ծառայություններ Հայաստանում", fr: "Services en Arménie", de: "Dienste in Armenien", es: "Servicios en Armenia", it: "Servizi in Armenia", ar: "خدمات في أرمينيا", zh: "亚美尼亚的服务", fa: "خدمات در ارمنستان" },
    searchPh: { ru: "Поиск услуги...", en: "Search services...", hy: "Որոնել...", fr: "Rechercher...", de: "Suchen...", es: "Buscar...", it: "Cerca...", ar: "بحث...", zh: "搜索...", fa: "جستجو..." },
    allRegions: { ru: "Все регионы", en: "All regions", hy: "Բոլոր մարզերը", fr: "Toutes les régions", de: "Alle Regionen", es: "Todas las regiones", it: "Tutte le regioni", ar: "جميع المناطق", zh: "所有地区", fa: "همه مناطق" },
    order: { ru: "Заказать", en: "Order", hy: "Պատվիրել", fr: "Commander", de: "Bestellen", es: "Pedir", it: "Ordina", ar: "طلب", zh: "订购", fa: "سفارش" },
    notFound: { ru: "Услуги не найдены", en: "No services found", hy: "Ծառայություններ չեն գտնվել", fr: "Aucun service trouvé", de: "Keine Dienste gefunden", es: "No se encontraron servicios", it: "Nessun servizio trovato", ar: "لم يتم العثور على خدمات", zh: "未找到服务", fa: "خدماتی یافت نشد" },
    subtitle: { ru: "Фотографы, повара, гиды и другие специалисты для вашего визита", en: "Photographers, chefs, guides and more for your visit", hy: "Լուսանկարիչներ, խոհարարներ, ուղեկցորդներ և այլ մասնագետներ ձեր այցի համար", fr: "Photographes, chefs, guides et autres pour votre visite", de: "Fotografen, Köche, Führer und mehr für Ihren Besuch", es: "Fotógrafos, chefs, guías y más para su visita", it: "Fotografi, cuochi, guide e altro per la tua visita", ar: "مصورون وطهاة ومرشدون وغيرهم لزيارتك", zh: "摄影师、厨师、导游等专家为您的访问服务", fa: "عکاسان، آشپزها، راهنمایان و متخصصان دیگر برای بازدید شما" },
    rating: { ru: "нет отзывов", en: "no reviews", hy: "կարծիքներ չկան", fr: "aucun avis", de: "keine Bewertungen", es: "sin reseñas", it: "nessuna recensione", ar: "لا تقييمات", zh: "没有评价", fa: "بدون نظر" },
  };
  const t = (k: keyof typeof T): string => (T[k] as Record<string, string>)[lang] || (T[k] as Record<string, string>).en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✨ {t("pageTitle")}</h1>
          <p className="text-gray-500 text-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${!category ? "text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            style={!category ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
          >
            {u.allText}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === c.key ? "text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              style={category === c.key ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
            >
              {c.icon} {c.label[lang] || c.label.en}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPh")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-orange-400"
            />
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 outline-none focus:border-orange-400"
          >
            <option value="all">{t("allRegions")}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">{t("notFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                catLabel={getCatLabel(svc.category)}
                unitLabel={getUnitLabel(svc.price_unit)}
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

function ServiceCard({ service, catLabel, unitLabel, orderText, ratingText, lang }: {
  service: Service;
  catLabel: string;
  unitLabel: string;
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
            href={`/provider/register?service=${service.id}`}
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
