"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";

export default function Footer() {
  const { tr, lang } = useLang();
  const n = tr.nav;
  const h = tr.home;
  const u = getUI(lang);

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Big join CTA */}
      <div className="border-b border-white/5" style={{ background: "linear-gradient(135deg, #1a0800, #00001a)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-4xl mb-4">🇦🇲</div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Բարի եկաք!
          </h3>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            {u.footerTagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hosts"
              className="px-8 py-3.5 rounded-full font-bold text-white hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {n.findFamily}
            </Link>
            <Link href="/become-host"
              className="px-8 py-3.5 rounded-full font-bold border border-white/20 text-white hover:bg-white/10 transition">
              {n.hostGuests}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10">
            {[
              { label: "Instagram", href: "https://instagram.com/hayhome.am", icon: "📸" },
              { label: "Facebook", href: "https://facebook.com/hayhome.am", icon: "👤" },
              { label: "Telegram", href: "https://t.me/hayhome_bot", icon: "✈️" },
              { label: "YouTube", href: "#", icon: "▶️" },
            ].map((s) => (
              <a key={s.label} href={s.href}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-sm font-medium">
                <span>{s.icon}</span> {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>H</div>
              <span className="text-xl font-extrabold text-white">
                Hay<span style={{ color: "#F2A900" }}>Home</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {u.armenianPlatform}
            </p>
            <a href="mailto:info@hayhome.am" className="text-sm text-gray-400 hover:text-white transition-colors mt-2 inline-block">
              ✉️ info@hayhome.am
            </a>
            <div className="flex gap-1 mt-3">
              <div className="h-1 w-8 rounded-full" style={{ background: "#D4001A" }} />
              <div className="h-1 w-8 rounded-full" style={{ background: "#0033A0" }} />
              <div className="h-1 w-8 rounded-full" style={{ background: "#F2A900" }} />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">{n.about}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{n.about}</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">{n.partner}</Link></li>
              <li><Link href="/hosts" className="hover:text-white transition-colors">{n.findFamily}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">{n.hostGuests}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/become-host" className="hover:text-white transition-colors">{n.hostGuests}</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">{n.register}</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">{n.login}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">{tr.legal?.terms}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">{tr.legal?.terms}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{tr.legal?.privacy}</Link></li>
              <li><Link href="/rules" className="hover:text-white transition-colors">{tr.legal?.rules}</Link></li>
              <li><Link href="/requisites" className="hover:text-white transition-colors">{u.requisites}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2025 HayHome. {u.madeInArmenia}</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">{tr.legal?.terms}</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">{tr.legal?.privacy}</Link>
            <Link href="/rules" className="hover:text-gray-400 transition-colors">{tr.legal?.rules}</Link>
            <Link href="/requisites" className="hover:text-gray-400 transition-colors">{u.requisites}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
