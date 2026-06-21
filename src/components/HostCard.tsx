"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star } from "lucide-react";
import { Host } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import { translateLang, translateBadge, getLocalizedField } from "@/lib/i18n-utils";

interface Props { host: Host; }

export default function HostCard({ host }: Props) {
  const { tr, lang } = useLang();
  const h = tr.hosts;

  const familyName = getLocalizedField(host.familyName, host.i18n, "familyName", lang);
  const description = getLocalizedField(host.description, host.i18n, "description", lang);

  return (
    <Link href={`/hosts/${host.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover cursor-pointer h-full flex flex-col">
        <div className="relative h-52 overflow-hidden bg-gray-200 flex-shrink-0">
          <Image src={host.coverPhoto} alt={familyName} fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <span className="text-yellow-400 text-xs leading-none">{"★".repeat(host.stars)}</span>
          </div>
          {host.verified && (
            <div className="absolute top-3 right-3 bg-green-500 rounded-full px-2.5 py-1 shadow-sm">
              <span className="text-xs font-bold text-white">✓ {h.verified}</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent p-3">
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
            <div className="badge-scroll mb-3">
              {host.badges.map((badge) => (
                <span key={badge} className="badge-pill flex-shrink-0">
                  {translateBadge(badge, lang)}
                </span>
              ))}
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
