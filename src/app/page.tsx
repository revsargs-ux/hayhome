"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useLightbox } from "@/contexts/LightboxContext";
import { Host, Review } from "@/lib/types";
import { getHistory } from "@/lib/viewHistory";
import getUI from "@/lib/ui";
import Recommendations from "@/components/Recommendations";

export default function HomePage() {
  const { lang, tr } = useLang();
  const u = getUI(lang);
  const h = tr.home;
  const lightbox = useLightbox();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentHosts, setRecentHosts] = useState<Host[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/hosts").then(r => r.json()),
      fetch("/api/reviews").then(r => r.json()),
    ]).then(([h, r]) => {
      setHosts(h.filter((x: Host) => x.status === "active").slice(0, 10));
      setReviews(r.slice(0, 3));
      setLoading(false);
    });
  }, []);

  // Load recently viewed hosts
  useEffect(() => {
    const history = getHistory();
    if (history.length === 0) return;
    const recentIds = history.slice(0, 6).map((h) => h.hostId);
    Promise.all(
      recentIds.map((id) => fetch(`/api/hosts/${id}`).then((r) => r.json()).catch(() => null))
    ).then((results) => {
      const valid = results.filter((r) => r && r.id) as Host[];
      setRecentHosts(valid);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden flex items-center md:min-h-[600px]" style={{ minHeight: "520px" }}>
        <Image
          src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1600&q=80&auto=format&fit=crop"
          alt={tr.hero.title1}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(196,93,62,0.85) 0%, rgba(212,160,74,0.75) 60%, rgba(60,30,10,0.90) 100%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center w-full">
          <p className="text-xl md:text-2xl text-amber-300 font-semibold mb-2 md:mb-4">🇦🇲 {tr.hero.greeting}</p>
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight">
            {tr.hero.title1} <span style={{ color: "#F2A900" }}>{tr.hero.title2}</span>
          </h1>
          <p className="text-sm md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8">{tr.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href={searchQuery ? `/hosts?q=${encodeURIComponent(searchQuery)}` : "/hosts"}
              className="w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold text-white transition hover:scale-105" style={{ background: "#D4001A" }}>
              {tr.hero.searchBtn}
            </Link>
            <Link href="/become-host" className="w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition">
              {h.becomeCta}
            </Link>
            <Link href="/partner" className="w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 transition">
              🤝 {tr.nav.partner}
            </Link>
          </div>
          <div className="mt-4 max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && searchQuery) window.location.href = `/hosts?q=${encodeURIComponent(searchQuery)}`; }}
              placeholder={tr.hero.searchPlaceholder}
              className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:bg-white/20 transition text-sm"
            />
          </div>
          <p className="text-white/70 mt-3 text-sm">{loading ? "" : hosts.length} {tr.hero.familiesWaiting}</p>
        </div>
      </section>

      {/* Why HayHome */}
      <section className="py-20" style={{ background: "#FFF8F0" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{h.whyTitle}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{h.whySub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:shadow-md transition bg-white" style={{ boxShadow: "0 2px 12px rgba(196,93,62,0.06)" }}>
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{h.realHome}</h3>
              <p className="text-gray-600">{h.realHomeDesc}</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-md transition bg-white" style={{ boxShadow: "0 2px 12px rgba(196,93,62,0.06)" }}>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{h.verified}</h3>
              <p className="text-gray-600">{h.verifiedDesc}</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-md transition bg-white" style={{ boxShadow: "0 2px 12px rgba(196,93,62,0.06)" }}>
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{h.unite}</h3>
              <p className="text-gray-600">{h.uniteDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Families */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{h.ourFamilies}</h2>
            <p className="text-gray-600 text-lg">{h.ourFamiliesSub}</p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">{tr.common.loading}</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hosts.map((host) => (
                  <Link key={host.id} href={`/hosts/${host.id}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white">
                    <div
                      className="relative h-56 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        const imgs = [host.coverPhoto, ...host.photos.filter(p => p !== host.coverPhoto)];
                        lightbox.open(imgs, 0);
                      }}
                    >
                      <Image src={host.coverPhoto} alt={host.familyName} fill className="object-cover group-hover:scale-105 transition duration-300" />
                      {host.verified && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: "#0033A0" }}>
                          ✓ {tr.hosts.verified}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{(host.i18n?.[lang]?.familyName) || host.familyName}</h3>
                        <span className="text-lg font-bold" style={{ color: "#D4001A" }}>${host.pricePerNight}</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3">
                        📍 {host.city}, {host.region} · ⭐ {Number(host.rating || 0).toFixed(1)} ({host.reviewCount || 0})
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {(host.i18n?.[lang]?.description) || host.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/hosts" className="inline-block px-8 py-3 rounded-full font-semibold border-2 transition hover:bg-gray-900 hover:text-white" style={{ borderColor: "#1f1f1f" }}>
                  {h.allFamilies}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Smart Recommendations */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Recommendations
            type="services"
            title="✨ Рекомендуемые услуги"
            titleEn="✨ Recommended Services"
            limit={4}
          />
          <Recommendations
            type="hosts"
            title="🏆 Топ семьи этого месяца"
            titleEn="🏆 Top families this month"
            limit={4}
          />
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{tr.hosts.reviews}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 rounded-2xl bg-white shadow-md">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-amber-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 line-clamp-4">"{review.comment}"</p>
                  <p className="text-sm font-semibold text-gray-900">— {review.guestName}</p>
                  <p className="text-xs text-gray-400">{review.guestCountry} · {review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentHosts.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{u.recentlyViewed}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {recentHosts.map((host) => (
                <Link
                  key={host.id}
                  href={`/hosts/${host.id}`}
                  className="flex-shrink-0 w-64 snap-start group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100"
                >
                  <div className="relative h-36 overflow-hidden bg-gray-200">
                    <Image
                      src={host.coverPhoto}
                      alt={host.familyName}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="256px"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                      {(host.i18n?.[lang]?.familyName) || host.familyName}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2">📍 {host.city}, {host.region}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#F2A900" color="#F2A900" />
                        <span className="text-xs font-semibold text-gray-700">
                          {host.rating > 0 ? Number(host.rating).toFixed(1) : "New"}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: "#D4001A" }}>${host.pricePerNight}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #C45D3E 0%, #D4A04A 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">{h.becomeTitle}</h2>
          <p className="text-white/85 text-base mb-6 max-w-xl mx-auto">{h.becomeSub}</p>
          <Link href="/become-host" className="inline-block px-7 py-3 rounded-full bg-white text-base font-bold transition hover:scale-105" style={{ color: "#C45D3E" }}>
            {h.becomeCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
