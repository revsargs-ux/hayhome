"use client";
import { useState, useEffect } from "react";
import { Host, Booking } from "@/lib/types";
import { Check, X, Star, Users, DollarSign, Home, RefreshCw } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

type Tab = "hosts" | "bookings" | "stats";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("hosts");
  const [hosts, setHosts] = useState<Host[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const { lang } = useLang();

  const a = (ru: string, en: string) => lang === "ru" ? ru : en;

  const load = async () => {
    setLoading(true);
    const [h, b] = await Promise.all([
      fetch("/api/hosts?all=1", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/bookings", { credentials: "include" }).then((r) => r.json()),
    ]);
    setHosts(h);
    setBookings(b);
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
    { key: "hosts", label: a("Хозяева", "Hosts"), badge: pendingHosts.length },
    { key: "bookings", label: a("Бронирования", "Bookings"), badge: pendingBookings.length },
    { key: "stats", label: a("Статистика", "Statistics") },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{a("Панель администратора", "Admin Panel")}</h1>
            <p className="text-sm text-gray-500">HayHome · {a("Управление платформой", "Platform Management")}</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm">
            <RefreshCw size={14} /> Обновить
          </button>
        </div>

        {/* Stats bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Home size={18} />, value: activeHosts.length, label: a("Активных семей", "Active families"), color: "text-blue-600" },
              { icon: <Star size={18} />, value: pendingHosts.length, label: a("На проверке", "Pending review"), color: "text-yellow-600" },
              { icon: <Users size={18} />, value: bookings.length, label: a("Бронирований", "Bookings"), color: "text-green-600" },
              { icon: <DollarSign size={18} />, value: `$${totalRevenue}`, label: a("Выручка (завершённые)", "Revenue (completed)"), color: "text-red-600" },
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
          <div className="text-center py-20 text-gray-400">{a("Загрузка...", "Loading...")}</div>
        ) : (
          <>
            {/* Hosts tab */}
            {tab === "hosts" && (
              <div className="space-y-4">
                {pendingHosts.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full" /> a("На проверке", "Pending") ({pendingHosts.length})
                    </h2>
                    <div className="space-y-3">
                      {pendingHosts.map((host) => (
                        <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} />
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full" /> a("Активные семьи", "Active families") ({activeHosts.length})
                  </h2>
                  <div className="space-y-3">
                    {activeHosts.map((host) => (
                      <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} />
                    ))}
                  </div>
                </div>
                {hosts.filter(h => h.status === "suspended").map((host) => (
                  <HostRow key={host.id} host={host} updating={updating} onUpdate={updateHost} />
                ))}
              </div>
            )}

            {/* Bookings tab */}
            {tab === "bookings" && (
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">{a("Нет бронирований", "No bookings")}</div>
                ) : bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{booking.guestName}</span>
                          <span className="text-gray-400 text-sm">· {booking.guestCountry}</span>
                          <StatusBadge status={booking.status} />
                        </div>
                        <p className="text-sm text-gray-600">
                          {booking.hostName} · {booking.checkIn} → {booking.checkOut}
                          · {booking.guests} {a("гост.", "guests")} · <strong>${booking.totalPrice}</strong>
                        </p>
                        {booking.message && (
                          <p className="text-xs text-gray-400 mt-1 italic">"{booking.message}"</p>
                        )}
                      </div>
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateBooking(booking.id, "confirmed")} disabled={updating === booking.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">
                            <Check size={12} /> {a("Подтвердить", "Confirm")}
                          </button>
                          <button onClick={() => updateBooking(booking.id, "cancelled")} disabled={updating === booking.id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
                            <X size={12} /> {a("Отклонить", "Reject")}
                          </button>
                        </div>
                      )}
                      {booking.status === "confirmed" && (
                        <button onClick={() => updateBooking(booking.id, "completed")} disabled={updating === booking.id}
                          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50">
                          ✓ {a("Завершить", "Complete")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats tab */}
            {tab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Семьи по регионам</h3>
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
                  <h3 className="font-bold text-gray-900 mb-4">Бронирования по статусу</h3>
                  {(["pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
                    <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <StatusBadge status={status} />
                      <span className="font-bold text-gray-900">{bookings.filter(b => b.status === status).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function HostRow({ host, updating, onUpdate }: {
  host: Host;
  updating: string | null;
  onUpdate: (id: string, updates: Partial<Host>) => void;
}) {
  const { lang } = useLang();
  const a = (ru: string, en: string) => lang === "ru" ? ru : en;
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-gray-900">{host.familyName}</span>
            <span className="text-gray-400 text-sm">· {host.city}, {host.region}</span>
            {host.verified && <span className="text-xs text-green-600 font-medium">✓ {a("Верифицировано", "Verified")}</span>}
            <StatusBadgeHost status={host.status} />
          </div>
          <p className="text-sm text-gray-600">{host.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {host.phone} · {host.email} · {"★".repeat(host.stars)} · ${host.pricePerNight}/ночь
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {host.status === "pending" && (
            <>
              <button onClick={() => onUpdate(host.id, { status: "active", verified: true })} disabled={updating === host.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg font-medium hover:bg-green-600 disabled:opacity-50">
                <Check size={12} /> {a("Одобрить", "Approve")}
              </button>
              <button onClick={() => onUpdate(host.id, { status: "suspended" })} disabled={updating === host.id}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600 disabled:opacity-50">
                <X size={12} /> {a("Отклонить", "Reject")}
              </button>
            </>
          )}
          {host.status === "active" && (
            <>
              <div className="flex items-center gap-1">
                <select
                  defaultValue={host.stars}
                  onChange={(e) => onUpdate(host.id, { stars: Number(e.target.value) as Host["stars"] })}
                  className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none"
                >
                  {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{"★".repeat(s)}</option>)}
                </select>
              </div>
              <button onClick={() => onUpdate(host.id, { status: "suspended" })} disabled={updating === host.id}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50">
                {a("Приостановить", "Suspend")}
              </button>
            </>
          )}
          {host.status === "suspended" && (
            <button onClick={() => onUpdate(host.id, { status: "active" })} disabled={updating === host.id}
              className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50">
              {a("Восстановить", "Restore")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const { lang } = useLang();
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, Record<string, string>> = { pending: { ru: "Ожидает", en: "Pending" }, confirmed: { ru: "Подтверждено", en: "Confirmed" }, completed: { ru: "Завершено", en: "Completed" }, cancelled: { ru: "Отменено", en: "Cancelled" } };
  return <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${map[status]}`}>{labels[status]?.[lang] || labels[status]?.en || status}</span>;
}

function StatusBadgeHost({ status }: { status: Host["status"] }) {
  const { lang } = useLang();
  const map = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", suspended: "bg-red-100 text-red-700" };
  const labels: Record<string, Record<string, string>> = { active: { ru: "Активен", en: "Active" }, pending: { ru: "На проверке", en: "Pending" }, suspended: { ru: "Приостановлен", en: "Suspended" } };
  return <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${map[status]}`}>{labels[status]?.[lang] || labels[status]?.en || status}</span>;
}
