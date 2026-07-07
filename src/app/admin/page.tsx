"use client";
import { useState, useEffect } from "react";
import { Host, Booking } from "@/lib/types";
import { Check, X, Star, Users, DollarSign, Home, RefreshCw } from "lucide-react";
import AdminCalendarView from "@/components/AdminCalendarView";
import AdminContracts from "./contracts/page";
import AdminFinance from "./AdminFinance";
import AdminLogs from "./AdminLogs";
import AdminReviews from "./AdminReviews";
import AdminSettings from "./AdminSettings";
import AdminNotifications from "./AdminNotifications";
import AdminGuestRequests from "./AdminGuestRequests";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import type { LangCode } from "@/lib/translations";

type Tab = "hosts" | "bookings" | "stats" | "payouts" | "calendar" | "users" | "services" | "promocodes" | "contracts" | "finance" | "logs" | "reviews" | "settings" | "notifications" | "guest-requests";

// Full 10-language status labels
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

const HOST_STATUS_LABELS: Record<string, Record<string, string>> = {
  ru: { active: "Активен", pending: "На проверке", suspended: "Приостановлен" },
  en: { active: "Active", pending: "Pending", suspended: "Suspended" },
  hy: { active: "Ակտիվ", pending: "Ստուգման տակ", suspended: "Կասեցված" },
  fr: { active: "Actif", pending: "En attente", suspended: "Suspendu" },
  de: { active: "Aktiv", pending: "Ausstehend", suspended: "Gesperrt" },
  es: { active: "Activo", pending: "Pendiente", suspended: "Suspendido" },
  it: { active: "Attivo", pending: "In attesa", suspended: "Sospeso" },
  ar: { active: "نشط", pending: "قيد المراجعة", suspended: "معلق" },
  zh: { active: "活跃", pending: "待审核", suspended: "已暂停" },
  fa: { active: "فعال", pending: "در حال بررسی", suspended: "معلق" },
};

const PAYOUT_STATUS_LABELS: Record<string, Record<string, string>> = {
  ru: { pending: "Ожидает", confirmed: "Выплачен", rejected: "Отклонён" },
  en: { pending: "Pending", confirmed: "Paid", rejected: "Rejected" },
  hy: { pending: "Սպասում", confirmed: "Վճարված", rejected: "Մերժված" },
  fr: { pending: "En attente", confirmed: "Payé", rejected: "Rejeté" },
  de: { pending: "Ausstehend", confirmed: "Bezahlt", rejected: "Abgelehnt" },
  es: { pending: "Pendiente", confirmed: "Pagado", rejected: "Rechazado" },
  it: { pending: "In attesa", confirmed: "Pagato", rejected: "Rifiutato" },
  ar: { pending: "قيد الانتظار", confirmed: "مدفوع", rejected: "مرفوض" },
  zh: { pending: "待处理", confirmed: "已支付", rejected: "已拒绝" },
  fa: { pending: "در انتظار", confirmed: "پرداخت شده", rejected: "رد شده" },
};

