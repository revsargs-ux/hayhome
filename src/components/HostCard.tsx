"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin, Users, Star } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { Host } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import { useLightbox } from "@/contexts/LightboxContext";
import { translateLang, translateBadge, getLocalizedField } from "@/lib/i18n-utils";
import getUI from "@/lib/ui";

const COMPARE_KEY = "hayhome_compare";
const MAX_COMPARE = 3;

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

interface Props { host: Host; valueRank?: number; }

export default function HostCard({ host, valueRank }: Props) {
  const { tr, lang } = useLang();
  const h = tr.hosts;
  const u = getUI(lang);
  const lightbox = useLightbox();
  const [inCompare, setInCompare] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const check = () => setInCompare(getCompareIds().includes(host.id));
    check();
    window.addEventListener("hayhome_compare_change", check);
    return () => window.removeEventListener("hayhome_compare_change", check);
  }, [host.id]);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = getCompareIds();
    if (inCompare) {
      setCompareIds(ids.filter((id) => id !== host.id));
      setInCompare(false);
    } else {
      if (ids.length >= MAX_COMPARE) {
        setToast(u.maxCompare);
        setTimeout(() => setToast(""), 2500);
        return;
      }
      setCompareIds([...ids, host.id]);
      setInCompare(true);
    }
  };

  const familyName = getLocalizedField(host.familyName, host.i18n, "familyName", lang);
  const description = getLocalizedField(host.description, host.i18n, "description", lang);

  return (
    <Link href={`/hosts/${host.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer h-full flex flex-col">
        <div className="relative h-52 overflow-hidden bg-gray-200 flex-shrink-0">
          <div
            className="relative w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              const imgs = [host.coverPhoto, ...host.photos.filter(p => p !== host.coverPhoto)];
              lightbox.open(imgs, 0);
            }}
          >
            <Image src={host.coverPhoto} alt={familyName} fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          </div>
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-yellow-400 text-xs leading-none">{"★".repeat(host.stars)}</span>
          </div>
          {valueRank && valueRank <= 3 && (
            <div className={`absolute top-12 left-3 rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1 ${
              valueRank === 1 ? "bg-yellow-400" : valueRank === 2 ? "bg-gray-300" : "bg-amber-600"
            }`}>
              <span className="text-xs font-bold text-white">🏆 #{valueRank}</span>
            </div>
          )}
          {host.verified && (
            <div className="absolute top-3 right-3 bg-green-500 rounded-full px-2.5 py-1 shadow-sm">
              <span className="text-xs font-bold text-white">✓ {h.verified}</span>
            </div>
          )}
          <div className="absolute top-3 right-3 mt-8">
            <FavoriteButton hostId={host.id} size={22} />
          </div>
          {toast && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg z-20 whitespace-nowrap">
              {toast}
            </div>
          )}
          <button
            onClick={toggleCompare}
            className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition z-10 ${inCompare ? "bg-red-600 text-white" : "bg-white/95 text-gray-700 hover:bg-white"}`}
            title={inCompare ? u.removeFromCompare : u.addToCompare}
          >
            <span className="text-sm">⚖️</span>
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent p-3 pointer-events-none">
            <span className="text-white font-extrabold text-xl">${host.pricePerNight}</span>
            <span className="text-white/75 text-sm">{h.perNight}</span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">{familyName}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2.5">
            <MapPin size={13} className="flex-shrink-0" />
            <span>{host.city}, {host.region}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">{description}</p>

          {host.badges && host.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {host.badges.slice(0, 3).map((badge) => (
                <span key={badge} className="badge-pill text-xs whitespace-nowrap">
                  {translateBadge(badge, lang)}
                </span>
              ))}
              {host.badges.length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{host.badges.length - 3}</span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-1 mb-3">
            {host.languages.map((l) => (
              <span key={l} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 font-medium">
                {translateLang(l, lang)}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-1">
              <Star size={14} fill="#F2A900" color="#F2A900" />
              <span className="text-sm font-bold text-gray-900">
                {host.rating > 0 ? host.rating.toFixed(1) : tr.common.newHost}
              </span>
              {host.reviewCount > 0 && <span className="text-sm text-gray-400">({host.reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Users size={13} />
              <span>{h.upTo} {host.maxGuests} {h.guests}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
