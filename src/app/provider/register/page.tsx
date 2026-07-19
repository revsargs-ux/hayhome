"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";

const CATEGORIES = [
  { key: "photo", icon: "📸", label: { ru: "Фото", en: "Photo", hy: "Լուսանկար", fr: "Photo", de: "Foto", es: "Foto", it: "Foto", ar: "صور", zh: "摄影", fa: "عکس" } },
  { key: "video", icon: "🎥", label: { ru: "Видео", en: "Video", hy: "Տեսանկար", fr: "Vidéo", de: "Video", es: "Vídeo", it: "Video", ar: "فيديو", zh: "视频", fa: "ویدیو" } },
  { key: "music", icon: "🎵", label: { ru: "Музыка", en: "Music", hy: "Երաժշտություն", fr: "Musique", de: "Musik", es: "Música", it: "Musica", ar: "موسيقى", zh: "音乐", fa: "موسیقی" } },
  { key: "costume", icon: "👗", label: { ru: "Костюмы", en: "Costumes", hy: "Հագուստ", fr: "Costumes", de: "Kostüme", es: "Disfraces", it: "Costumi", ar: "أزياء", zh: "服装", fa: "لباس" } },
  { key: "decor", icon: "🎨", label: { ru: "Оформление", en: "Decor", hy: "Դեկոր", fr: "Décoration", de: "Dekoration", es: "Decoración", it: "Decorazione", ar: "ديكور", zh: "装饰", fa: "تزئین" } },
  { key: "dance", icon: "💃", label: { ru: "Танцы", en: "Dance", hy: "Պար", fr: "Danse", de: "Tanz", es: "Baile", it: "Danza", ar: "رقص", zh: "舞蹈", fa: "رقص" } },
  { key: "guide", icon: "🗺️", label: { ru: "Гид", en: "Guide", hy: "Ուղեկցորդ", fr: "Guide", de: "Führer", es: "Guía", it: "Guida", ar: "مرشد", zh: "导游", fa: "راهنما" } },
  { key: "chef", icon: "👨‍🍳", label: { ru: "Повар", en: "Chef", hy: "Խոհարար", fr: "Chef", de: "Koch", es: "Chef", it: "Cuoco", ar: "طاهي", zh: "厨师", fa: "آشپز" } },
];