const ACTION_LABELS: Record<string, Record<string, string>> = {
  ru: { submitted: "Заявка подана", approved: "Одобрена", rejected: "Отклонена", suspended: "Приостановлена", restored: "Восстановлена", note_added: "Заметка" },
  en: { submitted: "Application submitted", approved: "Approved", rejected: "Rejected", suspended: "Suspended", restored: "Restored", note_added: "Note" },
  hy: { submitted: "Հայտը ներկայացված է", approved: "Հաստատված", rejected: "Մերժված", suspended: "Կասեցված", restored: "Վերականգնված", note_added: "Նշում" },
  fr: { submitted: "Candidature soumise", approved: "Approuvée", rejected: "Rejetée", suspended: "Suspendue", restored: "Restaurée", note_added: "Note" },
  de: { submitted: "Antrag eingereicht", approved: "Genehmigt", rejected: "Abgelehnt", suspended: "Gesperrt", restored: "Wiederhergestellt", note_added: "Notiz" },
  es: { submitted: "Solicitud enviada", approved: "Aprobada", rejected: "Rechazada", suspended: "Suspendida", restored: "Restaurada", note_added: "Nota" },
  it: { submitted: "Domanda inviata", approved: "Approvata", rejected: "Rifiutata", suspended: "Sospesa", restored: "Ripristinata", note_added: "Nota" },
  ar: { submitted: "تم تقديم الطلب", approved: "موافق عليه", rejected: "مرفوض", suspended: "معلق", restored: "مستعاد", note_added: "ملاحظة" },
  zh: { submitted: "申请已提交", approved: "已批准", rejected: "已拒绝", suspended: "已暂停", restored: "已恢复", note_added: "备注" },
  fa: { submitted: "درخواست ارسال شد", approved: "تأیید شده", rejected: "رد شده", suspended: "معلق", restored: "بازگردانی شده", note_added: "یادداشت" },
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("hosts");
  const [hosts, setHosts] = useState<Host[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userFilter, setUserFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const filteredUsers = users.filter((u: any) => {
    if (userFilter !== "all" && u.role !== userFilter) return false;
    if (userSearch) {
      const q = userSearch.toLowerCase();
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    }
    return true;
  });
  const [calHostId, setCalHostId] = useState("");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Promocodes state
  const [promocodes, setPromocodes] = useState<any[]>([]);
  const [promoForm, setPromoForm] = useState({ code: "", discount_type: "percent", discount_value: 10, min_amount: 0, max_uses: 100, expires_at: "" });
  const [promoLoading, setPromoLoading] = useState(false);

  // New tabs state
  const [reviews, setReviews] = useState<any[]>([]);
  const [hostHistory, setHostHistory] = useState<any[]>([]);
  const [guestRequests, setGuestRequests] = useState<any[]>([]);
  const [platformSettings, setPlatformSettings] = useState({ commissionPercent: 16, iban: "", bankName: "", legalName: "HayHome LLC", legalAddress: "", supportPhone: "", supportEmail: "info@hay-home.com" });

  const { lang } = useLang();
  const u = getUI(lang);

  const a = () => ""; // deprecated — do not use, kept for type compat only

  const load = async () => {
    setLoading(true);
    const [h, b, p, usr, promos, rev, gr] = await Promise.all([
      fetch("/api/hosts?all=1", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/partners/payout/", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/auth/users", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/promocodes", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/reviews", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/requests", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]);
    setHosts(h);
    setBookings(b);
    setPayouts(Array.isArray(p) ? p : []);
    setUsers(Array.isArray(usr) ? usr : []);
    setPromocodes(Array.isArray(promos) ? promos : []);
    setReviews(Array.isArray(rev) ? rev : []);
    setGuestRequests(Array.isArray(gr) ? gr : []);
    // Load host history
    try {
      const histPromises = h.filter((host: any) => host.status === "active" || host.status === "pending").map((host: any) =>
        fetch(`/api/hosts/${host.id}/notes`, { credentials: "include" }).then(r => r.json()).catch(() => [])
      );
      const histResults = await Promise.all(histPromises);
      setHostHistory(histResults.flat());
    } catch { setHostHistory([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateHost = async (id: string, updates: Partial<Host>) => {
    setUpdating(id);
    await fetch(`/api/hosts/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await load();
    setUpdating(null);
  };

  const logAction = async (hostId: string, action: string, note?: string) => {
    try {
      await fetch(`/api/hosts/${hostId}/notes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note }),
      });
    } catch (e) {
      console.error("[Admin] Failed to log action:", e);
    }
  };

  const updateBooking = async (id: string, status: Booking["status"]) => {
    setUpdating(id);
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  };

  const pendingHosts = hosts.filter((h) => h.status === "pending");
  const activeHosts = hosts.filter((h) => h.status === "active");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.totalPrice, 0);

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: "hosts", label: u.hostsTab, badge: pendingHosts.length },
    { key: "bookings", label: u.bookingsTab, badge: pendingBookings.length },
    { key: "payouts", label: u.payoutsTab, badge: payouts.filter(p => p.status === "pending").length || undefined },
    { key: "stats", label: u.statisticsTab },
    { key: "calendar", label: u.calendarTabAdmin },
    { key: "users", label: u.usersTab, badge: users.length || undefined },
    { key: "services", label: u.servicesTab },
    { key: "promocodes", label: u.promocodesTab },
    { key: "contracts", label: "📄 Договоры" },
    { key: "finance", label: "💰 Финансы" },
    { key: "logs", label: "📋 Логи" },
    { key: "reviews", label: "⭐ Отзывы" },
    { key: "settings", label: "⚙️ Настройки" },
    { key: "notifications", label: "✉️ Уведом." },
    { key: "guest-requests", label: "📨 Запросы", badge: guestRequests.filter((r: any) => r.status === "pending").length || undefined },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{u.adminPanel}</h1>
            <p className="text-sm text-gray-500">HayHome · {u.platformManagement}</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">
            <RefreshCw size={14} /> {u.refreshBtn}
          </button>
        </div>

        {/* Stats bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Home size={18} />, value: activeHosts.length, label: u.activeFamilies, color: "text-amber-600" },
              { icon: <Star size={18} />, value: pendingHosts.length, label: u.pendingReviewAdmin, color: "text-yellow-600" },
              { icon: <Users size={18} />, value: bookings.length, label: u.bookingsTab, color: "text-green-600" },
              { icon: <DollarSign size={18} />, value: `$${totalRevenue}`, label: u.revenue, color: "text-red-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                <div className={`${stat.color} flex-shrink-0`}>{stat.icon}</div>
                <div>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? "border-red-500 text-red-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
              {t.label}
              {t.badge ? (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-5 text-center">{t.badge}</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">{u.loadingText}</div>
        ) : (
          <>
            {/* Hosts tab */}
            {tab === "hosts" && (
              <div className="space-y-4">
                {pendingHosts.length === 0 && activeHosts.length === 0 && hosts.filter(h => h.status === "suspended").length === 0 && (
                  <div className="text-center py-20 text-gray-400">{u.noHosts}</div>
                )}
                {pendingHosts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" /> {u.pendingReviewAdmin} ({pendingHosts.length})
                    </h2>
                    <div className="space-y-3">
                      {pendingHosts.map((host) => (
                        <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} onLogAction={logAction} lang={lang} />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full" /> {u.activeFamilies} ({activeHosts.length})
                  </h2>
                  <div className="space-y-3">
                    {activeHosts.map((host) => (
                      <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} onLogAction={logAction} lang={lang} />
                    ))}
                  </div>
                </div>
                {hosts.filter(h => h.status === "suspended").map((host) => (
                  <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} onLogAction={logAction} lang={lang} />
                ))}
              </div>
            )}

            {/* Bookings tab */}
            {tab === "bookings" && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">{u.noBookingsAdmin}</div>
                ) : bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{booking.guestName}</span>
                          <span className="text-gray-400 text-sm">· {booking.guestCountry}</span>
                          <StatusBadge status={booking.status} lang={lang} />
                        </div>
                        <p className="text-sm text-gray-600">
                          {booking.hostName} · {booking.checkIn} → {booking.checkOut}
                          · {booking.guests} {u.guestsLabel} · <strong>${booking.totalPrice}</strong>
                        </p>
                        {booking.message && (
                          <p className="text-xs text-gray-400 mt-1 italic">"{booking.message}"</p>
                        )}
                      </div>
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateBooking(booking.id, "confirmed")} disabled={updating === booking.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">
                            <Check size={12} /> {u.confirmAction}
                          </button>
                          <button onClick={() => updateBooking(booking.id, "cancelled")} disabled={updating === booking.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
                            <X size={12} /> {u.reject}
                          </button>
                        </div>
                      )}
                      {booking.status === "confirmed" && (
                        <button onClick={() => updateBooking(booking.id, "completed")} disabled={updating === booking.id}
                          className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50">
                          ✓ {u.completeBtn}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payouts tab */}
            {tab === "payouts" && (
              <div className="space-y-4">
                {payouts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">{u.noPayoutRequests}</div>
                ) : (
                  payouts.map((p: any) => {
                    const partner = p.hayhome_partners;
                    const methodLabels: Record<string, string> = { idram: u.idram, bank_transfer: u.bankTransfer, crypto: u.crypto };
                    return (
                      <div key={p.id} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-gray-900">${p.amount}</span>
                              <span className="text-gray-400 text-sm">· {partner?.name || "?"} ({partner?.code || "?"})</span>
                              <PayoutBadge status={p.status} lang={lang} />
                            </div>
                            <p className="text-xs text-gray-500">
                              {methodLabels[p.method] || p.method} · {p.details}
                              {partner?.email && <> · {partner.email}</>}
                            </p>
                            {p.created_at && <p className="text-xs text-gray-400 mt-1">{p.created_at.slice(0, 16)}</p>}
                          </div>
                          {p.status === "pending" && (
                            <div className="flex gap-2">
                              <button onClick={async () => {
                                setPayoutLoading(true);
                                await fetch("/api/partners/payout/", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payoutId: p.id, decision: "confirmed" }) });
                                await load(); setPayoutLoading(false);
                              }} disabled={payoutLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">
                                <Check size={12} /> {u.pay}
                              </button>
                              <button onClick={async () => {
                                const reason = prompt(u.rejectionReason);
                                if (reason === null) return;
                                setPayoutLoading(true);
                                await fetch("/api/partners/payout/", { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payoutId: p.id, decision: "rejected", reason }) });
                                await load(); setPayoutLoading(false);
                              }} disabled={payoutLoading}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
                                <X size={12} /> {u.reject}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Users tab */}
            {tab === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex gap-2 flex-wrap">
                    <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
                      <option value="all">{u.allText} ({users.length})</option>
                      <option value="guest">{u.guestsLabel} ({users.filter(usr => usr.role === "guest").length})</option>
                      <option value="host">{u.hostsTab} ({users.filter(usr => usr.role === "host").length})</option>
                      <option value="admin">Admin ({users.filter(usr => usr.role === "admin").length})</option>
                    </select>
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder={u.searchByName}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none flex-1 min-w-0" />
                  </div>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">{u.noUsers}</div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <div className="overflow-x-auto"><table className="w-full text-sm">
                        <thead><tr className="bg-gray-50 text-left">
                          <th className="px-4 py-3 font-medium text-gray-600">{u.nameLabel}</th>
                          <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                          <th className="px-4 py-3 font-medium text-gray-600">{u.roleLabel}</th>
                          <th className="px-4 py-3 font-medium text-gray-600">{u.referral}</th>
                          <th className="px-4 py-3 font-medium text-gray-600">{u.dateLabel}</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredUsers.map((usr: any) => (
                            <tr key={usr.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{usr.name}</td>
                              <td className="px-4 py-3 text-gray-500">{usr.email}</td>
                              <td className="px-4 py-3"><span className={"text-xs rounded-full px-2 py-0.5 font-medium " + (usr.role === "admin" ? "bg-red-100 text-red-700" : usr.role === "host" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600")}>{usr.role}</span></td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{usr.referred_by_code || "—"}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{usr.created_at?.slice(0, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats tab */}
            {tab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{u.familiesByRegion}</h3>
                  {Object.entries(
                    hosts.reduce((acc: Record<string, number>, h) => {
                      acc[h.region] = (acc[h.region] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([region, count]) => (
                    <div key={region} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-700">{region}</span>
                      <span className="font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{u.bookingsByStatus}</h3>
                  {(["pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
                    <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <StatusBadge status={status} lang={lang} />
                      <span className="font-bold text-gray-900">{bookings.filter(b => b.status === status).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar tab */}
            {tab === "calendar" && calHostId && (
              <AdminCalendarView
                hosts={hosts.filter((h) => h.status === "active")}
                calHostId={calHostId}
                setCalHostId={setCalHostId}
                calYear={calYear}
                setCalYear={setCalYear}
                calMonth={calMonth}
                setCalMonth={setCalMonth}
                bookings={bookings}
                lang={lang}
                a={a}
              />
            )}

            {/* Services tab */}
            {tab === "services" && (
              <AdminServicesTab lang={lang} />
            )}

            {/* Promocodes tab */}
            {tab === "contracts" && <AdminContracts />}
            {tab === "promocodes" && (
              <div className="space-y-4">
                {/* Create form */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">{u.createPromocode}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.promocodeCode}</label>
                      <input
                        type="text"
                        value={promoForm.code}
                        onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                        placeholder="SUMMER2025"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.discountType}</label>
                      <select
                        value={promoForm.discount_type}
                        onChange={(e) => setPromoForm({ ...promoForm, discount_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none bg-white"
                      >
                        <option value="percent">%</option>
                        <option value="fixed">$</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.discountValue}</label>
                      <input
                        type="number"
                        value={promoForm.discount_value}
                        onChange={(e) => setPromoForm({ ...promoForm, discount_value: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.minAmount} ($)</label>
                      <input
                        type="number"
                        value={promoForm.min_amount}
                        onChange={(e) => setPromoForm({ ...promoForm, min_amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.maxUses}</label>
                      <input
                        type="number"
                        value={promoForm.max_uses}
                        onChange={(e) => setPromoForm({ ...promoForm, max_uses: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{u.expiresAt}</label>
                      <input
                        type="date"
                        value={promoForm.expires_at}
                        onChange={(e) => setPromoForm({ ...promoForm, expires_at: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!promoForm.code.trim()) return;
                      setPromoLoading(true);
                      const res = await fetch("/api/promocodes", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          code: promoForm.code,
                          discount_type: promoForm.discount_type,
                          discount_value: promoForm.discount_value,
                          min_amount: promoForm.min_amount,
                          max_uses: promoForm.max_uses,
                          expires_at: promoForm.expires_at || null,
                        }),
                      });
                      if (res.ok) {
                        setPromoForm({ code: "", discount_type: "percent", discount_value: 10, min_amount: 0, max_uses: 100, expires_at: "" });
                        load();
                      }
                      setPromoLoading(false);
                    }}
                    disabled={promoLoading || !promoForm.code.trim()}
                    className="mt-3 px-5 py-2.5 rounded-full text-white font-semibold text-sm disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                  >
                    {promoLoading ? "..." : u.createPromocode}
                  </button>
                </div>

                {/* List */}
                {promocodes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">{u.noPromocodes}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="overflow-x-auto"><table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                          <th className="text-left py-2 px-3">{u.promocodeCode}</th>
                          <th className="text-left py-2 px-3">{u.discountType}</th>
                          <th className="text-left py-2 px-3">{u.discountValue}</th>
                          <th className="text-left py-2 px-3">{u.minAmount}</th>
                          <th className="text-left py-2 px-3">{u.usedCount}</th>
                          <th className="text-left py-2 px-3">{u.expiresAt}</th>
                          <th className="text-left py-2 px-3">{u.statusLabel}</th>
                          <th className="text-left py-2 px-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {promocodes.map((p) => (
                          <tr key={p.id} className="border-b border-gray-100">
                            <td className="py-2 px-3 font-mono font-bold text-gray-900">{p.code}</td>
                            <td className="py-2 px-3">{p.discount_type}</td>
                            <td className="py-2 px-3">{p.discount_type === "percent" ? `${p.discount_value}%` : `$${p.discount_value}`}</td>
                            <td className="py-2 px-3">${p.min_amount || 0}</td>
                            <td className="py-2 px-3">{p.used_count}{p.max_uses ? `/${p.max_uses}` : ""}</td>
                            <td className="py-2 px-3">{p.expires_at ? new Date(p.expires_at).toLocaleDateString() : "—"}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                {p.active ? u.activeStatus : u.cancelledStatus}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              {p.active && (
                                <button
                                  onClick={async () => {
                                    await fetch(`/api/promocodes?id=${p.id}`, {
                                      method: "DELETE",
                                      credentials: "include",
                                    });
                                    load();
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  {u.deleteText}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  </div>
                )}
              </div>
            )}
            {/* ── Extra tabs ── */}
            {tab === "finance" && <AdminFinance bookings={bookings} commission={platformSettings.commissionPercent} />}
            {tab === "logs" && <AdminLogs history={hostHistory} />}
            {tab === "reviews" && <AdminReviews reviews={reviews} onDelete={async (id) => { await fetch("/api/reviews", { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }} />}
            {tab === "settings" && <AdminSettings settings={platformSettings} onChange={setPlatformSettings} />}
            {tab === "notifications" && <AdminNotifications hosts={hosts} users={users} />}
            {tab === "guest-requests" && <AdminGuestRequests requests={guestRequests} />}
          </>
        )}
      </div>
    </div>
  );
}

function HostRow({ host, updating, onUpdate, onLogAction, lang }: {
  host: Host;
  updating: string | null;
  onUpdate: (id: string, updates: Partial<Host>) => void;
  onLogAction: (id: string, action: string, note?: string) => void;
  lang: LangCode;
}) {
  const u = getUI(lang);
  const [note, setNote] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [savingNote, setSavingNote] = useState(false);

  const loadHistory = async () => {
    const res = await fetch(`/api/hosts/${host.id}/notes`);
    setHistory(await res.json());
    setShowHistory(true);
  };

  const saveNote = async () => {
    if (!note.trim()) return;
    setSavingNote(true);
    await onLogAction(host.id, "note_added", note);
    setNote("");
    if (showHistory) loadHistory();
    setSavingNote(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-gray-900">{host.familyName}</span>
            <span className="text-gray-400 text-sm">· {host.city}, {host.region}</span>
            {host.verified && <span className="text-xs text-green-600 font-medium">✓ {getUI(lang).activeStatus}</span>}
            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
              host.status === "active" ? "bg-green-100 text-green-700" :
              host.status === "pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>{HOST_STATUS_LABELS[host.status]?.[lang] || HOST_STATUS_LABELS[host.status]?.en || host.status}</span>
          </div>
          <p className="text-sm text-gray-600">{host.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {host.phone} · {host.email} · {"★".repeat(host.stars)} · ${host.pricePerNight}{"/night"}
          </p>
          {host.admin_notes && (
            <p className="text-xs text-amber-600 mt-1 bg-amber-50 rounded px-2 py-1">📝 {host.admin_notes}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {host.status === "pending" && (
            <>
              <button onClick={() => { onUpdate(host.id, { status: "active", verified: true }); onLogAction(host.id, "approved"); }} disabled={updating === host.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">
                <Check size={12} /> {u.approve}
              </button>
              <button onClick={() => { onUpdate(host.id, { status: "suspended" }); onLogAction(host.id, "rejected"); }} disabled={updating === host.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
                <X size={12} /> {u.reject}
              </button>
            </>
          )}
          {host.status === "active" && (
            <>
              <div className="flex items-center gap-1">
                <select defaultValue={host.stars}
                  onChange={(e) => onUpdate(host.id, { stars: Number(e.target.value) as Host["stars"] })}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none">
                  {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{"★".repeat(s)}</option>)}
                </select>
              </div>
              <button onClick={() => { onUpdate(host.id, { status: "suspended" }); onLogAction(host.id, "suspended"); }} disabled={updating === host.id}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50">
                {u.suspend}
              </button>
            </>
          )}
          {host.status === "suspended" && (
            <button onClick={() => { onUpdate(host.id, { status: "active" }); onLogAction(host.id, "restored"); }} disabled={updating === host.id}
              className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50">
              {u.restore}
            </button>
          )}
        </div>
      </div>
      {/* Note + History */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveNote()}
            placeholder={u.addNote}
            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-red-400" />
          <button onClick={saveNote} disabled={savingNote || !note.trim()}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 disabled:opacity-50">
            {savingNote ? "..." : u.save}
          </button>
          <button onClick={loadHistory}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">
            {u.history}
          </button>
        </div>
        {showHistory && (
          <div className="mt-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400">{u.noRecords}</p>
            ) : (
              history.map((h: any) => (
                <div key={h.id} className="text-xs text-gray-500 py-1 border-b border-gray-50">
                  <span className="text-gray-400">{h.created_at?.slice(0, 16)}</span>{" "}
                  <span className="font-medium text-gray-700">{ACTION_LABELS[h.action]?.[lang] || ACTION_LABELS[h.action]?.en || h.action}</span>
                  {h.note && <span className="text-gray-500"> — {h.note}</span>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, lang }: { status: Booking["status"]; lang: string }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels = STATUS_LABELS;
  return <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${map[status]}`}>{labels[status]?.[lang] || labels[status]?.en || status}</span>;
}

function PayoutBadge({ status, lang }: { status: string; lang: string }) {
  const map: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  const labels = PAYOUT_STATUS_LABELS;
  return <span className={"text-xs rounded-full px-2 py-0.5 font-medium " + (map[status] || "")}>{labels[status]?.[lang] || labels[status]?.en || status}</span>;
}

// ── Admin Services Tab ──
function AdminServicesTab({ lang }: { lang: LangCode }) {
  const u = getUI(lang);
  const [services, setServices] = useState<any[]>([]);
  const [svcBookings, setSvcBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [svcRes, ordRes] = await Promise.all([
      fetch("/api/services?provider=all", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/service-bookings", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]);
    setServices(Array.isArray(svcRes) ? svcRes : []);
    setSvcBookings(Array.isArray(ordRes) ? ordRes : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const catIcons: Record<string, string> = {
    photo: "📸", video: "🎥", music: "🎵", costume: "👗", decor: "🎨", dance: "💃", guide: "🗺️", chef: "👨‍🍳", custom: "✨",
  };

  if (loading) return <div className="text-center py-12 text-gray-400">{u.loadingText}</div>;

  return (
    <div className="space-y-6">
      {/* All services */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">{u.allServices} ({services.length})</h2>
        {services.length === 0 ? (
          <p className="text-gray-400 text-sm">{u.noServicesAdmin}</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">{u.serviceName}</th>
                  <th className="text-left px-4 py-3">{u.categoryLabel}</th>
                  <th className="text-left px-4 py-3">{u.selectRegion}</th>
                  <th className="text-left px-4 py-3">{u.priceLabel}</th>
                  <th className="text-left px-4 py-3">{u.serviceStatusLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((svc: any) => (
                  <tr key={svc.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{svc.title}</td>
                    <td className="px-4 py-3">{catIcons[svc.category] || "✨"} {svc.category}</td>
                    <td className="px-4 py-3 text-gray-600">{svc.region}</td>
                    <td className="px-4 py-3 font-semibold">${svc.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${svc.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {svc.available ? u.activeStatus : u.hiddenStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>

      {/* Service bookings */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">{u.serviceOrders} ({svcBookings.length})</h2>
        {svcBookings.length === 0 ? (
          <p className="text-gray-400 text-sm">{u.noOrdersAdmin}</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">{u.serviceName}</th>
                  <th className="text-left px-4 py-3">{u.dateLabel}</th>
                  <th className="text-left px-4 py-3">{u.timeOfDay}</th>
                  <th className="text-left px-4 py-3">{u.priceLabel}</th>
                  <th className="text-left px-4 py-3">{u.serviceStatusLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {svcBookings.map((sb: any) => (
                  <tr key={sb.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{sb.service?.title || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{sb.date}</td>
                    <td className="px-4 py-3 text-gray-600">{sb.start_time}–{sb.end_time}</td>
                    <td className="px-4 py-3 font-semibold">${sb.total_price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sb.status === "confirmed" ? "bg-green-100 text-green-700" :
                        sb.status === "cancelled" ? "bg-red-100 text-red-600" :
                        sb.status === "completed" ? "bg-green-100 text-green-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{sb.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>
    </div>
  );
}
