"use client";
import { useState, useEffect, Suspense } from "react";
import HostCard from "@/components/HostCard";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import { Host } from "@/lib/types";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { useSearchParams } from "next/navigation";
import { regionName } from "@/lib/i18n-utils";
import Recommendations from "@/components/Recommendations";

const REGIONS_LIST = ["Ереван", "Тавуш", "Ширак", "Арарат", "Гегаркуник", "Лори", "Вайоц Дзор", "Арагацотн", "Котайк", "Сюник"];

function HostsContent() {
  const { tr, lang } = useLang();
  const priceRange = { ru: "Диапазон цен", en: "Price range", hy: "Գների միջակայք", fr: "Fourchette de prix", de: "Preisspanne", es: "Rango de precios", it: "Fascia di prezzo", ar: "نطاق السعر", zh: "价格范围", fa: "محدوده قیمت" }[lang] || "Price range";
  const fromLabel = { ru: "От", en: "From", hy: "Ից", fr: "De", de: "Von", es: "Desde", it: "Da", ar: "من", zh: "从", fa: "از" }[lang] || "From";
  const toLabel = { ru: "До", en: "To", hy: "Մինչև", fr: "À", de: "Bis", es: "Hasta", it: "A", ar: "إلى", zh: "到", fa: "تا" }[lang] || "To";
  const h = tr.hosts;
  const u = getUI(lang);
  const searchParams = useSearchParams();

  const [hosts, setHosts]           = useState<Host[]>([]);
  const [filtered, setFiltered]     = useState<Host[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState(searchParams.get("q") || "");
  const [region, setRegion]         = useState("");
  const [minStars, setMinStars]     = useState(0);
  const [minPrice, setMinPrice]     = useState(0);
  const [maxPrice, setMaxPrice]     = useState(200);
  const [experience, setExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc" | "value">("rating");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [valueRanks, setValueRanks] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/ratings")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const ranks: Record<string, number> = {};
          data.forEach((h) => { ranks[h.id] = h.rank; });
          setValueRanks(ranks);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/hosts")
      .then((r) => r.json())
      .then((data: Host[]) => { setHosts(data); setFiltered(data); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = hosts.filter((h) => h.status === "active");
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((h) =>
        h.familyName.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q)
      );
    }
    if (region) result = result.filter((h) => h.region === region || h.city === region);
    if (minStars > 0) result = result.filter((h) => h.stars >= minStars);
    result = result.filter((h) => (h.pricePerNight ?? 0) >= minPrice && (h.pricePerNight ?? 0) <= maxPrice);
    if (experience) result = result.filter((h) => h.experiences?.some(e => e.toLowerCase().includes(experience.toLowerCase())));
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_asc") result.sort((a, b) => (a.pricePerNight ?? 0) - (b.pricePerNight ?? 0));
    else if (sortBy === "price_desc") result.sort((a, b) => (b.pricePerNight ?? 0) - (a.pricePerNight ?? 0));
    else if (sortBy === "value") result.sort((a, b) => (valueRanks[a.id] || 999) - (valueRanks[b.id] || 999));
    setFiltered(result);
  }, [hosts, search, region, minStars, minPrice, maxPrice, sortBy, experience, valueRanks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search bar */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
              <Search size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
              <input
                type="text"
                placeholder={h.searchPlaceholder}
                aria-label={h.searchPlaceholder}
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-label={h.filters}
              aria-expanded={showFilters}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-colors ${showFilters ? "border-red-500 text-red-600 bg-red-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
            >
              <SlidersHorizontal size={16} aria-hidden="true" /> {h.filters}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort by"
              className="hidden sm:block px-3 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-white outline-none cursor-pointer"
            >
              <option value="rating">{h.byRating}</option>
              <option value="value">🏆 {u.bestValue}</option>
              <option value="price_asc">{h.byPriceAsc}</option>
              <option value="price_desc">{h.byPriceDesc}</option>
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">{h.region}</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                  <option value="">{h.allRegions}</option>
                  {REGIONS_LIST.map((r) => <option key={r} value={r}>{regionName(r, lang)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {h.minStars}: {minStars === 0 ? h.anyStars : "★".repeat(minStars)}
                </label>
                <input type="range" min={0} max={5} step={1} value={minStars}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  aria-label={h.minStars}
                  className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{h.anyStars}</span><span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {priceRange}: ${minPrice} — ${maxPrice}/night
                </label>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={200} step={5} value={minPrice}
                    onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 5))}
                    aria-label="Min price"
                    className="flex-1 accent-red-600" />
                  <input type="range" min={0} max={200} step={5} value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 5))}
                    aria-label="Max price"
                    className="flex-1 accent-red-600" />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span><span>$200</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {u.experience}
                </label>
                <input type="text" value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder={u.searchText}
                  aria-label={u.experience}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? tr.common.loading : `${filtered.length} ${h.pageTitle}`}
          </h2>
          <div className="flex items-center gap-3">
            {filtered.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={14} aria-hidden="true" /> <span>🇦🇲</span>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="flex bg-white rounded-full border border-gray-200 p-1 shadow-sm" role="group" aria-label="View mode">
                <button
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "list" ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
                  style={viewMode === "list" ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : {}}
                >
                  {h.listView}
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  aria-pressed={viewMode === "map"}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "map" ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
                  style={viewMode === "map" ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : {}}
                >
                  {h.mapView}
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading hosts">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "map" && filtered.length > 0 ? (
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">{priceRange}</span>
                <span className="text-sm font-bold text-red-600">${minPrice} — ${maxPrice}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{fromLabel}</label>
                  <input type="range" min={0} max={200} step={5} value={minPrice}
                    onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 5))}
                    aria-label={fromLabel}
                    className="w-full accent-red-600" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{toLabel}</label>
                  <input type="range" min={0} max={200} step={5} value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 5))}
                    aria-label={toLabel}
                    className="w-full accent-red-600" />
                </div>
              </div>
            </div>
            <Map hosts={filtered} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{h.notFound}</h3>
            <p className="text-gray-500 mb-6">{h.notFoundSub}</p>
            <button
              onClick={() => { setSearch(""); setRegion(""); setMinStars(0); setMinPrice(0); setMaxPrice(200); }}
              className="px-6 py-2.5 rounded-full text-white font-medium"
              style={{ background: "#D4001A" }}
            >
              {h.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((host) => <HostCard key={host.id} host={host} valueRank={valueRanks[host.id]} />)}
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Recommendations
          type="services"
          title="✨ Услуги в Армении"
          titleEn="✨ Services in Armenia"
          limit={4}
        />
      </div>
    </div>
  );
}

export default function HostsClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" aria-label="Loading" />
      </div>
    }>
      <HostsContent />
    </Suspense>
  );
}