const REGIONS = [
  "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

const PRICE_UNITS = [
  { key: "per_hour", label: { ru: "В час", en: "Per hour", hy: "Ժամում", fr: "Par heure", de: "Pro Stunde", es: "Por hora", it: "All'ora", ar: "بالساعة", zh: "每小时", fa: "در ساعت" } },
  { key: "per_event", label: { ru: "За мероприятие", en: "Per event", hy: "Միջոցառման", fr: "Par événement", de: "Pro Event", es: "Por evento", it: "Per evento", ar: "لكل حدث", zh: "每次活动", fa: "در هر رویداد" } },
  { key: "per_person", label: { ru: "За гостя", en: "Per person", hy: "Հյուրի", fr: "Par personne", de: "Pro Person", es: "Por persona", it: "Per persona", ar: "لكل شخص", zh: "每人", fa: "هر نفر" } },
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const u = getUI(lang);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    category: "" as string,
    customCategory: "",
    title: "",
    description: "",
    price: 50,
    price_unit: "per_event",
    region: "",
    photos: [] as string[],
  });
  const [photoInput, setPhotoInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from auth
  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
    }
  }, [user]);

  const T = {
    title: { ru: "Стать специалистом", en: "Become a Provider", hy: "Մասնագետ դարձեք", fr: "Devenir prestataire", de: "Anbieter werden", es: "Convertirse en proveedor", it: "Diventa fornitore", ar: "كن مقدم خدمة", zh: "成为服务提供商", fa: "ارائه‌دهنده شوید" },
    sub: { ru: "Предлагайте свои услуги гостям Армении", en: "Offer your services to Armenia's guests", hy: "Առաջարկեք ձեր ծառայությունները", fr: "Offrez vos services aux voyageurs", de: "Bieten Sie Ihre Dienste an", es: "Ofrezca sus servicios", it: "Offri i tuoi servizi", ar: "قدم خدماتك للضيوف", zh: "向客人提供服务", fa: "خدمات خود را ارائه دهید" },
    name: { ru: "Ваше имя", en: "Your name", hy: "Ձեր անունը", fr: "Votre nom", de: "Ihr Name", es: "Tu nombre", it: "Il tuo nome", ar: "اسمك", zh: "你的名字", fa: "نام شما" },
    email: { ru: "Email", en: "Email", hy: "Էլ. փոստ", fr: "Email", de: "E-Mail", es: "Correo", it: "Email", ar: "بريد", zh: "邮箱", fa: "ایمیل" },
    password: { ru: "Пароль (если новый)", en: "Password (if new)", hy: "Գաղտնաբառ", fr: "Mot de passe", de: "Passwort", es: "Contraseña", it: "Password", ar: "كلمة المرور", zh: "密码", fa: "رمز عبور" },
    category: { ru: "Категория", en: "Category", hy: "Կատեգորիա", fr: "Catégorie", de: "Kategorie", es: "Categoría", it: "Categoria", ar: "فئة", zh: "类别", fa: "دسته" },
    customCat: { ru: "Своя категория", en: "Custom category", hy: "Սեփական", fr: "Catégorie personnalisée", de: "Eigene Kategorie", es: "Categoría personalizada", it: "Categoria personalizzata", ar: "فئة مخصصة", zh: "自定义类别", fa: "دسته سفارشی" },
    serviceTitle: { ru: "Название услуги", en: "Service title", hy: "Ծառայության անվանում", fr: "Titre du service", de: "Dienstleistung", es: "Título del servicio", it: "Titolo servizio", ar: "عنوان الخدمة", zh: "服务名称", fa: "عنوان خدمت" },
    desc: { ru: "Описание", en: "Description", hy: "Նկարագրություն", fr: "Description", de: "Beschreibung", es: "Descripción", it: "Descrizione", ar: "وصف", zh: "描述", fa: "توضیحات" },
    price: { ru: "Цена ($)", en: "Price ($)", hy: "Գին ($)", fr: "Prix ($)", de: "Preis ($)", es: "Precio ($)", it: "Prezzo ($)", ar: "السعر ($)", zh: "价格 ($)", fa: "قیمت ($)" },
    region: { ru: "Регион", en: "Region", hy: "Մարզ", fr: "Région", de: "Region", es: "Región", it: "Regione", ar: "منطقة", zh: "地区", fa: "منطقه" },
    selectRegion: { ru: "Выберите регион", en: "Select region", hy: "Ընտրեք մարզը", fr: "Sélectionner", de: "Region wählen", es: "Seleccionar", it: "Seleziona", ar: "اختر", zh: "选择地区", fa: "انتخاب" },
    photos: { ru: "Фото работ (URL)", en: "Portfolio photos (URL)", hy: "Լուսանկարներ", fr: "Photos (URL)", de: "Fotos (URL)", es: "Fotos (URL)", it: "Foto (URL)", ar: "صور (URL)", zh: "作品照片 (URL)", fa: "نمونه کارها (URL)" },
    addPhoto: { ru: "Добавить фото", en: "Add photo", hy: "Ավելացնել", fr: "Ajouter", de: "Hinzufügen", es: "Añadir", it: "Aggiungi", ar: "إضافة", zh: "添加", fa: "افزودن" },
    submit: { ru: "Зарегистрироваться", en: "Register", hy: "Գրանցվել", fr: "S'inscrire", de: "Registrieren", es: "Registrarse", it: "Registrati", ar: "تسجيل", zh: "注册", fa: "ثبت‌نام" },
    submitting: { ru: "Регистрация...", en: "Registering...", hy: "Գրանցում...", fr: "Inscription...", de: "Registrierung...", es: "Registrando...", it: "Registrazione...", ar: "جار التسجيل...", zh: "注册中...", fa: "در حال ثبت..." },
  };
  const t = (k: keyof typeof T): string => (T[k] as Record<string, string>)[lang] || (T[k] as Record<string, string>).en;

  const toggleCategory = (key: string) => {
    setForm((f) => ({ ...f, category: f.category === key ? "" : key }));
  };

  const addPhoto = () => {
    const url = photoInput.trim();
    if (url && form.photos.length < 10) {
      setForm((f) => ({ ...f, photos: [...f.photos, url] }));
      setPhotoInput("");
    }
  };

  const removePhoto = (idx: number) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // If not logged in, register first
      if (!user) {
        if (!form.name || !form.email || !form.password) {
          setError(t("name") + ", Email, " + t("password"));
          setLoading(false);
          return;
        }
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: "provider" }),
        });
        if (!regRes.ok) {
          const err = await regRes.json().catch(() => ({}));
          setError(err.error || "Registration failed");
          setLoading(false);
          return;
        }
      } else {
        // Already logged in — update role if needed via creating service
      }

      // Determine category
      let finalCategory = form.category;
      if (!finalCategory && form.customCategory.trim()) {
        finalCategory = "custom";
      }
      if (!finalCategory) {
        setError(t("category"));
        setLoading(false);
        return;
      }

      // Create service
      const svcRes = await fetch("/api/services", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: finalCategory,
          title: form.title,
          description: form.description,
          price: form.price,
          price_unit: form.price_unit,
          region: form.region,
          photos: form.photos,
          available: true,
        }),
      });

      if (!svcRes.ok) {
        const err = await svcRes.json().catch(() => ({}));
        setError(err.error || "Failed to create service");
        setLoading(false);
        return;
      }

      router.push("/provider/dashboard");
    } catch {
      setError("Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm mb-4 inline-block">← {lang === "ru" ? "На главную" : lang === "hy" ? "Գլխավոր" : lang === "fr" ? "Accueil" : lang === "de" ? "Startseite" : lang === "es" ? "Inicio" : lang === "it" ? "Home" : lang === "ar" ? "الرئيسية" : lang === "zh" ? "首页" : lang === "fa" ? "خانه" : "Home"}</Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">✨ {t("title")}</h1>
          <p className="text-gray-500 text-sm mb-6">{t("sub")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Auth fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("name")} *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  disabled={!!user}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("email")} *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={!!user}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 disabled:bg-gray-50" />
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("password")} *</label>
                <input required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900" />
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t("category")} *</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleCategory(c.key)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition ${form.category === c.key ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    style={form.category === c.key ? { background: "linear-gradient(135deg, #C45D3E, #D4A04A)" } : {}}
                  >
                    {c.icon} {c.label[lang] || c.label.en}
                  </button>
                ))}
              </div>
              {/* Custom category */}
              {!form.category && (
                <input
                  value={form.customCategory}
                  onChange={(e) => setForm((f) => ({ ...f, customCategory: e.target.value }))}
                  placeholder={t("customCat")}
                  className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400"
                />
              )}
            </div>

            {/* Service title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("serviceTitle")} *</label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("desc")}</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 resize-none" />
            </div>

            {/* Price + unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("price")} *</label>
                <input required type="number" min={1} max={10000} value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("price")}</label>
                <select value={form.price_unit} onChange={(e) => setForm((f) => ({ ...f, price_unit: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 bg-white">
                  {PRICE_UNITS.map((u) => (
                    <option key={u.key} value={u.key}>{u.label[lang] || u.label.en}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("region")} *</label>
              <select required value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-400 text-gray-900 bg-white">
                <option value="">{t("selectRegion")}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("photos")}</label>
              <div className="flex gap-2">
                <input value={photoInput} onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://..."
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhoto(); } }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400" />
                <button type="button" onClick={addPhoto}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                  {t("addPhoto")}
                </button>
              </div>
              {form.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.photos.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt="Uploaded photo" className="w-20 h-20 rounded-lg object-cover" />
                      <button type="button" onClick={() => removePhoto(idx)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #C45D3E, #D4A04A)" }}>
              {loading ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
