"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Home, Search, Heart, User, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import getUI from "@/lib/ui";

const COMPARE_KEY = "hayhome_compare";
const easing = [0.25, 0.46, 0.45, 0.94] as const;

export default function Header() {
  const [open, setOpen]               = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [scrolled, setScrolled]       = useState(false);
  const { tr, lang } = useLang();
  const { user, logout } = useAuth();
  const n = tr.nav;
  const u = getUI(lang);

  // Track scroll for glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Compare badge
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

  const navItems = [
    { href: "/hosts",        icon: <Search size={14} />, label: n.findFamily },
    { href: "/become-host",  icon: <Home size={14} />,   label: n.hostGuests },
    { href: "/about",        icon: <Heart size={14} />,  label: n.about      },
    { href: "/services",     icon: <>✨</>,               label: u.services   },
    { href: "/requests/new", icon: <>💭</>,               label: u.experience || "Experiences" },
    { href: "/events",       icon: <>🎉</>,               label: u.events     },
  ];

  const menuVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    show: {
      opacity: 1,
      height: "auto",
      overflow: "hidden",
      transition: { duration: 0.35, ease: easing },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: easing },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05, ease: easing },
    }),
  };

  return (
    <motion.header
      className="sticky top-0 z-50 transition-all duration-300"
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(0,0,0,0.04)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-200/50"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              H
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              Hay<span style={{ color: "#D4001A" }}>Home</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-gray-600 relative z-0"
              >
                {item.icon} {item.label}
              </Link>
            ))}
            {compareCount > 0 && (
              <Link href="/compare" className="nav-link relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-gray-600 z-0">
                ⚖️ {u.compare}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white rounded-full shadow-sm"
                  style={{ background: "#D4001A" }}
                >
                  {compareCount}
                </motion.span>
              </Link>
            )}
          </nav>

          {/* Right: lang + auth */}
          <div className="hidden lg:flex items-center gap-2.5">
            <LanguageSwitcher />

            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full transition-shadow hover:shadow-md"
                  style={{ background: "#FDF6EC", border: "2px solid #F2A900" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                  >
                    {user.name[0]}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-semibold text-gray-800">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: easing }}
                      className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3" style={{ background: "linear-gradient(135deg, rgba(212,0,26,0.05), rgba(242,169,0,0.08))" }}>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-xs font-semibold capitalize" style={{ color: "#D4001A" }}>{user.role}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <User size={15} /> {u.dashboard}
                        </Link>
                        <Link href="/partner" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          🤝 {n.partner}
                        </Link>
                        {user.role === "provider" && (
                          <Link href="/provider/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            🔧 {u.provider}
                          </Link>
                        )}
                        {user.role === "admin" && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Shield size={15} /> {u.adminPanel}
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={async () => { setUserMenuOpen(false); await logout(); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                          style={{ color: "#D4001A" }}
                        >
                          <LogOut size={15} /> {n.logout}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/login" className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-md" style={{ color: "#D4001A", border: "2px solid #D4001A" }}>
                    {n.login}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="px-5 py-2 rounded-full text-white text-sm font-semibold shadow-lg shadow-red-200/50 transition-all" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                    {n.register}
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {user && (
              <Link href="/dashboard" className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {user.name[0]}
              </Link>
            )}
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? u.closeMenu : u.openMenu}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1"
          >
            {user && (
              <motion.div custom={0} variants={itemVariants} initial="hidden" animate="show"
                className="flex items-center gap-3 p-3 rounded-2xl mb-2" style={{ background: "#FDF6EC" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {user.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </motion.div>
            )}

            {navItems.map((item, i) => (
              <motion.div key={item.href} custom={i + 1} variants={itemVariants} initial="hidden" animate="show">
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span> {item.label}
                </Link>
              </motion.div>
            ))}

            {compareCount > 0 && (
              <motion.div custom={navItems.length + 1} variants={itemVariants} initial="hidden" animate="show">
                <Link href="/compare" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={() => setOpen(false)}>
                  ⚖️ {u.compare}
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white rounded-full" style={{ background: "#D4001A" }}>
                    {compareCount}
                  </span>
                </Link>
              </motion.div>
            )}

            {user && (
              <motion.div custom={navItems.length + 2} variants={itemVariants} initial="hidden" animate="show">
                <Link href="/partner" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors" onClick={() => setOpen(false)}>
                  🤝 {n.partner}
                </Link>
              </motion.div>
            )}

            <motion.div custom={navItems.length + 3} variants={itemVariants} initial="hidden" animate="show" className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-center py-3 rounded-full text-sm font-semibold" style={{ background: "#FDF6EC", color: "#D4001A", border: "1.5px solid #F2A900" }} onClick={() => setOpen(false)}>
                    {u.dashboard}
                  </Link>
                  <button onClick={() => { setOpen(false); logout(); }} className="py-3 rounded-full text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                    {n.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-center py-3 rounded-full text-sm font-semibold" style={{ color: "#D4001A", border: "1.5px solid #D4001A" }} onClick={() => setOpen(false)}>
                    {n.login}
                  </Link>
                  <Link href="/register" className="text-center py-3 rounded-full text-white text-sm font-semibold shadow-lg shadow-red-200/50" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }} onClick={() => setOpen(false)}>
                    {n.register}
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
