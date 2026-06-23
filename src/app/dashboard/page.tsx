"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Booking, Host } from "@/lib/types";
import { Calendar, DollarSign, Users, Star, Edit2, Save, X, RefreshCw, LogOut, Shield, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, Record<string, string>> = {
  ru: { pending: "Ожидает", confirmed: "Подтверждено", completed: "Завершено", cancelled: "Отменено" },
  en: { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
  hy: { pending: "Սպասում", confirmed: "Հաuтвержenо", completed: "Ьавarteл", cancelled: "Аnnvovеl" },
  fr: { pending: "En attente", confirmed: "Confirmé", completed: "Terminé", cancelled: "Annulé" },
  de: { pending: "Ausstehend", confirmed: "Bestätigt", completed: "Abgeschlossen", cancelled: "Storniert" },
  es: { pending: "Pendiente", confirmed: "Confirmado", completed: "Completado", cancelled: "Cancelado" },
  it: { pending: "In attesa", confirmed: "Confermato", completed: "Completato", cancelled: "Annullato" },
  ar: { pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي" },
  zh: { pending: "待处理", confirmed: "已确认", completed: "已完成", cancelled: "已取消" },
  fa: { pending: "در انتظار", confirmed: "تأیید شده", completed: "تکمیل شده", cancelled: "لغو شده" },
};

export default function DashboardPage() {
  const { tr, lang } = useLang();
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myProfile, setMyProfile] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"bookings" | "profile" | "calendar">("bookings");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ description: "", phone: "", pricePerNight: 30 });
  const [partnerCode, setPartnerCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const statusLabels = STATUS_LABELS[lang] ?? STATUS_LABELS.en;

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    const [bRes, hRes, pRes] = await Promise.all([
      fetch("/api/bookings", { credentials: "include" }),
      fetch("/api/hosts?all=1", { credentials: "include" }),
      fetch("/api/partners", { credentials: "include" }).catch(() => null),
    ]);
    const bData = await bRes.json();
    const hData = await hRes.json();

    setBookings(Array.isArray(bData) ? bData : []);

    if (user && Array.isArray(hData)) {
      const profile = hData.find((h: Host) => h.email === user.email);
      if (profile) {
        setMyProfile(profile);
        setEditForm({ description: profile.description, phone: profile.phone, pricePerNight: profile.pricePerNight });
      }
    }
    // Check partner status
    if (pRes && pRes.ok) {
      const pData = await pRes.json();
      if (pData.partner?.code) setPartnerCode(pData.partner.code);
    }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!myProfile) return;
    setSaving(true);
    await fetch(`/api/hosts/${myProfile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    await loadData();
    setEditing(false);
    setSaving(false);
  };

  const myBookings = user?.role === "admin"
    ? bookings
    : bookings.filter(b =>
        // Хозяин видит заявки на свою семью
        (myProfile && b.hostId === myProfile.id) ||
        // Гость видит свои бронирования
        (user && b.guestEmail === user.email)
      );
  const pending = myBookings.filter(b => b.status === "pending").length;
  const confirmed = myBookings.filter(b => b.status === "confirmed").length;
  const revenue = myBookings.filter(b => b.status === "completed").reduce((s, b) => s + b.totalPrice, 0);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {tr.nav.about && (lang === "ru" ? "Личный кабинет" : lang === "hy" ? "Անձնական կաbiнет" : lang === "fr" ? "Mon espace" : lang === "de" ? "Mein Bereich" : lang === "es" ? "Mi espacio" : lang === "it" ? "Il mio spazio" : lang === "ar" ? "لوحتي" : lang === "zh" ? "我的控制台" : lang === "fa" ? "داشبورد من" : "Dashboard")}
            </h1>
            <p className="text-gray-500">{user?.name} · {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-xl hover:bg-purple-100 transition">
                <Shield size={14} /> Admin
              </Link>
            )}
            <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <RefreshCw size={14} />
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition">
              <LogOut size={14} /> {tr.nav.logout}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, value: pending, label: lang === "ru" ? "Новых заявок" : lang === "fr" ? "Nouvelles demandes" : lang === "de" ? "Neue Anfragen" : lang === "ar" ? "طلبات جديدة" : lang === "zh" ? "新请求" : "New requests", color: "text-yellow-500" },
            { icon: <Users size={20} />, value: confirmed, label: lang === "ru" ? "Подтверждённых" : lang === "fr" ? "Confirmés" : lang === "de" ? "Bestätigt" : lang === "ar" ? "مؤكدة" : lang === "zh" ? "已确认" : "Confirmed", color: "text-blue-500" },
            { icon: <Star size={20} />, value: myBookings.length, label: lang === "ru" ? "Всего бронирований" : lang === "fr" ? "Total réservations" : lang === "de" ? "Buchungen gesamt" : lang === "ar" ? "إجمالي الحجوزات" : lang === "zh" ? "总预订" : "Total bookings", color: "text-purple-500" },
            { icon: <DollarSign size={20} />, value: `$${revenue}`, label: lang === "ru" ? "Заработано" : lang === "fr" ? "Revenus" : lang === "de" ? "Verdient" : lang === "ar" ? "المكتسبة" : lang === "zh" ? "已赚取" : "Earned", color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`${stat.color} flex-shrink-0`}>{stat.icon}</div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {([
            { key: "bookings", label: lang === "ru" ? "Бронирования" : lang === "fr" ? "Réservations" : lang === "de" ? "Buchungen" : lang === "ar" ? "الحجوزات" : lang === "zh" ? "预订" : "Bookings" },
            ...(myProfile ? [{ key: "profile", label: lang === "ru" ? "Мой профиль" : lang === "fr" ? "Mon profil" : lang === "de" ? "Mein Profil" : lang === "ar" ? "ملفي" : lang === "zh" ? "我的资料" : "My Profile" }] : []),
            ...(myProfile ? [{ key: "calendar", label: lang === "ru" ? "Календарь" : lang === "fr" ? "Calendrier" : lang === "de" ? "Kalender" : lang === "ar" ? "التقويم" : lang === "zh" ? "日历" : "Calendar" }] : []),
          ] as { key: "bookings" | "profile" | "calendar"; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Partner referral block */}
        {!partnerCode && (
          <div className="mt-4 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ background: "linear-gradient(135deg, #D4001A10, #F2A90010)" }}>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{lang === "ru" ? "🤝 Зарабатывайте с HayHome" : "🤝 Earn with HayHome"}</p>
              <p className="text-xs text-gray-500">{lang === "ru" ? "Приглашайте друзей и получайте 5% от их бронирований" : "Invite friends and earn 5% from their bookings"}</p>
            </div>
            <Link href="/partner/register" className="px-5 py-2 rounded-full text-white text-sm font-semibold flex-shrink-0 hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {lang === "ru" ? "Стать партнёром" : "Become a Partner"}
            </Link>
          </div>
        )}
        {partnerCode && (
          <div className="mt-4 rounded-xl p-4 bg-white shadow-sm">
            <p className="text-xs text-gray-500 mb-2">{lang === "ru" ? "🤝 Ваша партнёрская ссылка — делитесь с друзьями" : "🤝 Your referral link — share with friends"}</p>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 truncate">https://hay-home.com/register?ref={partnerCode}</code>
              <button onClick={() => { navigator.clipboard.writeText("https://hay-home.com/register?ref=" + partnerCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-2 rounded-lg text-sm font-medium transition" style={{ background: copied ? "#16a34a" : "#D4001A", color: "white" }}>
                {copied ? (lang === "ru" ? "✓" : "✓") : (lang === "ru" ? "Копировать" : "Copy")}
              </button>
              <button onClick={() => { if (navigator.share) navigator.share({ title: "HayHome", url: "https://hay-home.com/register?ref=" + partnerCode }); else { navigator.clipboard.writeText("https://hay-home.com/register?ref=" + partnerCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } }} className="px-3 py-2 rounded-lg text-sm font-medium border transition hover:bg-gray-50" style={{ borderColor: "#D4001A", color: "#D4001A" }}>
                <Share2 size={16} /> {lang === "ru" ? "Поделиться" : "Share"}
              </button>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG value={"https://hay-home.com/register?ref=" + partnerCode} size={120} level="M" fgColor="#D4001A" bgColor="white" />
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">{tr.common.loading}</div>
            ) : myBookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500 mb-4">{lang === "ru" ? "Пока нет заявок" : lang === "fr" ? "Pas encore de réservations" : lang === "de" ? "Noch keine Buchungen" : lang === "ar" ? "لا حجوزات بعد" : lang === "zh" ? "暂无预订" : "No bookings yet"}</p>
                <Link href="/hosts" className="text-sm font-semibold" style={{ color: "#D4001A" }}>
                  {tr.nav.findFamily}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {myBookings.map((b) => (
                  <div key={b.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-900">{b.guestName}</span>
                        <span className="text-gray-400 text-sm">· {b.guestCountry}</span>
                        <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                          b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          b.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                          b.status === "completed" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>{statusLabels[b.status]}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {b.hostName} · {b.checkIn} → {b.checkOut} · {b.guests} {lang === "ru" ? "гост." : "guests"} · <strong>${b.totalPrice}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.guestEmail} · {b.guestPhone}</p>
                      {b.message && <p className="text-xs text-gray-500 italic mt-1">"{b.message}"</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/hosts/${b.hostId}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                        {lang === "ru" ? "Профиль" : "Profile"}
                      </Link>
                      {b.status === "completed" && (
                        <Link href={`/hosts/${b.hostId}#reviews`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition"
                          style={{ background: "#D4001A" }}>
                          {lang === "ru" ? "Отзыв" : lang === "fr" ? "Avis" : lang === "de" ? "Bewertung" : lang === "ar" ? "تقييم" : lang === "zh" ? "评价" : "Review"}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && myProfile && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{myProfile.familyName}</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-xl hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  <Edit2 size={14} /> {lang === "ru" ? "Редактировать" : lang === "fr" ? "Modifier" : lang === "de" ? "Bearbeiten" : lang === "ar" ? "تعديل" : lang === "zh" ? "编辑" : "Edit"}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-50 transition">
                    <Save size={14} /> {saving ? "..." : lang === "ru" ? "Сохранить" : "Save"}
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{lang === "ru" ? "Статус" : "Status"}</p>
                  <span className={`font-semibold ${myProfile.status === "active" ? "text-green-600" : myProfile.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {myProfile.status === "active" ? (lang === "ru" ? "Активен" : "Active") : myProfile.status === "pending" ? (lang === "ru" ? "На проверке" : "Pending") : (lang === "ru" ? "Приостановлен" : "Suspended")}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{lang === "ru" ? "Рейтинг" : "Rating"}</p>
                  <span className="font-semibold text-gray-900">⭐ {myProfile.rating || (lang === "ru" ? "Новый" : "New")}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {lang === "ru" ? "Описание" : lang === "fr" ? "Description" : lang === "de" ? "Beschreibung" : lang === "ar" ? "الوصف" : lang === "zh" ? "描述" : "Description"}
                </label>
                {editing ? (
                  <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 resize-none" />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed">{myProfile.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {lang === "ru" ? "Телефон" : "Phone"}
                  </label>
                  {editing ? (
                    <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  ) : (
                    <p className="text-gray-600 text-sm">{myProfile.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {lang === "ru" ? "Цена за ночь" : "Price/night"}
                  </label>
                  {editing ? (
                    <input type="number" min={10} max={500} value={editForm.pricePerNight}
                      onChange={e => setEditForm(f => ({ ...f, pricePerNight: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  ) : (
                    <p className="text-gray-600 text-sm">${myProfile.pricePerNight}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar tab */}
        {tab === "calendar" && myProfile && (
          <CalendarTabContent hostId={myProfile.id} lang={lang} tr={tr} />
        )}
      </div>
    </div>
  );
}

// ── Calendar Tab Content ──
function CalendarTabContent({ hostId, lang, tr }: { hostId: string; lang: string; tr: any }) {
  const h = tr.hosts;
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    fetch(`/api/calendar?hostId=${hostId}&month=${monthStr}`)
      .then(r => r.json())
      .then(data => {
        const m = new Map<string, any>();
        (Array.isArray(data) ? data : []).forEach((e: any) => m.set(e.date, e));
        setEntries(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hostId, viewYear, viewMonth]);

  const toggleDate = async (dateStr: string, currentStatus: string) => {
    if (currentStatus === "booked") return;
    setUpdating(dateStr);
    const newStatus = currentStatus === "blocked" ? "available" : "blocked";
    await fetch("/api/calendar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostId, date: dateStr, status: newStatus }),
    });
    // Update local
    const m = new Map(entries);
    m.set(dateStr, { ...m.get(dateStr), date: dateStr, status: newStatus, host_id: hostId });
    setEntries(m);
    setUpdating(null);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const monthNames = lang === "ru"
    ? ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const dayLabels = [h.mon, h.tue, h.wed, h.thu, h.fri, h.sat, h.sun];

  // Build grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const firstDayIdx = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const getCellStatus = (date: Date): string => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    const entry = entries.get(dateStr);
    return entry ? entry.status : "available";
  };

  const cellBg = (status: string, isPast: boolean): string => {
    if (isPast) return "bg-gray-50 text-gray-300";
    if (status === "booked") return "bg-red-100 text-red-800";
    if (status === "blocked") return "bg-gray-200 text-gray-500 hover:ring-2 hover:ring-gray-400 cursor-pointer";
    return "bg-green-100 text-green-800 hover:ring-2 hover:ring-green-300 cursor-pointer";
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded bg-green-100" /> <span className="text-gray-600">{h.available}</span></div>
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded bg-red-100" /> <span className="text-gray-600">{h.booked}</span></div>
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded bg-gray-200" /> <span className="text-gray-600">{h.blocked}</span></div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft size={18} /></button>
        <h3 className="font-bold text-gray-900 capitalize">{monthNames[viewMonth]} {viewYear}</h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight size={18} /></button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {dayLabels.map((d: string) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">{tr.common.loading}</div>
      ) : weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1.5 mb-1.5">
          {week.map((date, di) => {
            if (!date) return <div key={di} className="min-h-[52px]" />;
            const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
            const status = getCellStatus(date);
            const isPast = dateStr < todayStr;
            return (
              <div
                key={di}
                onClick={() => !isPast && status !== "booked" && toggleDate(dateStr, status)}
                className={`min-h-[52px] rounded-lg p-1.5 text-sm font-semibold transition-all ${cellBg(status, isPast)} ${updating === dateStr ? "opacity-50" : ""}`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {lang === "ru" ? "Нажмите на дату, чтобы заблокировать/разблокировать" : "Click a date to toggle blocked/available"}
        </p>
        <a href="/dashboard/calendar" className="text-xs font-medium" style={{ color: "#D4001A" }}>
          {lang === "ru" ? "Открыть полный календарь →" : "Open full calendar →"}
        </a>
      </div>
    </div>
  );
}
