"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { regionName } from "@/lib/i18n-utils";

const CATEGORY_KEYS = ["events", "food", "tour", "culture", "music", "custom"];
const REGIONS = [
  "all", "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

const t = (lang: string, tr: any): Record<string, string> => ({
  allRequests: { ru: "Все запросы", en: "All requests", hy: "Բոլոր հայցերը", fr: "Toutes les demandes", de: "Alle Anfragen", es: "Todas las solicitudes", it: "Tutte le richieste", ar: "جميع الطلبات", zh: "所有请求", fa: "همه درخواست‌ها" }[lang] || "All requests",
  whatLooking: { ru: "Что вы ищете?", en: "What are you looking for?", hy: "Ի՞նչ եք որոնում", fr: "Que cherchez-vous?", de: "Was suchen Sie?", es: "¿Qué busca?", it: "Cosa cerchi?", ar: "ماذا تبحث؟", zh: "您在找什么？", fa: "دنبال چه میگردید؟" }[lang] || "What are you looking for?",
  describeDesc: { ru: "Опишите что хотите — семьи и организаторы сами вам предложат", en: "Describe what you want — hosts and organizers will offer you", hy: "Նկարագրեք ինչ եք ուզում — ընտանիքները և կազմակերպիչները ձեզ կառաջարկեն", fr: "Décrivez ce que vous souhaitez — les familles et organisateurs vous feront des offres", de: "Beschreiben Sie was Sie wollen — Familien und Organisatoren werden es Ihnen anbieten", es: "Describa lo que desea — las familias y organizadores se lo ofrecerán", it: "Descrivi cosa cerchi — le famiglie e gli organizzatori ti faranno offerte", ar: "صف ما تريد — العائلات والمنظمون سيقدمون لك العروض", zh: "描述您的需求 — 家庭和组织者会主动向您推荐", fa: "توضیح دهید چه میخواهید — خانواده‌ها و برگزارکنندگان به شما پیشنهاد میدهند" }[lang] || "Describe what you want",
  title: { ru: "Название", en: "Title", hy: "Անվանում", fr: "Titre", de: "Titel", es: "Título", it: "Titolo", ar: "العنوان", zh: "标题", fa: "عنوان" }[lang] || "Title",
  titlePh: { ru: "Напр: Ищу семью для отдыха на выходные", en: "E.g.: Looking for a family for weekend stay", hy: "Օրինակ՝ Երեկվան հանգիստի համար ընտանիք եմ որոնում", fr: "Ex: Je cherche une famille pour le week-end", de: "Z.B.: Familie für Wochenendaufenthalt gesucht", es: "Ej: Busco una familia para el fin de semana", it: "Es: Cerco una famiglia per il weekend", ar: "مثال: أبحث عن عائلة للعطلة نهاية الأسبوع", zh: "例如：找周末家庭住宿", fa: "مثال: دنبال خانواده برای آخر هفته" }[lang] || "",
  description: { ru: "Описание", en: "Description", hy: "Նկարագրություն", fr: "Description", de: "Beschreibung", es: "Descripción", it: "Descrizione", ar: "الوصف", zh: "描述", fa: "توضیحات" }[lang] || "Description",
  descPh: { ru: "Подробно опишите что вам нужно...", en: "Describe what you need in detail...", hy: "Մանրամասն նկարագրեք ինչ եք պետք...", fr: "Décrivez vos besoins en détail...", de: "Beschreiben Sie im Detail was Sie brauchen...", es: "Describa con detalle lo que necesita...", it: "Descrivi in dettaglio cosa ti serve...", ar: "صف بالتفصيل ما تحتاج...", zh: "详细描述您的需求...", fa: "به طور مفصل توضیح دهید چه نیاز دارید..." }[lang] || "",
  category: { ru: "Категория", en: "Category", hy: "Կատեգորիա", fr: "Catégorie", de: "Kategorie", es: "Categoría", it: "Categoria", ar: "الفئة", zh: "类别", fa: "دسته‌بندی" }[lang] || "Category",
  region: { ru: "Регион", en: "Region", hy: "Մարզ", fr: "Région", de: "Region", es: "Región", it: "Regione", ar: "المنطقة", zh: "地区", fa: "منطقه" }[lang] || "Region",
  dateFrom: { ru: "Дата заезда", en: "Date from", hy: "Ամսաթիվ (ից)", fr: "Date d'arrivée", de: "Anreise", es: "Fecha desde", it: "Data da", ar: "تاريخ الوصول", zh: "入住日期", fa: "تاریخ شروع" }[lang] || "Date from",
  dateTo: { ru: "Дата выезда", en: "Date to", hy: "Ամսաթիվ (մինչև)", fr: "Date de départ", de: "Abreise", es: "Fecha hasta", it: "Data a", ar: "تاريخ المغادرة", zh: "退房日期", fa: "تاریخ پایان" }[lang] || "Date to",
  guests: { ru: "Кол-во гостей", en: "Guests", hy: "Հյուրերի քանակ", fr: "Nombre de personnes", de: "Gästeanzahl", es: "Huéspedes", it: "Ospiti", ar: "عدد الضيوف", zh: "客人数", fa: "تعداد مهمان" }[lang] || "Guests",
  budget: { ru: "Бюджет", en: "Budget", hy: "Բյուջե", fr: "Budget", de: "Budget", es: "Presupuesto", it: "Budget", ar: "الميزانية", zh: "预算", fa: "بودجه" }[lang] || "Budget",
  submitting: { ru: "Отправка...", en: "Submitting...", hy: "Ուղարկում...", fr: "Envoi en cours...", de: "Wird gesendet...", es: "Enviando...", it: "Invio in corso...", ar: "جاري الإرسال...", zh: "提交中...", fa: "در حال ارسال..." }[lang] || "Submitting...",
  submitRequest: { ru: "Отправить запрос", en: "Submit Request", hy: "Ուղարկել հայց", fr: "Envoyer la demande", de: "Anfrage senden", es: "Enviar solicitud", it: "Invia richiesta", ar: "إرسال الطلب", zh: "提交请求", fa: "ارسال درخواست" }[lang] || "Submit Request",
  fillRequired: { ru: "Заполните название и описание", en: "Fill in title and description", hy: "Լցարկեք անվանումը և նկարագրությունը", fr: "Remplissez le titre et la description", de: "Füllen Sie Titel und Beschreibung aus", es: "Rellene el título y la descripción", it: "Compilare titolo e descrizione", ar: "املأ العنوان والوصف", zh: "请填写标题和描述", fa: "عنوان و توضیحات را پر کنید" }[lang] || "Fill in title and description",
  requestCreated: { ru: "Запрос создан!", en: "Request Created!", hy: "Հայցը ստեղծվեց!", fr: "Demande créée!", de: "Anfrage erstellt!", es: "¡Solicitud creada!", it: "Richiesta creata!", ar: "تم إنشاء الطلب!", zh: "请求已创建！", fa: "درخواست ایجاد شد!" }[lang] || "Request Created!",
  viewRequest: { ru: "Открыть запрос", en: "View Request", hy: "Բացել հայցը", fr: "Voir la demande", de: "Anfrage ansehen", es: "Ver solicitud", it: "Visualizza richiesta", ar: "عرض الطلب", zh: "查看请求", fa: "مشاهده درخواست" }[lang] || "View Request",
  recServices: { ru: "🎯 Рекомендуемые услуги", en: "🎯 Recommended Services", hy: "🎯 Առաջարկվող ծառայություններ", fr: "🎯 Services recommandés", de: "🎯 Empfohlene Dienste", es: "🎯 Servicios recomendados", it: "🎯 Servizi consigliati", ar: "🎯 الخدمات الموصى بها", zh: "🎯 推荐服务", fa: "🎯 خدمات پیشنهادی" }[lang] || "Recommended Services",
  recHosts: { ru: "🏠 Рекомендуемые семьи", en: "🏠 Recommended Hosts", hy: "🏠 Առաջարկվող ընտանիքներ", fr: "🏠 Familles recommandées", de: "🏠 Empfohlene Familien", es: "🏠 Familias recomendadas", it: "🏠 Famiglie consigliate", ar: "🏠 العائلات الموصى بها", zh: "🏠 推荐家庭", fa: "🏠 خانواده‌های پیشنهادی" }[lang] || "Recommended Hosts",
  noServices: { ru: "Услуги не найдены", en: "No services found", hy: "Ծառայություններ չեն գտնվել", fr: "Aucun service trouvé", de: "Keine Dienste gefunden", es: "No se encontraron servicios", it: "Nessun servizio trovato", ar: "لم يتم العثور على خدمات", zh: "未找到服务", fa: "خدمتی یافت نشد" }[lang] || "No services found",
  noHosts: { ru: "Семьи не найдены", en: "No hosts found", hy: "Ընտանիքներ չեն գտնվել", fr: "Aucune famille trouvée", de: "Keine Familien gefunden", es: "No se encontraron familias", it: "Nessuna famiglia trovata", ar: "لم يتم العثور على عائلات", zh: "未找到家庭", fa: "خانواده‌ای یافت نشد" }[lang] || "No hosts found",
  night: { ru: "ночь", en: "night", hy: "գիշեր", fr: "nuit", de: "Nacht", es: "noche", it: "notte", ar: "ليلة", zh: "晚", fa: "شب" }[lang] || "night",
});

interface Recommendation {
  services: Array<{ id: string; title: string; description: string; price: number; category: string; region: string }>;
  hosts: Array<{ id: string; familyName: string; pricePerNight: number; region: string; city: string; coverPhoto: string; rating: number; maxGuests: number }>;
}

export default function NewRequestPage() {
  const { lang, tr } = useLang();
  const u = getUI(lang);
  const l = t(lang, tr);

  const [form, setForm] = useState({
    title: "", description: "", category: "events", region: "all",
    date_from: "", date_to: "", guests_count: 1, budget: "", budget_currency: "USD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ id: string; title: string } | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  const req = (tr as any).requests || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError(l.fillRequired);
      return;
    }
    setSubmitting(true);
    setError("");
    const finalForm = { ...form };
    if (!finalForm.date_to && finalForm.date_from) finalForm.date_to = finalForm.date_from;
    try {
      const res = await fetch("/api/requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...finalForm, budget: finalForm.budget ? `${finalForm.budget} ${finalForm.budget_currency}` : "" }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed"); }
      const data = await res.json();
      setCreated({ id: data.id, title: data.title });
      try {
        const recRes = await fetch("/api/requests/recommend", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title, description: form.description, region: form.region, category: form.category }),
        });
        if (recRes.ok) setRecommendations(await recRes.json());
      } catch { /* optional */ }
    } catch (err: any) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (created && recommendations !== null) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">✓</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{l.requestCreated}</h2>
                <p className="text-gray-500 text-sm">{created.title}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Link href={`/requests/${created.id}`} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {l.viewRequest} →
              </Link>
              <Link href="/requests" className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium">
                {l.allRequests}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{l.recServices}</h3>
              {recommendations?.services?.length ? (
                <div className="space-y-3">{recommendations.services.map((s) => (
                  <Link key={s.id} href={`/services#${s.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow block">
                    <div className="flex items-start justify-between gap-2"><h4 className="font-semibold text-gray-900 text-sm">{s.title}</h4><span className="text-sm font-bold text-red-600">${s.price}</span></div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    <div className="flex gap-2 mt-2 text-xs text-gray-400"><span>{s.category}</span>{s.region && <span>• {s.region}</span>}</div>
                  </Link>
                ))}</div>
              ) : <p className="text-gray-400 text-sm">{l.noServices}</p>}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{l.recHosts}</h3>
              {recommendations?.hosts?.length ? (
                <div className="space-y-3">{recommendations.hosts.map((h) => (
                  <Link key={h.id} href={`/hosts/${h.id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow block">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {h.coverPhoto && <img src={h.coverPhoto} alt={h.familyName} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{h.familyName}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span>{regionName(h.region, lang)}</span>
                          {h.rating > 0 && <span>⭐ {h.rating.toFixed(1)}</span>}
                        </div>
                        <p className="text-sm font-bold text-red-600 mt-0.5">${h.pricePerNight}<span className="text-xs text-gray-400 font-normal">/{l.night}</span></p>
                      </div>
                    </div>
                  </Link>
                ))}</div>
              ) : <p className="text-gray-400 text-sm">{l.noHosts}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/requests" className="text-sm text-gray-500 hover:text-gray-700">← {l.allRequests}</Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{l.whatLooking}</h1>
          <p className="text-gray-500 text-sm mt-1">{l.describeDesc}</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{l.title} *</label>
            <input type="text" required maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={l.titlePh} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{l.description} *</label>
            <textarea required rows={4} maxLength={3000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={l.descPh} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 resize-y" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{l.category}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400">
                {CATEGORY_KEYS.map((c) => <option key={c} value={c}>{req[c] || c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{l.region}</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400">
                {REGIONS.map((r) => <option key={r} value={r}>{regionName(r, lang)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{l.dateFrom}</label>
              <input type="date" value={form.date_from} onChange={(e) => { const d = e.target.value; setForm(f => ({ ...f, date_from: d, date_to: f.date_to || d })); }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{l.dateTo}</label>
              <input type="date" value={form.date_to} onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{l.guests}</label>
            <input type="text" inputMode="numeric" value={form.guests_count || ""} onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ""); setForm({ ...form, guests_count: v ? parseInt(v) : 0 }); }}
              onBlur={() => { if (!form.guests_count || form.guests_count < 1) setForm({ ...form, guests_count: 1 }); }} placeholder="1"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{l.budget}</label>
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value.replace(/[^0-9]/g, "") })} placeholder="100"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400" />
              <select value={form.budget_currency} onChange={(e) => setForm({ ...form, budget_currency: e.target.value })}
                className="px-2 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white flex-shrink-0">
                <option value="USD">$</option><option value="EUR">€</option><option value="AMD">֏</option><option value="RUB">₽</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {submitting ? l.submitting : l.submitRequest}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
