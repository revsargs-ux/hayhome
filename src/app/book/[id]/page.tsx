"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Host } from "@/lib/types";
import { ChevronLeft, Star, Check } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { getLocalizedField } from "@/lib/i18n-utils";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { tr, lang } = useLang();
  const id = params.id as string;

  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    guestName: "", guestEmail: "", guestPhone: "",
    guestCountry: "", checkIn: "", checkOut: "", guests: 1, message: "",
  });

  useEffect(() => { fetch(`/api/hosts/${id}`).then(r => r.json()).then(setHost); }, [id]);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    return Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000));
  })();

  const total = host ? nights * host.pricePerNight : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host) return;
    if (nights < 1) { setError(lang === "ru" ? "Выберите корректные даты" : "Please select valid dates"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hostId: id, hostName: host.familyName, totalPrice: total }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError(lang === "ru" ? "Ошибка отправки. Попробуйте ещё раз." : "Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const familyName = host ? getLocalizedField(host.familyName, host.i18n, "familyName", lang) : "";

  const T = {
    title: { ru: "Бронирование визита", en: "Book a Visit", hy: "Ama rezervim", fr: "Réserver une visite", de: "Besuch buchen", es: "Reservar visita", it: "Prenota una visita", ar: "حجز زيارة", zh: "预订参观", fa: "رزرو بازدید" },
    name: { ru: "Ваше имя", en: "Your name", hy: "Ձеr anun", fr: "Votre nom", de: "Ihr Name", es: "Tu nombre", it: "Il tuo nome", ar: "اسمك", zh: "您的姓名", fa: "نام شما" },
    country: { ru: "Страна", en: "Country", hy: "Erkir", fr: "Pays", de: "Land", es: "País", it: "Paese", ar: "الدولة", zh: "国家", fa: "کشور" },
    phone: { ru: "Телефон", en: "Phone", hy: "Hеrelakhos", fr: "Téléphone", de: "Telefon", es: "Teléfono", it: "Telefono", ar: "الهاتف", zh: "电话", fa: "تلفن" },
    checkIn: { ru: "Дата заезда", en: "Check-in", hy: "Mutoum ov", fr: "Arrivée", de: "Anreise", es: "Llegada", it: "Arrivo", ar: "تسجيل الوصول", zh: "入住日期", fa: "تاریخ ورود" },
    checkOut: { ru: "Дата отъезда", en: "Check-out", hy: "Ararakel", fr: "Départ", de: "Abreise", es: "Salida", it: "Partenza", ar: "تسجيل المغادرة", zh: "退房日期", fa: "تاریخ خروج" },
    guests: { ru: "Количество гостей", en: "Number of guests", hy: "Hyurerneri kanakk", fr: "Nombre d'hôtes", de: "Anzahl der Gäste", es: "Número de huéspedes", it: "Numero di ospiti", ar: "عدد الضيوف", zh: "客人数量", fa: "تعداد مهمانان" },
    maxGuests: { ru: "Максимум", en: "Maximum", hy: "Aravnak", fr: "Maximum", de: "Maximum", es: "Máximo", it: "Massimo", ar: "الحد الأقصى", zh: "最多", fa: "حداکثر" },
    message: { ru: "Сообщение семье", en: "Message to family", hy: "Khavar gortsdzneri", fr: "Message à la famille", de: "Nachricht an die Familie", es: "Mensaje a la familia", it: "Messaggio alla famiglia", ar: "رسالة للعائلة", zh: "给家庭的消息", fa: "پیام به خانواده" },
    msgPlaceholder: { ru: "Расскажите о себе: откуда вы, цель визита...", en: "Tell us about yourself: where you're from, purpose of visit...", fr: "Parlez-nous de vous...", de: "Erzählen Sie uns von sich...", es: "Cuéntenos sobre usted...", it: "Raccontateci di voi...", ar: "أخبرنا عن نفسك...", zh: "告诉我们关于您自己...", fa: "درباره خودتان بنویسید..." },
    submit: { ru: "Запросить бронирование", en: "Request booking", hy: "Khndrel rezervisyun", fr: "Demander réservation", de: "Buchung anfragen", es: "Solicitar reserva", it: "Richiedi prenotazione", ar: "طلب الحجز", zh: "申请预订", fa: "درخواست رزرو" },
    cancel: { ru: "Бесплатная отмена за 48 часов до заезда", en: "Free cancellation 48 hours before check-in", fr: "Annulation gratuite 48h avant", de: "Kostenlose Stornierung 48h vorher", es: "Cancelación gratuita 48h antes", it: "Cancellazione gratuita 48h prima", ar: "إلغاء مجاني قبل 48 ساعة", zh: "入住前48小时免费取消", fa: "لغو رایگان ۴۸ ساعت قبل" },
    back: { ru: "Назад к профилю", en: "Back to profile", hy: "Veradardz vkayakir", fr: "Retour au profil", de: "Zurück zum Profil", es: "Volver al perfil", it: "Torna al profilo", ar: "العودة للملف", zh: "返回资料", fa: "بازگشت به پروفایل" },
    nights: { ru: "ночей", en: "nights", fr: "nuits", de: "Nächte", es: "noches", it: "notti", ar: "ليالٍ", zh: "晚", fa: "شب" },
    total: { ru: "Итого", en: "Total", hy: "Yntupaken", fr: "Total", de: "Gesamt", es: "Total", it: "Totale", ar: "الإجمالي", zh: "总计", fa: "مجموع" },
    free: { ru: "Бесплатно", en: "Free", fr: "Gratuit", de: "Kostenlos", es: "Gratis", it: "Gratuito", ar: "مجاني", zh: "免费", fa: "رایگان" },
    service: { ru: "Сервисный сбор", en: "Service fee", fr: "Frais de service", de: "Servicegebühr", es: "Cargo por servicio", it: "Commissione di servizio", ar: "رسوم الخدمة", zh: "服务费", fa: "هزینه خدمات" },
    sentTitle: { ru: "Заявка отправлена!", en: "Request sent!", fr: "Demande envoyée!", de: "Anfrage gesendet!", es: "¡Solicitud enviada!", it: "Richiesta inviata!", ar: "تم إرسال الطلب!", zh: "请求已发送！", fa: "درخواست ارسال شد!" },
    sentDesc: { ru: "получила вашу заявку и свяжется с вами в течение 24 часов.", en: "received your request and will contact you within 24 hours.", fr: "a reçu votre demande et vous contactera dans 24 heures.", de: "hat Ihre Anfrage erhalten und meldet sich innerhalb von 24 Stunden.", es: "recibió su solicitud y se pondrá en contacto en 24 horas.", it: "ha ricevuto la tua richiesta e ti contatterà entro 24 ore.", ar: "استلمت طلبك وستتواصل معك خلال 24 ساعة.", zh: "已收到您的请求，将在24小时内联系您。", fa: "درخواست شما را دریافت کرد و ظرف ۲۴ ساعت با شما تماس خواهد گرفت." },
    details: { ru: "Детали", en: "Details", fr: "Détails", de: "Details", es: "Detalles", it: "Dettagli", ar: "التفاصيل", zh: "详情", fa: "جزئیات" },
    moreFamilies: { ru: "Найти ещё семьи", en: "Find more families", fr: "Trouver plus de familles", de: "Mehr Familien finden", es: "Encontrar más familias", it: "Trova altre famiglie", ar: "إيجاد المزيد من العائلات", zh: "寻找更多家庭", fa: "یافتن خانواده‌های بیشتر" },
    selectDates: { ru: "Выберите даты для расчёта", en: "Select dates to calculate", fr: "Sélectionnez les dates", de: "Daten auswählen", es: "Seleccione fechas", it: "Seleziona le date", ar: "حدد التواريخ للحساب", zh: "选择日期计算", fa: "تاریخ‌ها را انتخاب کنید" },
  };

  const t = (key: keyof typeof T): string => (T[key] as Record<string, string>)[lang] ?? (T[key] as Record<string, string>).en ?? "";

  if (!host) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("sentTitle")}</h2>
        <p className="text-gray-600 mb-3 leading-relaxed">
          <strong>{familyName}</strong> {t("sentDesc")}
        </p>
        <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left text-sm">
          <p className="font-semibold text-gray-800 mb-2">{t("details")}:</p>
          <p>📅 {form.checkIn} → {form.checkOut} ({nights} {t("nights")})</p>
          <p>👥 {form.guests} {tr.hosts.guests}</p>
          <p>💵 {t("total")}: ${total}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="block w-full py-3 rounded-full text-white font-semibold text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {lang === "ru" ? "Мои бронирования" : lang === "hy" ? "Իմ ամրագրումները" : lang === "fr" ? "Mes réservations" : lang === "de" ? "Meine Buchungen" : lang === "es" ? "Mis reservas" : lang === "ar" ? "حجوزاتي" : lang === "zh" ? "我的预订" : "My bookings"}
          </Link>
          <Link href="/hosts" className="block w-full py-3 rounded-full text-center font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            {t("moreFamilies")}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/hosts/${id}`} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6">
          <ChevronLeft size={16} /> {t("back")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("name")} *</label>
                    <input required value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("country")} *</label>
                    <input required value={form.guestCountry} onChange={e => setForm(f => ({ ...f, guestCountry: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input required type="email" value={form.guestEmail} onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("phone")}</label>
                    <input value={form.guestPhone} onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("checkIn")} *</label>
                    <input required type="date" value={form.checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("checkOut")} *</label>
                    <input required type="date" value={form.checkOut}
                      min={form.checkIn || new Date().toISOString().split("T")[0]}
                      onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("guests")}</label>
                  <input type="number" min={1} max={host.maxGuests} value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  <p className="text-xs text-gray-400 mt-1">{t("maxGuests")}: {host.maxGuests} {tr.hosts.guests}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("message")}</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4} placeholder={t("msgPlaceholder")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 resize-none" />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {loading ? "..." : `${t("submit")} · $${total}`}
                </button>
                <p className="text-center text-xs text-gray-400">{t("cancel")}</p>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-32">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #D4001A22, #F2A90044)" }}>🏠</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{familyName}</p>
                  <p className="text-gray-500 text-xs">{host.city}, {host.region}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} fill="#F2A900" color="#F2A900" />
                    <span className="text-xs font-semibold text-gray-700">{host.rating > 0 ? host.rating : tr.common.newHost}</span>
                  </div>
                </div>
              </div>
              {nights > 0 ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>${host.pricePerNight} × {nights} {t("nights")}</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>{t("service")}</span>
                    <span className="text-green-600 font-medium">{t("free")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                    <span>{t("total")}</span><span>${total}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">{t("selectDates")}</p>
              )}
              <div className="mt-4 space-y-2">
                {[`${tr.hosts.upTo} ${host.maxGuests} ${tr.hosts.guests}`, tr.hosts.freeCancel, tr.hosts.directContact].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={12} className="text-green-500 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
