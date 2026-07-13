"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { regionName } from "@/lib/i18n-utils";

interface Host {
  id: string;
  familyName: string;
  region: string;
  city: string;
  coverPhoto: string;
  rating: number;
  maxGuests: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  region: string;
}

interface Props {
  type: "all" | "hosts" | "services" | "similar-hosts" | "similar-services";
  region?: string;
  category?: string;
  hostId?: string;
  excludeId?: string;
  limit?: number;
  title?: string;
  titleEn?: string;
}

export default function Recommendations({ type, region, category, hostId, excludeId, limit = 4, title, titleEn }: Props) {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const [data, setData] = useState<{ hosts: Host[]; services: Service[] }>({ hosts: [], services: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, region, category, hostId, excludeId, limit }),
    })
      .then(r => r.json())
      .then(d => { setData(d || { hosts: [], services: [] }); setLoading(false); })
      .catch(() => setLoading(false));
  }, [type, region, category, hostId, excludeId, limit]);

  if (loading) return null;

  const hasHosts = data.hosts.length > 0;
  const hasServices = data.services.length > 0;
  if (!hasHosts && !hasServices) return null;

  const showTitle = title || titleEn;

  return (
    <div className="mb-8">
      {showTitle && (
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          {isRu ? title : titleEn}
        </h2>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.hosts.map(h => (
          <Link key={h.id} href={`/hosts/${h.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block group">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
              {h.coverPhoto ? (
                <img src={h.coverPhoto} alt={h.familyName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">🏠</div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{h.familyName}</h4>
              <p className="text-xs text-gray-500">{regionName(h.region, lang)} · {h.city}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">🆓 Бесплатно</span>
                {h.rating > 0 && <span className="text-xs text-gray-400">⭐ {h.rating.toFixed(1)}</span>}
              </div>
            </div>
          </Link>
        ))}
        {data.services.map(s => (
          <Link key={s.id} href={`/services#${s.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow block group">
            <div className="text-2xl mb-1">
              {s.category === "food" ? "🍴" : s.category === "tour" ? "🗺️" : s.category === "music" ? "🎵" : s.category === "events" ? "🎉" : s.category === "culture" ? "🎭" : "✨"}
            </div>
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{s.title}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
            <span className="text-sm font-bold text-red-600 mt-2 block">${s.price}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
