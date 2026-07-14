"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { useLightbox } from "@/contexts/LightboxContext";
import { Host, Review } from "@/lib/types";
import { getHistory } from "@/lib/viewHistory";
import getUI from "@/lib/ui";
import Recommendations from "@/components/Recommendations";
import JsonLd from "@/components/JsonLd";
import ScrollReveal from "@/components/ScrollReveal";

// ---------- helpers ----------

const easing = [0.25, 0.46, 0.45, 0.94] as const;

function useCounter(target: number, duration = 1.8) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ms = duration * 1000;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, display };
}

const cardVariants = {
  hidden: { opacity: 0, y: 44 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65, ease: easing } },
};

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ---------- skeleton ----------

function HostSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-md">
      <div className="h-56 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="h-4 skeleton rounded-lg w-1/2" />
        <div className="h-4 skeleton rounded-lg" />
        <div className="h-4 skeleton rounded-lg w-4/5" />
      </div>
    </div>
  );
}

// ---------- stat item ----------

function StatItem({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { ref, display } = useCounter(value);
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold font-display text-white">
        <span ref={ref}>{display}</span>{suffix}
      </p>
      <p className="mt-1 text-sm md:text-base text-white/70 font-medium">{label}</p>
    </div>
  );
}

// ---------- page ----------

