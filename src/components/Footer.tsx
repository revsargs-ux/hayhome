"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const { tr } = useLang();
  const n = tr.nav;
  const h = tr.home;

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Big join CTA */}
      <div className="border-b border-white/5" style={{ background: "linear-gradient(135deg, #1a0800, #00001a)" }}>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-4xl mb-4">🇦🇲</div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Bari Ekeq!
          </h3>
          <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
            Armenia is waiting for you — not in a hotel, but at home.
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
              { label: "Instagram", href: "#", icon: "📸" },
              { label: "Facebook", href: "#", icon: "👤" },
              { label: "Telegram", href: "#", icon: "✈️" },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>H</div>
              <span className="text-xl font-extrabold text-white">
                Hay<span style={{ color: "#F2A900" }}>Home</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Armenian hospitality platform. Connecting guests with Armenian families worldwide.
            </p>
            <div className="flex gap-1 mt-4">
              <div className="h-1 w-8 rounded-full" style={{ background: "#D4001A" }} />
              <div className="h-1 w-8 rounded-full" style={{ background: "#0033A0" }} />
              <div className="h-1 w-8 rounded-full" style={{ background: "#F2A900" }} />
            </div>
            <p className="text-xs text-gray-600 mt-4">🇦🇲 Armenia, Yerevan</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{n.findFamily}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/hosts" className="hover:text-white transition-colors">{n.findFamily}</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">{n.register}</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">{n.login}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{n.hostGuests}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/become-host" className="hover:text-white transition-colors">{n.hostGuests}</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">{n.about}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{n.about}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mission</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2025 HayHome. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/rules" className="hover:text-gray-400 transition-colors">Rules</Link>
            <span>Made with ❤️ in Armenia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
