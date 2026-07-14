"use client";
import { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import getUI from "@/lib/ui";
import type { Service } from "@/lib/types";

const PRICE_UNIT_LABELS: Record<string, Record<string, string>> = {
  per_hour: { ru: "/час", en: "/hour", hy: "/ժամ", fr: "/heure", de: "/Std.", es: "/hora", it: "/ora", ar: "/ساعة", zh: "/小时", fa: "/ساعت" },
  per_event: { ru: "/мероприятие", en: "/event", hy: "/միջոցառում", fr: "/événement", de: "/Event", es: "/evento", it: "/evento", ar: "/حدث", zh: "/活动", fa: "/رویداد" },
  per_person: { ru: "/гость", en: "/person", hy: "/հյուր", fr: "/personne", de: "/Person", es: "/persona", it: "/persona", ar: "/شخص", zh: "/人", fa: "/نفر" },
};

function ServiceBookContent() {
  const params = useParams();
  const { lang, tr } = useLang();
  const u = getUI(lang);
  const { user } = useAuth();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [date, setDate] = useState("");
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "evening" | "custom">("morning");
  const [customTime, setCustomTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"onsite" | "transfer">("onsite");

  // Fetch service details
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/services?id=${id}`);
        if (!res.ok) {
          setError("Service not found");
          setService(null);
        } else {
          const data = await res.json();
          setService(data);
        }
      } catch {
        setError("Failed to load service");
      }
      setLoading(false);
    })();
    // Load booked dates for calendar
    fetch("/api/service-bookings/public")
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const dates = (data || []).filter((b: any) => b.serviceId === id && b.status !== "cancelled").map((b: any) => b.date);
        setBookedDates(dates);
      })
      .catch(() => {});
  }, [id]);

  // Auto-fill name from profile
  useEffect(() => {
    if (user) {
      setGuestName((prev) => prev || user.name);
    }
  }, [user]);

  // Calculate total
  const unitLabel = service
    ? (PRICE_UNIT_LABELS[service.price_unit] || PRICE_UNIT_LABELS.per_event)[lang] || PRICE_UNIT_LABELS.per_event.en
    : "";

  const totalPrice = (() => {
    if (!service) return 0;
    if (service.price_unit === "per_person") {
      return service.price * guests;
    }
    return service.price;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    if (!guestName.trim() || !guestPhone.trim()) {
      setError(u.nameLabel + " & " + u.phoneLabel + " — required");
      return;
    }
    if (!date) {
      setError(u.selectDate);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/service-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: id,
          guest_name: guestName,
          guest_phone: guestPhone,
          date,
          time_of_day: timeOfDay,
          custom_time: timeOfDay === "custom" ? customTime : undefined,
          guests,
          message,
          payment_method: paymentMethod,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Request failed");
      }

      setSuccess(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Local translations
  const T = {
    yourName: { ru: "Ваше имя", en: "Your name", hy: "Ձեր անունը", fr: "Votre nom", de: "Ihr Name", es: "Tu nombre", it: "Il tuo nome", ar: "اسمك", zh: "您的姓名", fa: "نام شما" },
    yourPhone: { ru: "Телефон", en: "Phone", hy: "Հեռախոս", fr: "Téléphone", de: "Telefon", es: "Teléfono", it: "Telefono", ar: "الهاتف", zh: "电话", fa: "تلفن" },
    payOnsite: { ru: "На месте", en: "On-site", hy: "Տեղում", fr: "Sur place", de: "Vor Ort", es: "En el sitio", it: "Sul posto", ar: "في الموقع", zh: "现场", fa: "در محل" },
    payTransfer: { ru: "Переводом", en: "By transfer", hy: "Փոխանցմամբ", fr: "Par virement", de: "Per Überweisung", es: "Por transferencia", it: "Per bonifico", ar: "بالتحويل", zh: "转账", fa: "ترانسفر" },
    transferHint: { ru: "Реквизиты для перевода будут отправлены вам.", en: "Transfer details will be sent to you.", hy: "Փոխանցման տվյալները կուղարկվեն ձեզ։", fr: "Les coordonnées vous seront envoyées.", de: "Bankdaten werden Ihnen zugesandt.", es: "Los datos se le enviarán.", it: "I dati vi saranno inviati.", ar: "سيتم إرسال التفاصيل لك.", zh: "转账详情将发送给您。", fa: "اطلاعات ترانسفر برای شما ارسال خواهد شد." },
    total: { ru: "Итого", en: "Total", hy: "Ընդհանուր", fr: "Total", de: "Gesamt", es: "Total", it: "Totale", ar: "الإجمالي", zh: "总计", fa: "مجموع" },
    customTimePlaceholder: { ru: "Напр. 14:00", en: "e.g. 14:00", hy: "օր. 14:00", fr: "ex. 14h00", de: "z.B. 14:00", es: "ej. 14:00", it: "es. 14:00", ar: "مث. 14:00", zh: "例如 14:00", fa: "مثلاً ۱۴:۰۰" },
    loading: { ru: "Загрузка...", en: "Loading...", hy: "Բեռնվում է...", fr: "Chargement...", de: "Laden...", es: "Cargando...", it: "Caricamento...", ar: "جار التحميل...", zh: "加载中...", fa: "در حال بارگذاری..." },
    notFound: { ru: "Услуга не найдена", en: "Service not found", hy: "Ծառայությունը չի գտնվել", fr: "Service introuvable", de: "Service nicht gefunden", es: "Servicio no encontrado", it: "Servizio non trovato", ar: "الخدمة غير موجودة", zh: "未找到服务", fa: "خدمت یافت نشد" },
  };
  const t = (k: keyof typeof T): string => (T[k] as Record<string, string>)[lang] || (T[k] as Record<string, string>).en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{u.orderSent}</h2>
          <p className="text-gray-600 mb-6">{u.providerWillContact}</p>
          {service && (
            <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left text-sm">
              <p className="font-semibold text-gray-800 mb-1">{service.title}</p>
              <p className="text-gray-600">📅 {date}</p>
              <p className="text-gray-600">👥 {guests}</p>
              <p className="text-gray-600">💵 {t("total")}: ${totalPrice}</p>
            </div>
          )}
          <Link
            href="/services"
            className="block w-full py-3 rounded-full text-white font-semibold text-center transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
          >
            {u.backToServices}
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">{t("notFound")}</p>
          <Link href="/services" className="text-orange-600 font-semibold hover:underline">
            {u.backToServices}
          </Link>
        </div>
      </div>
    );
  }

  const coverPhoto = service.photos && service.photos.length > 0 ? service.photos[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6"
        >
          <ChevronLeft size={16} /> {u.backToServices}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                ✨ {u.serviceBooking}
              </h1>

              {/* Service preview */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-100 to-amber-100">
                  {coverPhoto ? (
                    <img src={coverPhoto} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900">{service.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <MapPin size={12} />
                    <span>{service.region}</span>
                    {service.rating > 0 && (
                      <>
                        <span className="mx-1">·</span>
                        <Star size={12} fill="#D4A04A" color="#D4A04A" />
                        <span className="font-semibold text-gray-700">{service.rating}</span>
                      </>
                    )}
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${service.price}
                    <span className="text-xs text-gray-400 ml-1">{unitLabel}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("yourName")} *
                    </label>
                    <input
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {t("yourPhone")} *
                    </label>
                    <input
                      required
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+374 ..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900"
                    />
                  </div>
                </div>

                {/* Date — visual calendar */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {u.selectDate} *
                  </label>
                  <input type="hidden" value={date} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const dayNames = [tr.hosts.mon, tr.hosts.tue, tr.hosts.wed, tr.hosts.thu, tr.hosts.fri, tr.hosts.sat, tr.hosts.sun];
                      const cells = [];
                      // Header
                      dayNames.forEach((n) => {
                        cells.push(<div key={"h" + n} style={{ textAlign: "center", fontSize: "10px", color: "#999", fontWeight: 600 }}>{n}</div>);
                      });
                      // 4 weeks = 28 days
                      for (let i = 0; i < 28; i++) {
                        const d = new Date(today);
                        d.setDate(d.getDate() + i);
                        const ds = d.toISOString().substring(0, 10);
                        const isBooked = bookedDates.includes(ds);
                        const isPast = d < today && i > 0;
                        const isSelected = date === ds;
                        const isDisabled = isPast || isBooked;
                        let bg = "#f0fdf4";
                        let border = "#bbf7d0";
                        let color = "#16a34a";
                        if (isBooked) { bg = "#fef2f2"; border = "#fecaca"; color = "#ef4444"; }
                        if (isPast && i > 0) { bg = "#f9fafb"; border = "#e5e7eb"; color = "#d1d5db"; }
                        if (isSelected) { bg = "#dbeafe"; border = "#3b82f6"; color = "#1d4ed8"; }
                        cells.push(
                          <button
                            key={ds}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => !isDisabled && setDate(ds)}
                            style={{
                              textAlign: "center", padding: "6px 0", borderRadius: "8px",
                              background: bg, border: "1px solid " + border,
                              color: color, fontWeight: 700, fontSize: "13px",
                              cursor: isDisabled ? "default" : "pointer",
                              opacity: isPast && i > 0 ? 0.5 : 1,
                              textDecoration: isBooked ? "line-through" : "none",
                              boxShadow: isSelected ? "0 0 0 2px #3b82f6" : "none",
                            }}
                          >
                            {d.getDate()}
                          </button>
                        );
                      }
                      return cells;
                    })()}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", gap: "12px", fontSize: "11px" }}>
                    <span style={{ color: "#16a34a" }}>{tr.hosts.calFree}</span>
                    <span style={{ color: "#ef4444" }}>{tr.hosts.calBusy}</span>
                    <span style={{ color: "#1d4ed8" }}>{tr.hosts.calSelected}</span>
                  </div>
                </div>

                {/* Time of Day */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {u.timeOfDay}
                  </label>
                  <div className="flex gap-2">
                    {(["morning", "evening", "custom"] as const).map((tod) => (
                      <button
                        key={tod}
                        type="button"
                        onClick={() => setTimeOfDay(tod)}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition ${
                          timeOfDay === tod
                            ? "border-orange-400 bg-orange-50 text-orange-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {tod === "morning" ? u.morning : tod === "evening" ? u.evening : u.customTime}
                      </button>
                    ))}
                  </div>
                  {timeOfDay === "custom" && (
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder={t("customTimePlaceholder")}
                      className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900"
                    />
                  )}
                </div>

                {/* Number of People */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {u.numberOfPeople}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={guests}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v >= 1 && v <= 50) setGuests(v);
                        else if (e.target.value === "") setGuests(1);
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-center text-gray-900 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(50, g + 1))}
                      disabled={guests >= 50}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Message to Provider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {u.messageToProvider}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 resize-none"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
                >
                  {submitting
                    ? t("loading")
                    : `${u.bookService} · $${totalPrice}`}
                </button>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-32">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-100 to-amber-100">
                  {coverPhoto ? (
                    <img src={coverPhoto} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">✨</div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{service.title}</p>
                  <p className="text-gray-500 text-xs">{service.region}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {service.price_unit === "per_person" ? (
                  <>
                    <div className="flex justify-between text-gray-700">
                      <span>${service.price} × {guests}</span>
                      <span>${totalPrice}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-gray-700">
                    <span>${service.price} {unitLabel}</span>
                    <span>${totalPrice}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>{t("total")}</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ServiceBookContent />
    </Suspense>
  );
}