export default function HomePage() {
  const { lang, tr } = useLang();
  const u = getUI(lang);
  const h = tr.home;
  const lightbox = useLightbox();
  const [hosts, setHosts]         = useState<Host[]>([]);
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [loading, setLoading]     = useState(true);
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

  useEffect(() => {
    const history = getHistory();
    if (history.length === 0) return;
    const recentIds = history.slice(0, 6).map((h) => h.hostId);
    Promise.all(
      recentIds.map((id) => fetch(`/api/hosts/${id}`).then((r) => r.json()).catch(() => null))
    ).then((results) => {
      setRecentHosts(results.filter((r) => r && r.id) as Host[]);
    });
  }, []);

  // Parallax hero
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 600], [0, 180]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HayHome",
    url: "https://hay-home.com",
    logo: "https://hay-home.com/icon-512.png",
    description: "Armenian homestay marketplace — experience Armenia through the heart of a family.",
    email: "info@hayhome.am",
    address: { "@type": "PostalAddress", addressLocality: "Yerevan", addressCountry: "AM" },
    sameAs: ["https://www.instagram.com/hayhome", "https://www.facebook.com/hayhome"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HayHome",
    url: "https://hay-home.com",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://hay-home.com/hosts?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={[organizationJsonLd, websiteJsonLd]} />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden flex items-center" style={{ minHeight: "600px" }}>
        {/* Parallax background */}
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: heroImgY, scale: 1.18 }}>
          <Image
            src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1600&q=80&auto=format&fit=crop"
            alt={tr.hero.title1}
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(196,93,62,0.87) 0%, rgba(212,160,74,0.78) 55%, rgba(40,20,5,0.92) 100%)" }} />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing }}
            className="text-xl md:text-2xl text-amber-300 font-semibold mb-3"
          >
            🇦🇲 {tr.hero.greeting}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: easing }}
            className="text-4xl md:text-6xl font-extrabold font-display text-white mb-5 leading-tight"
          >
            {tr.hero.title1}{" "}
            <span style={{ color: "#F2A900" }}>{tr.hero.title2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: easing }}
            className="text-sm md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {tr.hero.subtitle}
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.36, ease: easing }}
            className="max-w-md mx-auto mb-6"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && searchQuery) window.location.href = `/hosts?q=${encodeURIComponent(searchQuery)}`; }}
              placeholder={tr.hero.searchPlaceholder}
              className="w-full px-5 py-3.5 rounded-full bg-white/15 border border-white/25 text-white placeholder-white/45 outline-none focus:bg-white/25 focus:border-white/50 transition text-sm backdrop-blur-sm"
            />
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: easing }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={searchQuery ? `/hosts?q=${encodeURIComponent(searchQuery)}` : "/hosts"}
                className="inline-block px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold text-white transition shadow-lg"
                style={{ background: "#D4001A" }}
              >
                {tr.hero.searchBtn}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/become-host"
                className="inline-block px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold border-2 border-white/35 text-white hover:bg-white/10 transition"
              >
                {h.becomeCta}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/partner"
                className="inline-block px-8 py-3.5 md:py-4 rounded-full text-base md:text-lg font-semibold border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 transition"
              >
                🤝 {tr.nav.partner}
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-white/60 mt-5 text-sm"
          >
            {loading ? "" : hosts.length} {tr.hero.familiesWaiting}
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "linear-gradient(90deg, #C45D3E 0%, #D4A04A 100%)" }} className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={120} suffix="+" label={h.statFamilies ?? "Families"} />
            <StatItem value={18} suffix="" label={h.statRegions ?? "Regions"} />
            <StatItem value={94} suffix="%" label={h.statSatisfaction ?? "Satisfaction"} />
            <StatItem value={10} suffix="+" label={h.statLanguages ?? "Languages"} />
          </div>
        </div>
      </section>

      {/* ── Why HayHome ── */}
      <section className="py-24" style={{ background: "#FFF8F0" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-gray-900 mb-4">{h.whyTitle}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{h.whySub}</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🏡", title: h.realHome,  desc: h.realHomeDesc },
              { icon: "✅", title: h.verified,  desc: h.verifiedDesc },
              { icon: "🌍", title: h.unite,     desc: h.uniteDesc    },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(196,93,62,0.15)" }}
                  transition={{ duration: 0.3, ease: easing }}
                  className="text-center p-8 rounded-2xl bg-white h-full cursor-default"
                  style={{ boxShadow: "0 2px 16px rgba(196,93,62,0.07)" }}
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
                    className="text-5xl mb-5"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Families ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-gray-900 mb-4">{h.ourFamilies}</h2>
            <p className="text-gray-600 text-lg">{h.ourFamiliesSub}</p>
          </ScrollReveal>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <HostSkeleton key={i} />)}
            </div>
          ) : (
            <>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                {hosts.map((host) => (
                  <motion.div key={host.id} variants={cardVariants}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: easing }}
                    >
                      <Link href={`/hosts/${host.id}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                        <div
                          className="relative h-56 overflow-hidden cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            const imgs = [host.coverPhoto, ...host.photos.filter(p => p !== host.coverPhoto)];
                            lightbox.open(imgs, 0);
                          }}
                        >
                          <Image
                            src={host.coverPhoto}
                            alt={host.familyName}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-500"
                          />
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
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              <ScrollReveal className="text-center mt-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/hosts"
                    className="inline-block px-8 py-3 rounded-full font-semibold border-2 transition hover:bg-gray-900 hover:text-white"
                    style={{ borderColor: "#1f1f1f" }}
                  >
                    {h.allFamilies}
                  </Link>
                </motion.div>
              </ScrollReveal>
            </>
          )}
        </div>
      </section>

      {/* ── Smart Recommendations ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Recommendations type="services" title="✨ Рекомендуемые услуги" titleEn="✨ Recommended Services" limit={4} />
          <Recommendations type="hosts"    title="🏆 Топ семьи этого месяца" titleEn="🏆 Top families this month" limit={4} />
        </div>
      </section>

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-extrabold font-display text-gray-900 mb-4">{tr.hosts.reviews}</h2>
            </ScrollReveal>

            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: easing }}
                  className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className={i < review.rating ? "text-amber-400" : "text-gray-200"}
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 line-clamp-4">"{review.comment}"</p>
                  <p className="text-sm font-semibold text-gray-900">— {review.guestName}</p>
                  <p className="text-xs text-gray-400">{review.guestCountry} · {review.date}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Recently Viewed ── */}
      {recentHosts.length > 0 && (
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-extrabold font-display text-gray-900 mb-6">{u.recentlyViewed}</h2>
            </ScrollReveal>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {recentHosts.map((host, i) => (
                <motion.div
                  key={host.id}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: easing }}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-64 snap-start"
                >
                  <Link
                    href={`/hosts/${host.id}`}
                    className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition bg-white border border-gray-100"
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
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(135deg, #C45D3E, #D4A04A, #D4001A, #C45D3E)",
            backgroundSize: "300% 300%",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal direction="none">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">{h.becomeTitle}</h2>
            <p className="text-white/85 text-base md:text-lg mb-8 max-w-xl mx-auto">{h.becomeSub}</p>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/become-host"
                className="inline-block px-9 py-4 rounded-full bg-white text-base md:text-lg font-bold shadow-xl transition"
                style={{ color: "#C45D3E" }}
              >
                {h.becomeCta}
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
