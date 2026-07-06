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

const CATEGORIES_MAP: Record<string, string> = {
  all: "all",
  events: "events",
  food: "food",
  tour: "tour",
  culture: "culture",
  music: "music",
  custom: "custom",
};

const REGIONS = [
  { value: "all", label: "Yerevan" },
  { value: "Kotayk", label: "Kotayk" },
  { value: "Tavush", label: "Tavush" },
  { value: "Gegharkunik", label: "Gegharkunik" },
  { value: "Lori", label: "Lori" },
  { value: "Shirak", label: "Shirak" },
  { value: "Aragatsotn", label: "Aragatsotn" },
  { value: "Armavir", label: "Armavir" },
  { value: "Ararat", label: "Ararat" },
  { value: "Syunik", label: "Syunik" },
  { value: "Vayots Dzor", label: "Vayots Dzor" },
];

const categoryOrder = ["all", "events", "food", "tour", "culture", "music", "custom"];

export default function RequestsPage() {
  const { lang, tr } = useLang();
  const u = getUI(lang);
  const req = (tr as any).requests || {};

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
            {req.findGuests || "Find Guests"}
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {req.findGuestsDesc || "Guests are looking for a place to stay — respond to their requests"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Create button */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            {req.openRequests || "Open Requests"}
          </h2>
          <Link
            href="/requests/new"
            className="px-5 py-2.5 rounded-full text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            + {req.createRequest || "Create Request"}
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 mb-1 block">{req.category || "Category"}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            >
              {categoryOrder.map((c) => (
                <option key={c} value={c}>
                  {req[c] || c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs text-gray-500 mb-1 block">{req.region || "Region"}</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            >
              <option value="all">{req.all || "All"}</option>
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
              {req.noRequests || "No open requests yet"}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {req.noRequestsSub || "When tourists start searching, you will see their requests here"}
            </p>
            <Link
              href="/requests/new"
              className="inline-block px-5 py-2.5 rounded-full border-2 border-dashed border-gray-300 text-gray-500 font-medium text-sm hover:border-red-400 hover:text-red-600 transition-colors"
            >
              💭 {req.orCreate || "Or create a request yourself"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req_item) => (
              <Link
                key={req_item.id}
                href={`/requests/${req_item.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{req_item.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    {req[req_item.category || ""] || req_item.category}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{req_item.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  {req_item.region && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {req_item.region}
                    </span>
                  )}
                  {req_item.guests_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {req_item.guests_count} {req.guests || "guests"}
                    </span>
                  )}
                  {req_item.budget && (
                    <span className="flex items-center gap-1">
                      💰 {req_item.budget}
                    </span>
                  )}
                  {(req_item.date_from || req_item.date_to) && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {req_item.date_from} — {req_item.date_to}
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
