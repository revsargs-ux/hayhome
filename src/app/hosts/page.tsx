"use client";
import { useState, useEffect, Suspense } from "react";
import HostCard from "@/components/HostCard";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
import { Host } from "@/lib/types";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";

const REGIONS_LIST = ["Ереван", "Тавуш", "Ширак", "Арарат", "Гегаркуник", "Лори", "Вайоц Дзор", "Арагацотн", "Котайк", "Сюник"];

function HostsContent() {
  const { tr, lang } = useLang();
  const h = tr.hosts;
  const searchParams = useSearchParams();

  const [hosts, setHosts] = useState<Host[]>([]);
  const [filtered, setFiltered] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState("");
  const [minStars, setMinStars] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [experience, setExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
    result = result.filter((h) => h.pricePerNight <= maxPrice);
    if (experience) result = result.filter((h) => h.experiences?.some(e => e.toLowerCase().includes(experience.toLowerCase())));
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_asc") result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    setFiltered(result);
  }, [hosts, search, region, minStars, maxPrice, sortBy, experience]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search bar */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={h.searchPlaceholder}
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-colors ${showFilters ? "border-red-500 text-red-600 bg-red-50" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
            >
              <SlidersHorizontal size={16} /> {h.filters}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="hidden sm:block px-3 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-700 bg-white outline-none cursor-pointer"
            >
              <option value="rating">{h.byRating}</option>
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
                  {REGIONS_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {h.minStars}: {minStars === 0 ? h.anyStars : "★".repeat(minStars)}
                </label>
                <input type="range" min={0} max={5} step={1} value={minStars}
                  onChange={(e) => setMinStars(Number(e.target.value))}
                  className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{h.anyStars}</span><span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {h.priceTo}: ${maxPrice}/night
                </label>
                <input type="range" min={10} max={200} step={5} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$10</span><span>$200</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  {lang === "ru" ? "Опыт / Впечатление" : lang === "hy" ? "Փորձ / Տպավորություն" : lang === "fr" ? "Expérience" : lang === "de" ? "Erlebnis" : lang === "es" ? "Experiencia" : lang === "ar" ? "تجربة" : lang === "zh" ? "体验" : "Experience"}
                </label>
                <input type="text" value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Wine, excursion..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {loading ? tr.common.loading : `${filtered.length} ${h.pageTitle}`}
          </h1>
          <div className="flex items-center gap-3">
            {filtered.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={14} /> <span>🇦🇲 Armenia</span>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="flex bg-white rounded-full border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${viewMode === "list" ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
                  style={viewMode === "list" ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : {}}
                >
                  {h.listView}
                </button>
                <button
                  onClick={() => setViewMode("map")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Map hosts={filtered} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{h.notFound}</h3>
            <p className="text-gray-500 mb-6">{h.notFoundSub}</p>
            <button
              onClick={() => { setSearch(""); setRegion(""); setMinStars(0); setMaxPrice(200); }}
              className="px-6 py-2.5 rounded-full text-white font-medium"
              style={{ background: "#D4001A" }}
            >
              {h.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((host) => <HostCard key={host.id} host={host} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HostsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>}>
      <HostsContent />
    </Suspense>
  );
}
