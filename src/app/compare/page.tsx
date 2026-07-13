"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Globe, X, Check } from "lucide-react";
import { Host } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { translateLang, translateBadge, translateAmenity, translateExperience, getLocalizedField } from "@/lib/i18n-utils";

const COMPARE_KEY = "hayhome_compare";

function getCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setCompareIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("hayhome_compare_change"));
}

function CompareContent() {
  const router = useRouter();
  const { tr, lang } = useLang();
  const u = getUI(lang);

  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const loaded = getCompareIds();
    setIds(loaded);
  }, []);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/compare?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data: Host[]) => {
        setHosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ids]);

  const removeHost = (id: string) => {
    const remaining = ids.filter((x) => x !== id);
    setIds(remaining);
    setCompareIds(remaining);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (ids.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{u.compareFamilies}</h1>
          <p className="text-gray-500 mb-6">{u.noCompare}</p>
          <Link
            href="/hosts"
            className="inline-block px-6 py-3 rounded-full text-white font-semibold transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            {tr.home.allFamilies}
          </Link>
        </div>
      </div>
    );
  }

  // Helper to find the best value among hosts
  const bestRating = Math.max(...hosts.map((h) => h.rating));

  const bestReviewCount = Math.max(...hosts.map((h) => h.reviewCount));

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${hosts.length}, 1fr)` }}>
      <div className="py-4 px-4 font-semibold text-gray-700 text-sm bg-gray-50">{label}</div>
      {children}
    </div>
  );

  const Cell = ({ highlight, children }: { highlight?: boolean; children: React.ReactNode }) => (
    <div className={`py-4 px-4 text-center text-sm ${highlight ? "text-green-700 font-bold bg-green-50" : "text-gray-700"}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">⚖️</span>
          <h1 className="text-3xl font-extrabold text-gray-900">{u.compareFamilies}</h1>
        </div>

      {/* Desktop: side-by-side table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full border border-gray-200 rounded-2xl overflow-hidden">
          {/* Photo row */}
          <div className="grid bg-white" style={{ gridTemplateColumns: `200px repeat(${hosts.length}, 1fr)` }}>
            <div className="bg-gray-50" />
            {hosts.map((h) => (
              <div key={h.id} className="relative p-4">
                <button
                  onClick={() => removeHost(h.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 z-10"
                  title={u.removeFromCompare}
                >
                  <X size={14} />
                </button>
                <div className="relative h-32 rounded-xl overflow-hidden bg-gray-200 mb-3">
                  <Image src={h.coverPhoto} alt={h.familyName} fill className="object-cover" sizes="300px" />
                </div>
                <Link href={`/hosts/${h.id}`} className="block text-center font-bold text-gray-900 hover:text-red-600 transition text-sm">
                  {getLocalizedField(h.familyName, h.i18n, "familyName", lang)}
                </Link>
              </div>
            ))}
          </div>

          <Row label={tr.common.rating}>
            {hosts.map((h) => (
              <Cell key={h.id} highlight={h.rating === bestRating && h.rating > 0}>
                <div className="flex items-center justify-center gap-1">
                  <Star size={14} fill="#F2A900" color="#F2A900" />
                  {h.rating > 0 ? h.rating.toFixed(1) : tr.common.newHost}
                </div>
                {h.rating === bestRating && h.rating > 0 && <span className="text-xs text-green-600 mt-1">↑ {u.better}</span>}
              </Cell>
            ))}
          </Row>

          <Row label={u.priceLabel}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full text-sm">🆓 Бесплатно</span>
              </Cell>
            ))}
          </Row>

          <Row label={tr.hosts.reviews}>
            {hosts.map((h) => (
              <Cell key={h.id} highlight={h.reviewCount === bestReviewCount && h.reviewCount > 0}>
                {h.reviewCount}
                {h.reviewCount === bestReviewCount && h.reviewCount > 0 && <span className="text-xs text-green-600 ml-1">↑</span>}
              </Cell>
            ))}
          </Row>

          <Row label={tr.hosts.region}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <div className="flex items-center justify-center gap-1">
                  <MapPin size={12} /> {h.region}
                </div>
              </Cell>
            ))}
          </Row>

          <Row label={tr.hosts.languages}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <div className="flex flex-wrap justify-center gap-1">
                  {h.languages.map((l) => (
                    <span key={l} className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">
                      {translateLang(l, lang)}
                    </span>
                  ))}
                </div>
              </Cell>
            ))}
          </Row>

          <Row label={tr.hosts.experiences}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <div className="flex flex-wrap justify-center gap-1">
                  {h.experiences.map((e) => (
                    <span key={e} className="text-xs bg-orange-50 text-orange-700 rounded-full px-2 py-0.5">
                      {translateExperience(e, lang)}
                    </span>
                  ))}
                </div>
              </Cell>
            ))}
          </Row>

          <Row label={tr.hosts.amenities}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <div className="flex flex-wrap justify-center gap-1">
                  {h.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-0.5 text-xs text-gray-600">
                      <Check size={10} className="text-green-500" /> {translateAmenity(a, lang)}
                    </span>
                  ))}
                </div>
              </Cell>
            ))}
          </Row>

          <Row label={u.activeStatus}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <div className="flex flex-wrap justify-center gap-1">
                  {h.badges?.map((b) => (
                    <span key={b} className="text-xs badge-pill whitespace-nowrap">
                      {translateBadge(b, lang)}
                    </span>
                  ))}
                </div>
              </Cell>
            ))}
          </Row>

          <Row label={u.guestsLabel}>
            {hosts.map((h) => (
              <Cell key={h.id}>{h.maxGuests}</Cell>
            ))}
          </Row>

          <Row label={u.descriptionLabel}>
            {hosts.map((h) => (
              <Cell key={h.id}>
                <p className="text-xs text-gray-500 line-clamp-3">
                  {getLocalizedField(h.description, h.i18n, "description", lang)}
                </p>
              </Cell>
            ))}
          </Row>

          {/* Action row */}
          <div className="grid bg-white" style={{ gridTemplateColumns: `200px repeat(${hosts.length}, 1fr)` }}>
            <div className="bg-gray-50" />
            {hosts.map((h) => (
              <div key={h.id} className="p-4 text-center">
                <Link
                  href={`/hosts/${h.id}`}
                  className="inline-block px-5 py-2.5 rounded-full text-white font-bold text-sm transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                >
                  {u.select}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: vertical cards */}
      <div className="md:hidden space-y-4">
        {hosts.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image src={h.coverPhoto} alt={h.familyName} fill className="object-cover" sizes="80px" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{getLocalizedField(h.familyName, h.i18n, "familyName", lang)}</h3>
                  <p className="text-xs text-gray-500">{h.region}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} fill="#F2A900" color="#F2A900" />
                    <span className="text-xs font-semibold">{h.rating > 0 ? h.rating.toFixed(1) : tr.common.newHost}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeHost(h.id)}
                className="relative z-10 w-8 h-8 -m-1 rounded-full bg-red-50 hover:bg-red-100 active:bg-red-200 flex items-center justify-center text-red-600 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 py-1.5">
                <span className="text-gray-400">🆓 Стоимость</span>
                <span className="font-bold text-green-600">Бесплатно</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1.5">
                <span className="text-gray-400">⭐ {tr.common.rating}</span>
                <span className={`font-bold ${h.rating === bestRating && h.rating > 0 ? "text-green-600" : "text-gray-700"}`}>
                  {h.rating > 0 ? h.rating.toFixed(1) : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1.5">
                <span className="text-gray-400">💬 {tr.hosts.reviews}</span>
                <span className="text-gray-700 font-medium">{h.reviewCount}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1.5">
                <span className="text-gray-400">👥 {u.guestsLabel}</span>
                <span className="text-gray-700 font-medium">{h.maxGuests}</span>
              </div>
              <div className="border-b border-gray-100 py-1.5">
                <span className="text-gray-400 block mb-1">🌐 {tr.hosts.languages}</span>
                <div className="flex flex-wrap gap-1">
                  {h.languages.map((l) => (
                    <span key={l} className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">{translateLang(l, lang)}</span>
                  ))}
                </div>
              </div>
              <div className="py-1.5">
                <span className="text-gray-400 block mb-1">✨ {tr.hosts.experiences}</span>
                <div className="flex flex-wrap gap-1">
                  {h.experiences.map((e) => (
                    <span key={e} className="text-xs bg-orange-50 text-orange-700 rounded-full px-2 py-0.5">{translateExperience(e, lang)}</span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/hosts/${h.id}`}
              className="block text-center mt-3 py-2.5 rounded-full text-white font-bold text-sm transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              {u.select}
            </Link>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return <CompareContent />;
}
