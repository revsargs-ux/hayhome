"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Booking, Host } from "@/lib/types";
import { Calendar, DollarSign, Users, Star, Edit2, Save, X, RefreshCw, LogOut, Shield, Share2, ChevronLeft, ChevronRight, Navigation, Heart, MessageCircle, Camera, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NavigatorLinks from "@/components/NavigatorLinks";
import { getCityCoords } from "@/lib/cityCoords";
import getUI from "@/lib/ui";
import ChatWidget from "@/components/ChatWidget";
import FavoriteButton from "@/components/FavoriteButton";

const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

// Route translation labels for dashboard
const DASH_RT = {
  route: { ru: "Маршрут", en: "Route", hy: "Երթուղի", fr: "Itinéraire", de: "Route", es: "Ruta", it: "Percorso", ar: "الطريق", zh: "路线", fa: "مسیر" },
  useGeo: { ru: "Определить местоположение", en: "Use my location", hy: "Իմ գտնվելու վայրը", fr: "Ma position", de: "Mein Standort", es: "Mi ubicación", it: "Mia posizione", ar: "موقعي", zh: "我的位置", fa: "موقعیت من" },
};

const STATUS_LABELS: Record<string, Record<string, string>> = {
  ru: { pending: "Ожидает", confirmed: "Подтверждено", completed: "Завершено", cancelled: "Отменено" },
  en: { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
  hy: { pending: "Սպասում", confirmed: "Հաստատված", completed: "Ավարտված", cancelled: "Չեղարկված" },
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
  const u = getUI(lang);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myProfile, setMyProfile] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"bookings" | "profile" | "calendar" | "messages" | "favorites">("bookings");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ description: "", phone: "", pricePerNight: 30 });
  const [partnerCode, setPartnerCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [favHosts, setFavHosts] = useState<Host[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [chatWithUser, setChatWithUser] = useState<string | null>(null);

  // Photo management state
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

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

  const handleDashboardPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !myProfile) return;

    setPhotoUploading(true);
    setPhotoError("");

    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("folder", "hosts");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        setPhotoError(errData.error || "Upload failed");
        setPhotoUploading(false);
        return;
      }

      const { urls } = await uploadRes.json();
      const newPhotos = [...(myProfile.photos || []), ...urls];

      const patchRes = await fetch(`/api/hosts/${myProfile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: newPhotos }),
      });

      if (patchRes.ok) {
        const updated = await patchRes.json();
        setMyProfile(updated);
      }
    } catch {
      setPhotoError("Network error");
    } finally {
      setPhotoUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDashboardPhotoDelete = async (photoUrl: string) => {
    if (!myProfile) return;
    if (!confirm("Удалить это фото?")) return;

    const newPhotos = myProfile.photos.filter((p) => p !== photoUrl);
    const newCover = myProfile.coverPhoto === photoUrl ? (newPhotos[0] || "") : myProfile.coverPhoto;

    try {
      // Delete from Supabase Storage
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: photoUrl }),
      });

      const patchRes = await fetch(`/api/hosts/${myProfile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: newPhotos, coverPhoto: newCover }),
      });

      if (patchRes.ok) {
        const updated = await patchRes.json();
        setMyProfile(updated);
      }
    } catch {
      // ignore
    }
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
              {u.dashboard}
            </h1>
            <p className="text-gray-500">{user?.name} · {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition">
                <Shield size={14} /> {u.adminPanel}
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
            { icon: <Calendar size={20} />, value: pending, label: u.newRequests, color: "text-yellow-500" },
            { icon: <Users size={20} />, value: confirmed, label: u.confirmedLabel, color: "text-green-500" },
            { icon: <Star size={20} />, value: myBookings.length, label: u.totalBookings, color: "text-red-500" },
            { icon: <DollarSign size={20} />, value: `$${revenue}`, label: u.earnedLabel, color: "text-green-500" },
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
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
          {([
            { key: "bookings", label: u.bookingsTab },
            { key: "messages", label: `💬 ${u.messages}` },
            { key: "favorites", label: `❤️ ${u.favorites}` },
            { key: "profile", label: u.profileTab },
            ...(myProfile ? [{ key: "calendar" as const, label: u.calendarTab }] : []),
          ] as { key: "bookings" | "profile" | "calendar" | "messages" | "favorites"; label: string }[]).map(t => (
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
              <p className="font-semibold text-gray-900 text-sm">{u.earnWith}</p>
              <p className="text-xs text-gray-500">{u.inviteFriends}</p>
            </div>
            <Link href="/partner/register" className="px-5 py-2 rounded-full text-white text-sm font-semibold flex-shrink-0 hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {u.becomePartner}
            </Link>
          </div>
        )}
        {partnerCode && (
          <div className="mt-4 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => setShowInvite(!showInvite)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔗</span>
                <span className="font-semibold text-gray-900 text-sm">{u.inviteFriends}</span>
              </div>
              <span className={"text-gray-400 text-sm " + (showInvite ? "rotate-180" : "")}>▼</span>
            </button>
            {showInvite && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mt-3">
                  <code className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 truncate">https://hay-home.com/register?ref={partnerCode}</code>
                  <button onClick={() => { navigator.clipboard.writeText("https://hay-home.com/register?ref=" + partnerCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-2 rounded-lg text-sm font-medium transition" style={{ background: copied ? "#16a34a" : "#D4001A", color: "white" }}>
                    {copied ? "✓" : u.copyText}
                  </button>
                  <button onClick={() => { if (navigator.share) navigator.share({ title: "HayHome", url: "https://hay-home.com/register?ref=" + partnerCode }); else { navigator.clipboard.writeText("https://hay-home.com/register?ref=" + partnerCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } }} className="px-3 py-2 rounded-lg text-sm font-medium border transition hover:bg-gray-50" style={{ borderColor: "#D4001A", color: "#D4001A" }}>
                    <Share2 size={16} /> {u.shareText}
                  </button>
                </div>
                <div className="flex justify-center mt-3">
                  <QRCodeSVG value={"https://hay-home.com/register?ref=" + partnerCode} size={120} level="M" fgColor="#D4001A" bgColor="white" />
                </div>
              </div>
            )}
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
                <p className="text-gray-500 mb-4">{u.noBookings}</p>
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
                          b.status === "confirmed" ? "bg-green-100 text-green-700" :
                          b.status === "completed" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>{statusLabels[b.status]}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {b.hostName} · {b.checkIn} → {b.checkOut} · {b.guests} {u.guestsLabel} · <strong>${b.totalPrice}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.guestEmail} · {b.guestPhone}</p>
                      {b.message && <p className="text-xs text-gray-500 italic mt-1">"{b.message}"</p>}
                      {/* Service bookings for this booking */}
                      <ServiceBookingsList bookingId={b.id} lang={lang} />
                      {/* Route for confirmed/completed bookings */}
                      {(b.status === "confirmed" || b.status === "completed") && (
                        <DashRouteSection booking={b} lang={lang} />
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/hosts/${b.hostId}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                        {u.profileTab}
                      </Link>
                      {b.status === "completed" && (
                        <Link href={`/hosts/${b.hostId}#reviews`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition"
                          style={{ background: "#D4001A" }}>
                          {u.reviewBtn}
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
          <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{myProfile.familyName}</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-xl hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  <Edit2 size={14} /> {u.edit}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-50 transition">
                    <Save size={14} /> {saving ? "..." : u.save}
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
                  <p className="text-gray-400 text-xs mb-1">{u.statusLabel}</p>
                  <span className={`font-semibold ${myProfile.status === "active" ? "text-green-600" : myProfile.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>
                    {myProfile.status === "active" ? u.activeStatus : myProfile.status === "pending" ? u.pendingReviewStatus : u.suspendedStatus}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{tr.common.rating}</p>
                  <span className="font-semibold text-gray-900">⭐ {myProfile.rating || tr.common.newHost}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {u.descriptionLabel}
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
                    {u.phoneLabel}
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
                    {u.pricePerNight}
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

          {/* Photo Management Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📷 Управление фото</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Загрузить новые фото</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleDashboardPhotoUpload}
                className="hidden"
                id="dashboard-photo-input"
              />
              <button
                onClick={() => document.getElementById("dashboard-photo-input")?.click()}
                disabled={photoUploading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
              >
                <Camera size={16} /> {photoUploading ? "Загрузка..." : "Добавить фото"}
              </button>
              {photoError && <p className="text-red-500 text-xs mt-2">{photoError}</p>}
            </div>

            {myProfile.photos && myProfile.photos.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {myProfile.photos.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                    <img src={photo} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDashboardPhotoDelete(photo)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-110"
                    >
                      <Trash2 size={13} />
                    </button>
                    {photo === myProfile.coverPhoto && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">Обложка</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">Фото пока не загружены</p>
            )}
          </div>
          </div>
        )}
        {tab === "profile" && !myProfile && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {u.guestProfile}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {u.accountDetails}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{u.nameLabel}</p>
                  <span className="font-semibold text-gray-900">{user?.name}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <span className="font-semibold text-gray-900 text-xs break-all">{user?.email}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{u.roleLabel}</p>
                  <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-400 text-xs mb-1">{u.wantToHost}</p>
                  <Link href="/become-host" className="font-semibold text-sm" style={{ color: "#D4001A" }}>
                    {u.registerCta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Guest: My Bookings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-900">📅 Мои бронирования</h3>
              </div>
              {loading ? (
                <div className="p-10 text-center text-gray-400">{tr.common.loading}</div>
              ) : myBookings.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-500 mb-4">У вас пока нет бронирований</p>
                  <Link href="/hosts" className="inline-block px-5 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 transition" style={{ background: "#D4001A" }}>
                    Найти семью
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {myBookings.map((b) => (
                    <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-900">{b.hostName}</span>
                          <span className={`text-xs rounded-full px-2.5 py-0.5 font-semibold ${
                            b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            b.status === "confirmed" ? "bg-green-100 text-green-700" :
                            b.status === "completed" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-500"
                          }`}>{statusLabels[b.status]}</span>
                        </div>
                        <p className="text-sm text-gray-500">{b.checkIn} → {b.checkOut} · {b.guests} гостей</p>
                        {b.totalPrice > 0 && <p className="text-sm font-semibold text-gray-700 mt-0.5">${b.totalPrice}</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href={`/hosts/${b.hostId}`}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                          Профиль
                        </Link>
                        {b.status === "completed" && (
                          <Link href={`/hosts/${b.hostId}#reviews`}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition"
                            style={{ background: "#D4001A" }}>
                            Оставить отзыв
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guest: My Service Bookings */}
            <GuestServiceHistory lang={lang} tr={tr} />
          </div>
        )}

        {/* Messages tab */}
        {tab === "messages" && (
          <DashboardMessages
            lang={lang}
            onOpenChat={(userId: string) => { setChatWithUser(userId); setShowChatWidget(true); }}
          />
        )}

        {/* Favorites tab */}
        {tab === "favorites" && (
          <DashboardFavorites lang={lang} />
        )}

        {/* Calendar tab */}
        {tab === "calendar" && myProfile && (
          <CalendarTabContent hostId={myProfile.id} lang={lang} tr={tr} />
        )}
      </div>

      {/* Floating chat widget */}
      {showChatWidget && (
        <ChatWidget
          initialWithUserId={chatWithUser || undefined}
          openInitially
          onClose={() => { setShowChatWidget(false); setChatWithUser(null); }}
        />
      )}
    </div>
  );
}
function CalendarTabContent({ hostId, lang, tr }: { hostId: string; lang: string; tr: any }) {
  const h = tr.hosts;
  const u = getUI(lang as any);
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

  const monthNames = u.months;

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
          {u.clickToToggle}
        </p>
        <a href="/dashboard/calendar" className="text-xs font-medium" style={{ color: "#D4001A" }}>
          {u.openFullCalendar}
        </a>
      </div>
    </div>
  );
}

// ── Dashboard Route Section ──
function DashRouteSection({ booking, lang }: { booking: Booking; lang: string }) {
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [originLabel, setOriginLabel] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [geoWarn, setGeoWarn] = useState("");
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetch(`/api/hosts/${booking.hostId}`)
      .then(r => r.json())
      .then(h => {
        if (h && h.city) {
          setDestCoords(getCityCoords(h.city));
        }
      })
      .catch(() => {});
  }, [booking.hostId]);

  const dashLabel = (key: string): string => {
    const labels: Record<string, Record<string, string>> = {
      route: { ru: "Маршрут", en: "Route", hy: "Երթուղի", fr: "Itinéraire", de: "Route", es: "Ruta", it: "Percorso", ar: "الطريق", zh: "路线", fa: "مسیر" },
      showRoute: { ru: "Показать маршрут", en: "Show route", hy: "Ցույց տալ երթուղին", fr: "Voir l'itinéraire", de: "Route anzeigen", es: "Ver ruta", it: "Mostra percorso", ar: "إظهار الطريق", zh: "显示路线", fa: "نمایش مسیر" },
      geoWarn: { ru: "Разрешите доступ к геолокации", en: "Allow geolocation access", hy: "Թույլատրեք երկրաչափությունը", fr: "Autorisez la géolocalisation", de: "Geolokalisierung erlauben", es: "Permita geolocalización", it: "Consenti geolocalizzazione", ar: "اسمح بالموقع", zh: "允许地理定位", fa: "دسترسی به مکان را مجاز کنید" },
    };
    return labels[key]?.[lang] ?? labels[key]?.en ?? key;
  };

  const handleGeo = () => {
    if (!navigator.geolocation) {
      setGeoWarn(dashLabel("geoWarn"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOriginLabel("GPS");
        setShowMap(true);
        setGeoWarn("");
      },
      () => setGeoWarn(dashLabel("geoWarn")),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!destCoords) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <Navigation size={14} className="text-red-600" />
        <span className="text-xs font-semibold text-gray-700">{dashLabel("route")}</span>
        {!showMap && (
          <button onClick={handleGeo} className="text-xs text-amber-600 hover:underline ml-auto">
            {dashLabel("showRoute")}
          </button>
        )}
      </div>
      {geoWarn && <p className="text-xs text-orange-600 mb-1">⚠️ {geoWarn}</p>}
      {showMap && origin && (
        <>
          <RouteMap
            fromLat={origin.lat}
            fromLng={origin.lng}
            toLat={destCoords.lat}
            toLng={destCoords.lng}
            fromLabel={originLabel}
            toLabel={booking.hostName}
            height={200}
          />
          <div className="mt-2">
            <NavigatorLinks
              fromLat={origin.lat}
              fromLng={origin.lng}
              toLat={destCoords.lat}
              toLng={destCoords.lng}
              toName={booking.hostName}
              lang={lang}
            />
          </div>
        </>
      )}
      {showMap && !origin && (
        <p className="text-xs text-gray-400">{dashLabel("geoWarn")}</p>
      )}
    </div>
  );
}

// ── Service Bookings List (for dashboard) ──
import type { ServiceBooking } from "@/lib/types";

function ServiceBookingsList({ bookingId, lang }: { bookingId: string; lang: string }) {
  const u = getUI(lang as any);
  const [svcBookings, setSvcBookings] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/service-bookings", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        setSvcBookings(all.filter((s: any) => s.booking_id === bookingId));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [bookingId]);

  if (!loaded || svcBookings.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-gray-50">
      <p className="text-xs font-semibold text-gray-400 mb-1">
        {u.additionalServices}
      </p>
      {svcBookings.map((sb: any) => {
        const svcTitle = sb.service?.title || "Service";
        const svcCat = sb.service?.category || "custom";
        const catIcon: Record<string, string> = {
          photo: "📸", video: "🎥", music: "🎵", costume: "👗", decor: "🎨", dance: "💃", guide: "🗺️", chef: "👨‍🍳", custom: "✨",
        };
        return (
          <div key={sb.id} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
            <span>{catIcon[svcCat] || "✨"}</span>
            <span className="font-medium">{svcTitle}</span>
            {sb.time_of_day && (
              <span className="text-orange-600">
                {sb.time_of_day === "morning" ? "🌅" : sb.time_of_day === "evening" ? "🌙" : "🕐"}
                {sb.time_of_day === "custom" && sb.custom_time ? ` ${sb.custom_time}` : ""}
              </span>
            )}
            <span className="text-gray-400">— {sb.date} {sb.start_time}</span>
            <span className="font-semibold text-gray-700">${sb.total_price}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
              sb.status === "confirmed" ? "bg-green-100 text-green-700" :
              sb.status === "cancelled" ? "bg-red-100 text-red-600" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {sb.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Dashboard Messages Tab ──
function DashboardMessages({ lang, onOpenChat }: { lang: string; onOpenChat: (userId: string) => void }) {
  const u = getUI(lang as any);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chat/conversations", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setConversations(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">{u.loadingText}</div>;

  if (conversations.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="text-4xl mb-3">💬</div>
      <p className="text-gray-500">{u.noMessages}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-50">
        {conversations.map(conv => (
          <button
            key={conv.userId}
            onClick={() => onOpenChat(conv.userId)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition text-left"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {conv.userName?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-gray-900 text-sm">{conv.userName}</span>
                <span className="text-xs text-gray-400">{new Date(conv.lastAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 truncate">{conv.lastMessage}</span>
                {conv.unread > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ml-2">{conv.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Guest Service History ──
function GuestServiceHistory({ lang, tr }: { lang: string; tr: any }) {
  const u = getUI(lang as any);
  const [svcBookings, setSvcBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/service-bookings", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setSvcBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const STATUS_BADGE: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-500",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">✨ Мои бронирования услуг</h3>
      </div>
      {loading ? (
        <div className="p-10 text-center text-gray-400">{tr.common.loading}</div>
      ) : svcBookings.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-4xl mb-3">🎭</div>
          <p className="text-gray-500 mb-4">У вас пока нет заказанных услуг</p>
          <Link href="/hosts" className="inline-block px-5 py-2 rounded-full text-white text-sm font-semibold hover:opacity-90 transition" style={{ background: "#D4001A" }}>
            Найти семью
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {svcBookings.map((sb: any) => {
            const catIcon: Record<string, string> = {
              photo: "📸", video: "🎥", music: "🎵", costume: "👗", decor: "🎨", dance: "💃", guide: "🗺️", chef: "👨‍🍳", custom: "✨",
            };
            const cat = sb.service?.category || "custom";
            return (
              <div key={sb.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-lg">{catIcon[cat] || "✨"}</span>
                    <span className="font-semibold text-gray-900">{sb.service?.title || "Услуга"}</span>
                    <span className={`text-xs rounded-full px-2.5 py-0.5 font-semibold ${STATUS_BADGE[sb.status] || "bg-gray-100 text-gray-500"}`}>{sb.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">{sb.date}{sb.start_time ? ` · ${sb.start_time}` : ""}</p>
                  {sb.total_price > 0 && <p className="text-sm font-semibold text-gray-700 mt-0.5">${sb.total_price}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Dashboard Favorites Tab ──
function DashboardFavorites({ lang }: { lang: string }) {
  const u = getUI(lang as any);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/favorites", { credentials: "include" }).then(r => r.ok ? r.json() : []),
      fetch("/api/hosts", { credentials: "include" }).then(r => r.ok ? r.json() : []),
    ]).then(([favs, allHosts]) => {
      setFavorites(Array.isArray(favs) ? favs : []);
      setHosts(Array.isArray(allHosts) ? allHosts : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadFavorites(); }, []);

  const removeFavorite = async (hostId: string) => {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ host_id: hostId }),
    });
    loadFavorites();
  };

  if (loading) return <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">{u.loadingText}</div>;

  const favHosts = favorites.map(f => hosts.find(h => h.id === f.host_id)).filter(Boolean) as Host[];

  if (favHosts.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="text-4xl mb-3">❤️</div>
      <p className="text-gray-500 mb-4">{u.noFavorites}</p>
      <Link href="/hosts" className="text-sm font-semibold" style={{ color: "#D4001A" }}>→</Link>
    </div>
  );

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">{u.favorites}: <strong className="text-gray-900">{favHosts.length}</strong></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favHosts.map(host => (
          <div key={host.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative">
            <button
              onClick={() => removeFavorite(host.id)}
              className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-red-50 transition"
            >
              <Heart size={16} className="fill-red-500 text-red-500" />
            </button>
            <Link href={`/hosts/${host.id}`}>
              {host.coverPhoto && (
                <img src={host.coverPhoto} alt={host.familyName} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{host.familyName}</h3>
                <p className="text-xs text-gray-500 mb-2">{host.city}, {host.region}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">${host.pricePerNight}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} fill="#F2A900" color="#F2A900" />
                    {host.rating > 0 ? host.rating.toFixed(1) : "New"}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
