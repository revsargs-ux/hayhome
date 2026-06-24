"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Home, Search, Heart, User, LogOut, Shield } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import getUI from "@/lib/ui";

const COMPARE_KEY = "hayhome_compare";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const { tr, lang } = useLang();
  const { user, logout } = useAuth();
  const n = tr.nav;
  const u = getUI(lang);

  useEffect(() => {
    const updateCount = () => {
      try {
        const ids = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
        setCompareCount(Array.isArray(ids) ? ids.length : 0);
      } catch { setCompareCount(0); }
    };
    updateCount();
    window.addEventListener("hayhome_compare_change", updateCount);
    return () => window.removeEventListener("hayhome_compare_change", updateCount);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>H</div>
            <span className="text-xl font-bold text-gray-900">
              Hay<span style={{ color: "#D4001A" }}>Home</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/hosts" className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
              <Search size={15} /> {n.findFamily}
            </Link>
            <Link href="/become-host" className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
              <Home size={15} /> {n.hostGuests}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
              {n.about}
            </Link>
            <Link href="/services" className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
              ✨ {u.services}
            </Link>
            <Link href="/events" className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
              🎉 {u.events}
            </Link>
            {compareCount > 0 && (
              <Link href="/compare" className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">
                <span className="relative">
                  ⚖️ {u.compare}
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white rounded-full" style={{ background: "#D4001A" }}>
                    {compareCount}
                  </span>
                </span>
              </Link>
            )}
          </nav>

          {/* Right: lang + auth */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                    {user.name[0]}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs font-semibold text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <Link href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <User size={14} /> {u.dashboard}
                    </Link>
                    <Link href="/partner"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      🤝 {n.partner}
                    </Link>
                    {user.role === "provider" && (
                      <Link href="/provider/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}>
                        🔧 {u.provider}
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}>
                        <Shield size={14} /> {u.adminPanel}
                      </Link>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={14} /> {n.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm px-3 py-2">
                  {n.login}
                </Link>
                <Link href="/register"
                  className="px-4 py-2 rounded-full text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {n.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {user && (
              <Link href="/dashboard" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {user.name[0]}
              </Link>
            )}
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {user.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          )}
          <Link href="/hosts" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
            <Search size={18} /> {n.findFamily}
          </Link>
          <Link href="/become-host" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
            <Home size={18} /> {n.hostGuests}
          </Link>
          <Link href="/about" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
            <Heart size={18} /> {n.about}
          </Link>
          <Link href="/services" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
            ✨ {u.services}
          </Link>
          <Link href="/events" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
            🎉 {u.events}
          </Link>
          {compareCount > 0 && (
            <Link href="/compare" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
              ⚖️ {u.compare}
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white rounded-full" style={{ background: "#D4001A" }}>
                {compareCount}
              </span>
            </Link>
          )}
          {user && (
            <Link href="/partner" className="flex items-center gap-2 py-2 text-gray-700 font-medium" onClick={() => setOpen(false)}>
              🤝 {n.partner}
            </Link>
          )}
          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className="text-center py-2 border border-gray-300 rounded-full text-gray-700 font-medium" onClick={() => setOpen(false)}>
                  {u.dashboard}
                </Link>
                <button onClick={() => { setOpen(false); logout(); }} className="py-2 rounded-full text-red-600 border border-red-200 font-medium">
                  {n.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-center py-2 border border-gray-300 rounded-full text-gray-700 font-medium" onClick={() => setOpen(false)}>
                  {n.login}
                </Link>
                <Link href="/register" className="text-center py-2 rounded-full text-white font-medium"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }} onClick={() => setOpen(false)}>
                  {n.register}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
