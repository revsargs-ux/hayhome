"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Trash2, Edit2, Plus, Check, X, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import type { Service, ServiceBooking } from "@/lib/types";

const CATEGORIES = [
  { key: "photo", icon: "📸" },
  { key: "video", icon: "🎥" },
  { key: "music", icon: "🎵" },
  { key: "costume", icon: "👗" },
  { key: "decor", icon: "🎨" },
  { key: "dance", icon: "💃" },
  { key: "guide", icon: "🗺️" },
  { key: "chef", icon: "👨‍🍳" },
  { key: "custom", icon: "✨" },
];

const REGIONS = [
  "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

const PRICE_UNITS = [
  { key: "per_hour", label: "/hour" },
  { key: "per_event", label: "/event" },
  { key: "per_person", label: "/person" },
];

const STATUS_LABELS: Record<string, Record<string, string>> = {
  requested: { ru: "Запрошен", en: "Requested" },
  confirmed: { ru: "Подтверждён", en: "Confirmed" },
  cancelled: { ru: "Отменён", en: "Cancelled" },
  completed: { ru: "Завершён", en: "Completed" },
};

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const u = getUI(lang);

  const [tab, setTab] = useState<"services" | "orders" | "profile">("services");
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customCat, setCustomCat] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    price: 50,
    price_unit: "per_event",
    region: "",
    photos: [] as string[],
    available: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/provider/dashboard");
      return;
    }
    if (user && user.role !== "provider" && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (user) loadData();
  }, [user, authLoading]);

  const loadData = async () => {
    setLoading(true);
    const [svcRes, ordRes] = await Promise.all([
      fetch("/api/services?provider=me", { credentials: "include" }),
      fetch("/api/service-bookings", { credentials: "include" }),
    ]);
    const svcData = await svcRes.json();
    const ordData = await ordRes.json();
    setServices(Array.isArray(svcData) ? svcData : []);
    setOrders(Array.isArray(ordData) ? ordData : []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ category: "", title: "", description: "", price: 50, price_unit: "per_event", region: "", photos: [], available: true });
    setEditingId(null);
    setCustomCat("");
    setShowForm(false);
  };

  const startEdit = (svc: Service) => {
    setForm({
      category: svc.category,
      title: svc.title,
      description: svc.description,
      price: svc.price,
      price_unit: svc.price_unit,
      region: svc.region,
      photos: svc.photos,
      available: svc.available,
    });
    setEditingId(svc.id);
    setShowForm(true);
  };

  const saveService = async () => {
    setSaving(true);
    let finalCategory = form.category;
    if (!finalCategory && customCat.trim()) finalCategory = "custom";

    if (!finalCategory || !form.title || !form.region) {
      setSaving(false);
      return;
    }

    const body = { ...form, category: finalCategory };
    const url = editingId ? "/api/services" : "/api/services";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...body, id: editingId } : body),
    });

    if (res.ok) {
      await loadData();
      resetForm();
    }
    setSaving(false);
  };

  const deleteService = async (id: string) => {
    if (!confirm(u.deleteServiceConfirm)) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE", credentials: "include" });
    await loadData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch("/api/service-bookings", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await loadData();
  };

  const getCatIcon = (cat: string): string => {
    const c = CATEGORIES.find((c) => c.key === cat);
    return c ? c.icon : "✨";
  };

  // Localization
  const T = {
    myServices: { ru: "Мои услуги", en: "My Services", hy: "Իմ ծառայությունները", fr: "Mes services", de: "Meine Dienste", es: "Mis servicios", it: "I miei servizi", ar: "خدماتي", zh: "我的服务", fa: "خدمات من" },
    orders: { ru: "Заказы", en: "Orders", hy: "Պատվերներ", fr: "Commandes", de: "Bestellungen", es: "Pedidos", it: "Ordini", ar: "الطلبات", zh: "订单", fa: "سفارشات" },
    profile: { ru: "Профиль", en: "Profile", hy: "Պրոֆիլ", fr: "Profil", de: "Profil", es: "Perfil", it: "Profilo", ar: "الملف", zh: "资料", fa: "پروفایل" },
    addService: { ru: "Добавить услугу", en: "Add Service", hy: "Ավելացնել", fr: "Ajouter", de: "Hinzufügen", es: "Añadir", it: "Aggiungi", ar: "إضافة", zh: "添加", fa: "افزودن" },
    noServices: { ru: "У вас пока нет услуг", en: "No services yet", hy: "Ծառայություններ չկան", fr: "Aucun service", de: "Keine Dienste", es: "Sin servicios", it: "Nessun servizio", ar: "لا خدمات", zh: "暂无服务", fa: "خدماتی نیست" },
    noOrders: { ru: "Заказов пока нет", en: "No orders yet", hy: "Պատվերներ չկան", fr: "Aucune commande", de: "Keine Bestellungen", es: "Sin pedidos", it: "Nessun ordine", ar: "لا طلبات", zh: "暂无订单", fa: "سفارشی نیست" },
    title: { ru: "Название", en: "Title", hy: "Վերնագիր", fr: "Titre", de: "Titel", es: "Título", it: "Titolo", ar: "عنوان", zh: "标题", fa: "عنوان" },
    price: { ru: "Цена", en: "Price", hy: "Գին", fr: "Prix", de: "Preis", es: "Precio", it: "Prezzo", ar: "سعر", zh: "价格", fa: "قیمت" },
    category: { ru: "Категория", en: "Category", hy: "Կատեգորիա", fr: "Catégorie", de: "Kategorie", es: "Categoría", it: "Categoria", ar: "فئة", zh: "类别", fa: "دسته" },
    save: { ru: "Сохранить", en: "Save", hy: "Պահպանել", fr: "Enregistrer", de: "Speichern", es: "Guardar", it: "Salva", ar: "حفظ", zh: "保存", fa: "ذخیره" },
    cancel: { ru: "Отмена", en: "Cancel", hy: "Չեղարկել", fr: "Annuler", de: "Abbrechen", es: "Cancelar", it: "Annulla", ar: "إلغاء", zh: "取消", fa: "لغو" },
    confirm: { ru: "Подтвердить", en: "Confirm", hy: "Հաստատել", fr: "Confirmer", de: "Bestätigen", es: "Confirmar", it: "Conferma", ar: "تأكيد", zh: "确认", fa: "تأیید" },
    desc: { ru: "Описание", en: "Description", hy: "Նկարագրություն", fr: "Description", de: "Beschreibung", es: "Descripción", it: "Descrizione", ar: "وصف", zh: "描述", fa: "توضیحات" },
    region: { ru: "Регион", en: "Region", hy: "Մարզ", fr: "Région", de: "Region", es: "Región", it: "Regione", ar: "منطقة", zh: "地区", fa: "منطقه" },
    selectRegion: { ru: "Выберите регион", en: "Select region", hy: "Ընտրեք", fr: "Sélectionner", de: "Wählen", es: "Seleccionar", it: "Seleziona", ar: "اختر", zh: "选择", fa: "انتخاب" },
    customCat: { ru: "Своя категория", en: "Custom category", hy: "Սեփական", fr: "Catégorie pers.", de: "Eigene", es: "Personalizada", it: "Personalizzata", ar: "مخصصة", zh: "自定义", fa: "سفارشی" },
    available: { ru: "Доступно", en: "Available", hy: "Հասանելի", fr: "Disponible", de: "Verfügbar", es: "Disponible", it: "Disponibile", ar: "متاح", zh: "可用", fa: "موجود" },
  };
  const t = (k: keyof typeof T): string => (T[k] as Record<string, string>)[lang] || (T[k] as Record<string, string>).en;
  const statusLabel = (s: string) => (STATUS_LABELS[s] || STATUS_LABELS.requested)[lang] || (STATUS_LABELS[s] || STATUS_LABELS.requested).en;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            🔧 {u.providerDashboard}
          </h1>
          <button onClick={loadData} className="text-gray-400 hover:text-gray-600">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {([
            { key: "services", label: t("myServices") },
            { key: "orders", label: t("orders") },
            { key: "profile", label: t("profile") },
          ] as const).map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px ${tab === tb.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tb.label}
              {tb.key === "orders" && orders.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs">{orders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Services Tab */}
        {tab === "services" && (
          <div>
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="mb-4 px-4 py-2.5 rounded-full text-white text-sm font-semibold transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}>
                <Plus size={16} className="inline mr-1" /> {t("addService")}
              </button>
            )}

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("title")} *</label>
                    <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("category")} *</label>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORIES.map((c) => (
                        <button key={c.key} type="button" onClick={() => setForm((f) => ({ ...f, category: f.category === c.key ? "" : c.key }))}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${form.category === c.key ? "text-white" : "bg-gray-100 text-gray-600"}`}
                          style={form.category === c.key ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}>
                          {c.icon} {c.key}
                        </button>
                      ))}
                    </div>
                    {!form.category && (
                      <input value={customCat} onChange={(e) => setCustomCat(e.target.value)}
                        placeholder={t("customCat")}
                        className="mt-1.5 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("price")} ($)</label>
                    <input type="number" min={1} value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("region")}</label>
                    <select value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 bg-white">
                      <option value="">{t("selectRegion")}</option>
                      {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("desc")}</label>
                    <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 resize-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price unit</label>
                    <select value={form.price_unit} onChange={(e) => setForm((f) => ({ ...f, price_unit: e.target.value }))}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400 bg-white">
                      {PRICE_UNITS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="available" checked={form.available}
                      onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} />
                    <label htmlFor="available" className="text-sm text-gray-700">{t("available")}</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={saveService} disabled={saving}
                    className="px-5 py-2.5 rounded-full text-white text-sm font-semibold disabled:opacity-70"
                    style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}>
                    {saving ? "..." : t("save")}
                  </button>
                  <button onClick={resetForm}
                    className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold">
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}

            {/* Services list */}
            {services.length === 0 && !showForm ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-500">{t("noServices")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-28 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-3xl">
                      {getCatIcon(svc.category)}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{svc.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${svc.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {svc.available ? "●" : "○"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">{svc.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <span>${svc.price}</span>
                        <span>·</span>
                        <span>{svc.region}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(svc)}
                          className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 flex items-center justify-center gap-1">
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => deleteService(svc.id)}
                          className="py-2 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500">{t("noOrders")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => {
                  const svcTitle = ord.service?.title || "Service";
                  const svcCat = ord.service?.category || "custom";
                  return (
                    <div key={ord.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl">
                          {getCatIcon(svcCat)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{svcTitle}</p>
                          <p className="text-xs text-gray-500">
                            📅 {ord.date} · ⏰ {ord.start_time}–{ord.end_time} · ${ord.total_price}
                          </p>
                          {ord.client_note && (
                            <p className="text-xs text-gray-400 italic mt-0.5">"{ord.client_note}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ord.status === "confirmed" ? "bg-green-100 text-green-700" :
                          ord.status === "cancelled" ? "bg-red-100 text-red-600" :
                          ord.status === "completed" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {statusLabel(ord.status)}
                        </span>
                        {ord.status === "requested" && (
                          <>
                            <button onClick={() => updateOrderStatus(ord.id, "confirmed")}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                              <Check size={14} />
                            </button>
                            <button onClick={() => updateOrderStatus(ord.id, "cancelled")}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}>
                {user.name[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-orange-600 font-semibold capitalize">{user.role}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{t("myServices")}:</span><span className="font-semibold">{services.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t("orders")}:</span><span className="font-semibold">{orders.length}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
