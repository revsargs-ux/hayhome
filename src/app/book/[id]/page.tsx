"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Host } from "@/lib/types";
import { ChevronLeft, Star, Check, ChevronRight, Navigation, MapPin } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import type { LangCode } from "@/lib/translations";
import { useAuth } from "@/contexts/AuthContext";
import { getLocalizedField } from "@/lib/i18n-utils";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { NominatimResult } from "@/components/AddressAutocomplete";
import dynamic from "next/dynamic";
import NavigatorLinks from "@/components/NavigatorLinks";
import { getCityCoords } from "@/lib/cityCoords";
import Recommendations from "@/components/Recommendations";
import { reverseGeocode } from "@/lib/geo";

const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { tr, lang } = useLang();
  const u = getUI(lang);
  const { user } = useAuth();
  const id = params.id as string;

  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  // Payment state
  const [extraTotal, setExtraTotal] = useState(0);

  const [form, setForm] = useState({
    guestName: "", guestEmail: "", guestPhone: "",
    guestCountry: "", checkIn: "", checkOut: "", checkInTime: "14:00", checkOutTime: "12:00", guests: 1, message: "",
  });
  const [draftRestored, setDraftRestored] = useState(false);

  // Detected city from geolocation
  const [detectedCity, setDetectedCity] = useState("");
  const [detectedRegion, setDetectedRegion] = useState("");

  // Route / geolocation state
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [originLabel, setOriginLabel] = useState("");
  const [geoWarning, setGeoWarning] = useState("");

  // Route translation strings
  const RT = {
    routeTitle: { ru: "Маршрут", en: "Route", hy: "Երթուղի", fr: "Itinéraire", de: "Route", es: "Ruta", it: "Percorso", ar: "الطريق", zh: "路线", fa: "مسیر" },
    whereFrom: { ru: "Откуда вы едете?", en: "Where are you traveling from?", hy: "Որտեղից եք գալիս?", fr: "D'où venez-vous?", de: "Woher kommen Sie?", es: "¿De dónde viene?", it: "Da dove vieni?", ar: "من أين تأتي؟", zh: "您从哪里来？", fa: "از کجا می‌آیید؟" },
    useGeo: { ru: "Определить местоположение", en: "Use my location", hy: "Իմ գտնվելու վայրը", fr: "Utiliser ma position", de: "Meinen Standort verwenden", es: "Usar mi ubicación", it: "Usa la mia posizione", ar: "استخدم موقعي", zh: "使用我的位置", fa: "از موقعیت من استفاده کن" },
    enterAddress: { ru: "Укажите адрес отправления", en: "Enter departure address", hy: "Մուտքագրեք հասցեն", fr: "Entrez l'adresse de départ", de: "Abfahrtsadresse eingeben", es: "Ingrese dirección de salida", it: "Inserisci indirizzo di partenza", ar: "أدخل عنوان المغادرة", zh: "输入出发地址", fa: "آدرس مبدا را وارد کنید" },
    geoWarn: { ru: "Для точного определения местоположения разрешите доступ к геолокации", en: "Allow geolocation access for accurate positioning", hy: "Թույլատրեք երկրաչափության հասանելիությունը", fr: "Autorisez la géolocalisation pour une position précise", de: "Erlauben Sie Geolokalisierung für genaue Positionierung", es: "Permita el acceso a geolocalización", it: "Consenti geolocalizzazione per posizionamento accurato", ar: "اسمح بالوصول إلى الموقع للحصول على تحديد دقيق", zh: "允许地理定位访问以精确定位", fa: "برای تعیین مکان دقیق، دسترسی به مکان را مجاز کنید" },
    hostLocation: { ru: "Семья", en: "Host family", hy: "Ընտանիք", fr: "Famille hôte", de: "Gastfamilie", es: "Familia anfitriona", it: "Famiglia ospitante", ar: "العائلة المضيفة", zh: "房东家庭", fa: "خانواده میزبان" },
  };
  const rt = (key: keyof typeof RT): string => (RT[key] as Record<string, string>)[lang] ?? (RT[key] as Record<string, string>).en ?? "";

  // Geolocation handler
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoWarning(rt("geoWarn"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOriginLabel("GPS");
        setGeoWarning("");
      },
      () => {
        setGeoWarning(rt("geoWarn"));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleAddressSelect = (result: NominatimResult) => {
    setOrigin({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setOriginLabel(result.display_name.split(", ").slice(0, 2).join(", "));
  };

  // Host destination coordinates
  const hostCoords = host ? getCityCoords(host.city) : null;

  // Mini calendar state
  const [calendarData, setCalendarData] = useState<Map<string, string>>(new Map());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (!id) return;
    const monthStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
    fetch(`/api/calendar?hostId=${id}&month=${monthStr}`)
      .then(r => r.json())
      .then(data => {
        const m = new Map<string, string>();
        (Array.isArray(data) ? data : []).forEach((e: any) => m.set(e.date, e.status));
        setCalendarData(m);
      })
      .catch(() => {});
  }, [id, calYear, calMonth]);

  useEffect(() => { fetch(`/api/hosts/${id}`).then(r => r.json()).then(setHost); }, [id]);

  // Restore draft from localStorage (after redirect from login)
  useEffect(() => {
    if (!id) return;
    const draftKey = `hayhome_booking_draft_${id}`;
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const saved = JSON.parse(draft);
        setForm(f => ({
          ...f,
          guestName: saved.guestName || f.guestName,
          guestEmail: saved.guestEmail || f.guestEmail,
          guestCountry: saved.guestCountry || f.guestCountry,
          guestPhone: saved.guestPhone || f.guestPhone,
          checkIn: saved.checkIn || f.checkIn,
          checkOut: saved.checkOut || f.checkOut,
          checkInTime: saved.checkInTime || f.checkInTime,
          checkOutTime: saved.checkOutTime || f.checkOutTime,
          guests: saved.guests || f.guests,
          message: saved.message || f.message,
        }));
        setDraftRestored(true);
      }
    } catch {}
  }, [id]);

  // Save draft to localStorage on form change
  useEffect(() => {
    if (!id) return;
    const draftKey = `hayhome_booking_draft_${id}`;
    // Only save if there's meaningful data
    if (form.checkIn || form.checkOut || form.guestName || form.guestEmail) {
      try {
        localStorage.setItem(draftKey, JSON.stringify({
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          guestCountry: form.guestCountry,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          checkInTime: form.checkInTime,
          checkOutTime: form.checkOutTime,
          guests: form.guests,
          message: form.message,
        }));
      } catch {}
    }
  }, [id, form]);

  // Автозаполнение данных из профиля
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        guestName: f.guestName || user.name,
        guestEmail: f.guestEmail || user.email,
        guestCountry: f.guestCountry || "",
      }));
    }
  }, [user]);

  // Auto-detect city from geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const geo = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (geo.city) {
            setDetectedCity(geo.city);
            setDetectedRegion(geo.region);
          }
        } catch {}
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    return Math.max(0, Math.round((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000));
  })();

  const total = host ? nights * host.pricePerNight : 0;
  const commission = Math.round((total + extraTotal) * 0.10 * 100) / 100;
  const finalTotal = total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host) return;
    if (!user) { setAuthRequired(true); return; }
    if (nights < 1) { setError(u.bookingDatesError); return; }
    setLoading(true);
    setError("");
    try {
      console.log("[book] Submitting:", { ...form, hostId: id, hostName: host.familyName });
      const res = await fetch("/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, hostId: id, hostName: host.familyName }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("[book] API error:", res.status, errData);
        throw new Error(errData.error || `Server error (${res.status})`);
      }
      const bookingResult = await res.json();
      console.log("[book] Booking created:", bookingResult);
      const bookingId = bookingResult?.id || bookingResult?.[0]?.id;
      // Clear draft on successful booking
      try { localStorage.removeItem(`hayhome_booking_draft_${id}`); } catch {}

      if (bookingId) {
        try {
          const payRes = await fetch("/api/payments/create", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_id: bookingId, method: "yookassa", currency: "RUB" }),
          });
          if (payRes.ok) {
            const payData = await payRes.json();
            if (payData.url) { window.location.href = payData.url; return; }
          }
        } catch (e) {}
      }
      setSuccess(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("[book] Submit error:", msg);
      if (msg.includes("not available") || msg.includes("dates")) {
        setError(u.datesNotAvailable || "Dates not available");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const familyName = host ? getLocalizedField(host.familyName, host.i18n, "familyName", lang) : "";

  const T = {
    title: { ru: "Бронирование визита", en: "Book a Visit", hy: "Այցանկարագրում", fr: "Réserver une visite", de: "Besuch buchen", es: "Reservar visita", it: "Prenota una visita", ar: "حجز زيارة", zh: "预订参观", fa: "رزرو بازدید" },
    name: { ru: "Ваше имя", en: "Your name", hy: "Ձեր անունը", fr: "Votre nom", de: "Ihr Name", es: "Tu nombre", it: "Il tuo nome", ar: "اسمك", zh: "您的姓名", fa: "نام شما" },
    country: { ru: "Страна", en: "Country", hy: "Երկիր", fr: "Pays", de: "Land", es: "País", it: "Paese", ar: "الدولة", zh: "国家", fa: "کشور" },
    phone: { ru: "Телефон", en: "Phone", hy: "Հեռախոս", fr: "Téléphone", de: "Telefon", es: "Teléfono", it: "Telefono", ar: "الهاتف", zh: "电话", fa: "تلفن" },
    checkIn: { ru: "Дата заезда", en: "Check-in", hy: "Մուտք գալու ամսաթիվ", fr: "Arrivée", de: "Anreise", es: "Llegada", it: "Arrivo", ar: "تسجيل الوصول", zh: "入住日期", fa: "تاریخ ورود" },
    checkOut: { ru: "Дата отъезда", en: "Check-out", hy: "Մեքելու ամսաթիվ", fr: "Départ", de: "Abreise", es: "Salida", it: "Partenza", ar: "تسجيل المغادرة", zh: "退房日期", fa: "تاریخ خروج" },
    guests: { ru: "Количество гостей", en: "Number of guests", hy: "Հյուրերի քանակը", fr: "Nombre d'hôtes", de: "Anzahl der Gäste", es: "Número de huéspedes", it: "Numero di ospiti", ar: "عدد الضيوف", zh: "客人数量", fa: "تعداد مهمانان" },
    maxGuests: { ru: "Максимум", en: "Maximum", hy: "Առավելագույն", fr: "Maximum", de: "Maximum", es: "Máximo", it: "Massimo", ar: "الحد الأقصى", zh: "最多", fa: "حداکثر" },
    message: { ru: "Сообщение семье", en: "Message to family", hy: "Նամակ ընտանիքին", fr: "Message à la famille", de: "Nachricht an die Familie", es: "Mensaje a la familia", it: "Messaggio alla famiglia", ar: "رسالة للعائلة", zh: "给家庭的消息", fa: "پیام به خانواده" },
    msgPlaceholder: { ru: "Расскажите о себе: откуда вы, цель визита...", en: "Tell us about yourself: where you're from, purpose of visit...", fr: "Parlez-nous de vous...", de: "Erzählen Sie uns von sich...", es: "Cuéntenos sobre usted...", it: "Raccontateci di voi...", ar: "أخبرنا عن نفسك...", zh: "告诉我们关于您自己...", fa: "درباره خودتان بنویسید..." },
    submit: { ru: "Запросить бронирование", en: "Request booking", hy: "Պահանջել ամրագրում", fr: "Demander réservation", de: "Buchung anfragen", es: "Solicitar reserva", it: "Richiedi prenotazione", ar: "طلب الحجز", zh: "申请预订", fa: "درخواست رزرو" },
    cancel: { ru: "Бесплатная отмена за 48 часов до заезда", en: "Free cancellation 48 hours before check-in", hy: "Անվճար չեղարկում 48 ժամ առաջ", fr: "Annulation gratuite 48h avant", de: "Kostenlose Stornierung 48h vorher", es: "Cancelación gratuita 48h antes", it: "Cancellazione gratuita 48h prima", ar: "إلغاء مجاني قبل 48 ساعة", zh: "入住前48小时免费取消", fa: "لغو رایگان ۴۸ ساعت قبل" },
    back: { ru: "Назад к профилю", en: "Back to profile", hy: "Վերադարձ պրոֆիլին", fr: "Retour au profil", de: "Zurück zum Profil", es: "Volver al perfil", it: "Torna al profilo", ar: "العودة للملف", zh: "返回资料", fa: "بازگشت به پروفایل" },
    nights: { ru: "ночей", en: "nights", fr: "nuits", de: "Nächte", es: "noches", it: "notti", ar: "ليالٍ", zh: "晚", fa: "شب" },
    total: { ru: "Итого", en: "Total", hy: "Ընդհանուր", fr: "Total", de: "Gesamt", es: "Total", it: "Totale", ar: "الإجمالي", zh: "总计", fa: "مجموع" },
    free: { ru: "Бесплатно", en: "Free", fr: "Gratuit", de: "Kostenlos", es: "Gratis", it: "Gratuito", ar: "مجاني", zh: "免费", fa: "رایگان" },
    service: { ru: "Сервисный сбор", en: "Service fee", fr: "Frais de service", de: "Servicegebühr", es: "Cargo por servicio", it: "Commissione di servizio", ar: "رسوم الخدمة", zh: "服务费", fa: "هزینه خدمات" },
    sentTitle: { ru: "Заявка отправлена!", en: "Request sent!", fr: "Demande envoyée!", de: "Anfrage gesendet!", es: "¡Solicitud enviada!", it: "Richiesta inviata!", ar: "تم إرسال الطلب!", zh: "请求已发送！", fa: "درخواست ارسال شد!" },
    sentDesc: { ru: "получила вашу заявку и свяжется с вами в течение 24 часов.", en: "received your request and will contact you within 24 hours.", hy: "ստացա ձեր հայտը և կկապվի ձեզ 24 ժամի ընթացքում։", fr: "a reçu votre demande et vous contactera dans 24 heures.", de: "hat Ihre Anfrage erhalten und meldet sich innerhalb von 24 Stunden.", es: "recibió su solicitud y se pondrá en contacto en 24 horas.", it: "ha ricevuto la tua richiesta e ti contatterà entro 24 ore.", ar: "استلمت طلبك وستتواصل معك خلال 24 ساعة.", zh: "已收到您的请求，将在24小时内联系您。", fa: "درخواست شما را دریافت کرد و ظرف ۲۴ ساعت با شما تماس خواهد گرفت." },
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

  if (authRequired) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {u.loginRequiredTitle}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {u.loginRequiredDesc}
        </p>
        <div className="flex flex-col gap-3">
          <Link href={`/login?redirect=/book/${id}`}
            className="block py-3 rounded-full text-white font-semibold text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {tr.auth.loginBtn}
          </Link>
          <Link href={`/register?redirect=/book/${id}`}
            className="block py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-center hover:bg-gray-50 transition">
            {tr.auth.registerBtn}
          </Link>
        </div>
      </div>
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
          <p>📅 {form.checkIn}{form.checkInTime ? " " + form.checkInTime : ""} → {form.checkOut}{form.checkOutTime ? " " + form.checkOutTime : ""} ({nights} {t("nights")})</p>
          <p>👥 {form.guests} {tr.hosts.guests}</p>
          <p>💵 {t("total")}: ${finalTotal}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard" className="block w-full py-3 rounded-full text-white font-semibold text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {u.myBookingsBtn}
          </Link>
          <Link href="/hosts" className="block w-full py-3 rounded-full text-center font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            {t("moreFamilies")}
          </Link>
        </div>
      </div>

      {/* Recommendations after booking */}
      <div className="max-w-4xl mx-auto px-4 mt-8 w-full">
        <Recommendations
          type="similar-services"
          hostId={id}
          title="✨ Добавьте впечатления"
          titleEn="✨ Add experiences"
          limit={4}
        />
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
              {draftRestored && (
                <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2">
                  <span>💾</span> {u.draftRestored}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("name")} *</label>
                    <input required value={form.guestName} onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("country")} *</label>
                    <input value={form.guestCountry} onChange={e => setForm(f => ({ ...f, guestCountry: e.target.value }))}
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
                    <input type="time" value={form.checkInTime}
                      onChange={e => setForm(f => ({ ...f, checkInTime: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 mt-1.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("checkOut")} *</label>
                    <input required type="date" value={form.checkOut}
                      min={form.checkIn || new Date().toISOString().split("T")[0]}
                      onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                    <input type="time" value={form.checkOutTime}
                      onChange={e => setForm(f => ({ ...f, checkOutTime: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 mt-1.5" />
                  </div>
                </div>

                {/* Mini Calendar */}
                <div className="col-span-1 sm:col-span-2">
                  <MiniCalendar
                    year={calYear}
                    month={calMonth}
                    calendarData={calendarData}
                    checkIn={form.checkIn}
                    checkOut={form.checkOut}
                    lang={lang}
                    dayLabels={[tr.hosts.mon, tr.hosts.tue, tr.hosts.wed, tr.hosts.thu, tr.hosts.fri, tr.hosts.sat, tr.hosts.sun]}
                    onDateClick={(dateStr) => {
                      if (!form.checkIn || (form.checkIn && form.checkOut)) {
                        setForm(f => ({ ...f, checkIn: dateStr, checkOut: "" }));
                      } else {
                        if (dateStr > form.checkIn) {
                          setForm(f => ({ ...f, checkOut: dateStr }));
                        }
                      }
                    }}
                    onPrevMonth={() => {
                      if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                      else setCalMonth(calMonth - 1);
                    }}
                    onNextMonth={() => {
                      if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                      else setCalMonth(calMonth + 1);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("guests")}</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setForm(f => ({ ...f, guests: Math.max(1, f.guests - 1) }))} disabled={form.guests <= 1} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">−</button>
                    <input type="text" inputMode="numeric" value={form.guests}
                      onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1 && v <= (host.maxGuests || 20)) setForm(f => ({ ...f, guests: v })); else if (e.target.value === "") setForm(f => ({ ...f, guests: 1 })); }}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-center text-gray-900 font-semibold" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, guests: Math.min(host.maxGuests || 20, f.guests + 1) }))} disabled={form.guests >= (host.maxGuests || 20)} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">+</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t("maxGuests")}: {host.maxGuests} {tr.hosts.guests}</p>
                </div>

                {/* Detected city display */}
                {detectedCity && (
                  <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2">
                    <span>📍</span>
                    <span>{u.yourCity} <strong>{detectedCity}</strong>{detectedRegion ? `, ${detectedRegion}` : ""}</span>
                  </div>
                )}
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
                  {loading ? u.sendingText : (nights > 0 ? `${lang === "ru" ? "Оплатить комиссию" : "Pay commission"} · $${commission}` : t("submit"))}
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
                    <span>{t("total")}</span><span>${finalTotal}</span>
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

        {/* Additional Services Section */}
        <div className="mt-8">
            <AdditionalServicesSection
              onExtraChange={setExtraTotal}
              hostRegion={host.region}
              checkIn={form.checkIn}
              checkOut={form.checkOut}
              guests={form.guests}
              lang={lang}
            />
          </div>
      </div>
    </div>
  );
}

// ── Mini Calendar Component ──
function MiniCalendar({ year, month, calendarData, checkIn, checkOut, lang, dayLabels, onDateClick, onPrevMonth, onNextMonth }: {
  year: number; month: number; calendarData: Map<string, string>;
  checkIn: string; checkOut: string; lang: string;
  dayLabels: string[];
  onDateClick: (dateStr: string) => void;
  onPrevMonth: () => void; onNextMonth: () => void;
}) {
  const u = getUI(lang as LangCode);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const ui2 = getUI(lang as LangCode);
  const monthNames = ui2.months;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayIdx = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function getCellClass(date: Date): string {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const status = calendarData.get(dateStr);
    const isPast = dateStr < todayStr;
    const isSelected = dateStr === checkIn || dateStr === checkOut;
    const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut;

    if (isPast) return "bg-gray-50 text-gray-300";
    if (status === "booked" || status === "blocked") return "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (isSelected) return "bg-yellow-200 text-yellow-900 ring-2 ring-yellow-400 cursor-pointer";
    if (isInRange) return "bg-yellow-100 text-yellow-800 cursor-pointer";
    return "bg-green-100 text-green-800 hover:ring-2 hover:ring-green-300 cursor-pointer";
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="p-1 rounded hover:bg-gray-100"><ChevronRight size={16} /></button>
        <span className="text-sm font-bold text-gray-900">{monthNames[month]} {year}</span>
        <button onClick={onNextMonth} className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400">{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
          {week.map((date, di) => {
            if (!date) return <div key={di} className="h-8" />;
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            const status = calendarData.get(dateStr);
            const isPast = dateStr < todayStr;
            const isUnavailable = status === "booked" || status === "blocked";
            return (
              <div
                key={di}
                onClick={() => !isPast && !isUnavailable && onDateClick(dateStr)}
                className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${getCellClass(date)}`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-gray-400">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-100" /> <span>{u.free}</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-200" /> <span>{u.booked}</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-200" /> <span>{u.selected}</span></div>
      </div>
    </div>
  );
}

// ── Additional Services Section ──
import type { Service, TimeOfDay } from "@/lib/types";

const SVC_CATEGORIES = [
  { key: "photo", icon: "📸" },
  { key: "video", icon: "🎥" },
  { key: "music", icon: "🎵" },
  { key: "costume", icon: "👗" },
  { key: "decor", icon: "🎨" },
  { key: "dance", icon: "💃" },
  { key: "guide", icon: "🗺️" },
  { key: "chef", icon: "👨‍🍳" },
];

// Default time-of-day per category: cooking/breakfast → morning, music/dance → evening
const DEFAULT_TOD: Record<string, TimeOfDay> = {
  chef: "morning",
  music: "evening",
  dance: "evening",
  decor: "evening",
};

function AdditionalServicesSection({ hostRegion, checkIn, checkOut, guests, lang, onExtraChange }: {
  hostRegion: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  lang: string;
  onExtraChange?: (total: number) => void;
}) {
  const u = getUI(lang as LangCode);
  const [expanded, setExpanded] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [regionFilter, setRegionFilter] = useState<"nearby" | "all">("all");
  const [selected, setSelected] = useState<{ service: Service; date: string; startTime: string; endTime: string; timeOfDay: TimeOfDay; customTime: string }[]>([]);

  const fetchServices = async (cat: string) => {
    setLoading(true);
    const params = new URLSearchParams({ category: cat });
    if (regionFilter === "nearby") params.set("region", hostRegion);
    const res = await fetch(`/api/services?${params}`);
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const onCatClick = (cat: string) => {
    setActiveCat(cat);
    fetchServices(cat);
  };

  // Refetch when region filter changes
  useEffect(() => {
    if (activeCat) fetchServices(activeCat);
  }, [regionFilter]);

  const addToSelected = (svc: Service) => {
    const defaultTod: TimeOfDay = DEFAULT_TOD[svc.category] || "morning";
    setSelected((prev) => [...prev, { service: svc, date: checkIn, startTime: "10:00", endTime: "12:00", timeOfDay: defaultTod, customTime: "" }]);
  };

  const removeFromSelected = (idx: number) => {
    setSelected((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTod = (idx: number, tod: TimeOfDay) => {
    setSelected((prev) => prev.map((s, i) => i === idx ? { ...s, timeOfDay: tod } : s));
  };

  const updateCustomTime = (idx: number, time: string) => {
    setSelected((prev) => prev.map((s, i) => i === idx ? { ...s, customTime: time } : s));
  };

  const calcTotal = (svc: Service) => {
    if (svc.price_unit === "per_person") return svc.price * guests;
    if (svc.price_unit === "per_hour") return svc.price * 2; // default 2h
    return svc.price;
  };

  const totalExtra = selected.reduce((sum, s) => sum + calcTotal(s.service), 0);
  useEffect(() => { onExtraChange?.(totalExtra); }, [totalExtra, onExtraChange]);

  const todLabel = (tod: TimeOfDay): string => {
    if (tod === "morning") return "🌅";
    if (tod === "evening") return "🌙";
    return "🕐";
  };

  const titleText = u.enhanceVisit;
  const btnText = u.addServicesBtn;
  const totalText = u.extraTotal;
  const noneText = u.noServicesInCat;
  const addText = u.addBtn;
  const todText = u.timeOfDay;
  const morningText = u.morning;
  const eveningText = u.evening;
  const customTimeText = u.customTime;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{titleText}</h3>
        {totalExtra > 0 && (
          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-bold">{totalText}: ${totalExtra}</span>
        )}
      </div>

      {!expanded ? (
        <button onClick={() => setExpanded(true)}
          className="px-4 py-2.5 rounded-full border-2 border-orange-300 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition">
          ✨ {btnText}
        </button>
      ) : (
        <div>
          {/* Category icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SVC_CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => onCatClick(c.key)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition ${activeCat === c.key ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                style={activeCat === c.key ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
              >
                {c.icon}
              </button>
            ))}
          </div>

          {/* Region filter toggle */}
          {activeCat && !loading && (
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setRegionFilter("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${regionFilter === "all" ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
                style={regionFilter === "all" ? { background: "#D4001A" } : {}}
              >
                {lang === "ru" ? "Все" : "All"}
              </button>
              <button
                onClick={() => setRegionFilter("nearby")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${regionFilter === "nearby" ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
                style={regionFilter === "nearby" ? { background: "#D4001A" } : {}}
              >
                {lang === "ru" ? "Рядом" : "Nearby"}
              </button>
            </div>
          )}

          {/* Services in category */}
          {loading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            </div>
          )}

          {!loading && activeCat && services.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">{noneText}</p>
          )}

          {!loading && services.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {services.map((svc) => (
                <div key={svc.id} className="border border-gray-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{svc.title}</p>
                    <p className="text-xs text-gray-500">${svc.price} · {svc.price_unit}</p>
                  </div>
                  <button onClick={() => addToSelected(svc)}
                    className="ml-2 px-3 py-1.5 rounded-full text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}
                  >{addText}</button>
                </div>
              ))}
            </div>
          )}

          {/* Selected services */}
          {selected.length > 0 && (
            <div className="border-t border-gray-100 pt-3 space-y-3">
              {selected.map((s, idx) => (
                <div key={idx} className="bg-orange-50/50 rounded-lg px-3 py-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {todLabel(s.timeOfDay)} {s.service.title}
                      </p>
                      <p className="text-xs text-gray-500">${calcTotal(s.service)} · {s.date}</p>
                    </div>
                    <button onClick={() => removeFromSelected(idx)}
                      className="text-red-400 hover:text-red-600 text-xs ml-2 flex-shrink-0">✕</button>
                  </div>
                  {/* Time-of-day selector */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-medium">{todText}:</span>
                    {(["morning", "evening", "custom"] as TimeOfDay[]).map((td) => (
                      <button key={td} type="button" onClick={() => updateTod(idx, td)}
                        className={`px-2 py-1 rounded-full text-[10px] font-medium transition ${
                          s.timeOfDay === td
                            ? "text-white"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                        }`}
                        style={s.timeOfDay === td ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
                      >
                        {td === "morning" ? morningText : td === "evening" ? eveningText : customTimeText}
                      </button>
                    ))}
                    {s.timeOfDay === "custom" && (
                      <input
                        type="time"
                        value={s.customTime}
                        onChange={(e) => updateCustomTime(idx, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-gray-200 text-[10px] outline-none focus:border-orange-400"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
