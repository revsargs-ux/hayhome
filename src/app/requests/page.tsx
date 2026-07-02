"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { Search, Users, Calendar, MapPin } from "lucide-react";

interface GuestRequest {
  id: string;
  title: string;
  description: string;
  category: string | null;
  region: string | null;
  date_from: string | null;
  date_to: string | null;
  guests_count: number;
  budget: string | null;
  status: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "all", labelRu: "Все", labelEn: "All" },
  { value: "events", labelRu: "Мероприятия", labelEn: "Events" },
  { value: "food", labelRu: "Еда", labelEn: "Food" },
  { value: "tour", labelRu: "Туры", labelEn: "Tours" },
  { value: "culture", labelRu: "Культура", labelEn: "Culture" },
  { value: "music", labelRu: "Музыка", labelEn: "Music" },
  { value: "custom", labelRu: "Другое", labelEn: "Custom" },
];

const REGIONS = [
  { value: "all", label: "Все / All" },
  { value: "Yerevan", label: "Ереван / Yerevan" },
  { value: "Kotayk", label: "Котайк / Kotayk" },
  { value: "Tavush", label: "Тавуш / Tavush" },
  { value: "Gegharkunik", label: "Гегаркуник / Gegharkunik" },
  { value: "Lori", label: "Лори / Lori" },
  { value: "Shirak", label: "Ширак / Shirak" },
  { value: "Aragatsotn", label: "Арагацотн / Aragatsotn" },
  { value: "Armavir", label: "Армавир / Armavir" },
  { value: "Ararat", label: "Арарат / Ararat" },
  { value: "Syunik", label: "Сюник / Syunik" },
  { value: "Vayots Dzor", label: "Вайоц Дзор / Vayots Dzor" },
];

export default function RequestsPage() {
  const { lang } = useLang();
  const u = getUI(lang);
  const isRu = lang === "ru";

  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (region !== "all") params.set("region", region);

    setLoading(true);
    fetch(`/api/requests?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setRequests([]);
        setLoading(false);
      });
  }, [category, region]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="text-white py-10 px-4" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isRu ? "Найти гостей" : "Find Guests"}
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {isRu
              ? "Гости ищут место для отдыха — откликнитесь на их запросы"
              : "Guests are looking for a place to stay — respond to their requests"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Create button */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {isRu ? "Открытые запросы" : "Open Requests"}
          </h2>
          <Link
            href="/requests/new"
            className="px-5 py-2.5 rounded-full text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            + {isRu ? "Создать запрос" : "Create Request"}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 mb-1 block">{isRu ? "Категория" : "Category"}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {isRu ? c.labelRu : c.labelEn}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 mb-1 block">{isRu ? "Регион" : "Region"}</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">{u.loadingText}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">
              {isRu ? "Пока нет открытых запросов" : "No open requests yet"}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {isRu ? "Как только туристы начнут искать — вы увидите их запросы здесь" : "When tourists start searching, you'll see their requests here"}
            </p>
            <Link
              href="/requests/new"
              className="inline-block px-5 py-2.5 rounded-full border-2 border-dashed border-gray-300 text-gray-500 font-medium text-sm hover:border-red-400 hover:text-red-600 transition-colors"
            >
              💭 {isRu ? "Или создайте запрос сами" : "Or create a request yourself"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{req.title}</h3>
                  {req.category && (
                    <span
                      className="text-xs px-2 py-1 rounded-full text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                    >
                      {req.category}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {req.description}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {req.region && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {req.region}
                    </span>
                  )}
                  {req.guests_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {req.guests_count} {isRu ? "гостей" : "guests"}
                    </span>
                  )}
                  {req.date_from && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {req.date_from}
                      {req.date_to ? ` — ${req.date_to}` : ""}
                    </span>
                  )}
                  {req.budget && (
                    <span className="flex items-center gap-1">
                      💰 {req.budget}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
