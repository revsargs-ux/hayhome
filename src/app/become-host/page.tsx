"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Sparkles, RotateCcw, Loader2 } from "lucide-react";

const STEPS = ["Контакты", "Локация", "Условия", "Опыт", "Готово"];

const AMENITIES_LIST = [
  "Wi-Fi", "Отдельная комната", "Завтрак", "Ужин", "Полное питание",
  "Горячая вода", "Кондиционер", "Баня", "Огород", "Домашнее вино",
  "Домашнее молоко и сыр", "Вид на природу", "Трансфер", "Стиральная машина",
];

const EXPERIENCES_LIST = [
  "Мастер-класс по долме", "Мастер-класс по гате/кяте", "Дегустация армянских вин",
  "Виноделие", "Сбор трав в горах", "Посещение монастыря", "Экскурсия по городу",
  "Рыбалка", "Приготовление хоровац (шашлык)", "Ткачество карпетов",
  "Гончарное мастерство", "Посещение рынка", "Уход за животными", "Сбор урожая",
];

const LANGUAGES_LIST = ["Армянский", "Русский", "Английский", "Французский", "Немецкий", "Персидский", "Арабский"];

interface AiState {
  loading: boolean;
  original: string | null;
}

export default function BecomeHostPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiDescription, setAiDescription] = useState<AiState>({ loading: false, original: null });
  const [aiLong, setAiLong] = useState<AiState>({ loading: false, original: null });

  const [form, setForm] = useState({
    familyName: "",
    name: "",
    phone: "",
    email: "",
    city: "",
    region: "",
    location: "",
    pricePerNight: 30,
    maxGuests: 2,
    availableRooms: 1,
    description: "",
    longDescription: "",
    amenities: [] as string[],
    experiences: [] as string[],
    languages: ["Армянский"] as string[],
  });

  const set = (field: string, value: unknown) => setForm((f) => ({ ...f, [field]: value }));

  const toggleArr = (field: "amenities" | "experiences" | "languages", val: string) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter((x) => x !== val) : [...f[field], val],
    }));
  };

  // ── ИИ: улучшить текст ──
  const improveWithAI = async (field: "description" | "longDescription") => {
    const text = form[field];
    if (!text || text.trim().length < 10) {
      alert("Сначала напишите текст (минимум 10 символов)");
      return;
    }

    const setState = field === "description" ? setAiDescription : setAiLong;
    const type = field === "description" ? "short" : "long";

    setState({ loading: true, original: text });

    try {
      const res = await fetch("/api/ai/improve-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Ошибка ИИ");
      }

      // Стриминг — обновляем текст по мере поступления
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let improved = "";

      set(field, "");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        improved += decoder.decode(value, { stream: true });
        set(field, improved);
      }

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      alert(`Ошибка: ${msg}`);
      // Восстанавливаем оригинал при ошибке
      setState((prev) => {
        if (prev.original) set(field, prev.original);
        return { loading: false, original: prev.original };
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: false }));
  };

  const restoreOriginal = (field: "description" | "longDescription") => {
    const setState = field === "description" ? setAiDescription : setAiLong;
    const state = field === "description" ? aiDescription : aiLong;
    if (state.original) {
      set(field, state.original);
      setState({ loading: false, original: null });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stars: 1, photos: [], coverPhoto: "" }),
      });
      if (!res.ok) throw new Error("Ошибка при отправке");
      setStep(4);
    } catch {
      setError("Что-то пошло не так. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Принять гостей в HayHome</h1>
          <p className="text-gray-500">Поделитесь армянским гостеприимством с миром</p>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-1 mb-8">
            {STEPS.slice(0, 4).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "text-white" : "bg-gray-200 text-gray-500"}`}
                  style={i <= step ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : {}}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < 3 && <div className={`w-8 h-0.5 mx-1 transition-colors ${i < step ? "bg-red-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

          {/* Step 0: Contacts */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ваши контакты</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название семьи *</label>
                <input value={form.familyName} onChange={(e) => set("familyName", e.target.value)}
                  placeholder="Семья Арутюнян"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ваше имя *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Арутюн Арутюнян"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Телефон *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+374 91 ..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="family@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ваше местоположение</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Город *</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)}
                  placeholder="Ереван"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Регион *</label>
                <select value={form.region} onChange={(e) => set("region", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 bg-white">
                  <option value="">Выберите регион</option>
                  {["Ереван","Арарат","Арагацотн","Гегаркуник","Лори","Котайк","Ширак","Сюник","Вайоц Дзор","Тавуш"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Адрес (улица, дом)</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)}
                  placeholder="ул. Абовяна 12"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
              </div>
            </div>
          )}

          {/* Step 2: Conditions — с ИИ кнопками */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Условия проживания</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Цена за ночь: <strong>${form.pricePerNight}</strong>
                </label>
                <input type="range" min={10} max={150} step={5}
                  value={form.pricePerNight} onChange={(e) => set("pricePerNight", Number(e.target.value))}
                  className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$10</span><span>$150</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Максимум гостей</label>
                  <input type="number" min={1} max={20} value={form.maxGuests}
                    onChange={(e) => set("maxGuests", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Комнат для гостей</label>
                  <input type="number" min={1} max={10} value={form.availableRooms}
                    onChange={(e) => set("availableRooms", Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                </div>
              </div>

              {/* Краткое описание + ИИ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Краткое описание *</label>
                  <div className="flex items-center gap-2">
                    {aiDescription.original && !aiDescription.loading && (
                      <button type="button" onClick={() => restoreOriginal("description")}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <RotateCcw size={12} /> Восстановить
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => improveWithAI("description")}
                      disabled={aiDescription.loading || !form.description.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #D4001A)", color: "white" }}
                    >
                      {aiDescription.loading
                        ? <><Loader2 size={12} className="animate-spin" /> Пишет...</>
                        : <><Sparkles size={12} /> Улучшить с ИИ</>
                      }
                    </button>
                  </div>
                </div>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                  rows={2} placeholder="Тёплая семья в сердце Еревана. Домашняя еда и уют."
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-900 resize-none transition-colors ${aiDescription.loading ? "border-purple-300 bg-purple-50" : "border-gray-200 focus:border-red-400"}`} />
                {aiDescription.original && !aiDescription.loading && (
                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                    <Sparkles size={10} /> ИИ улучшил текст
                  </p>
                )}
              </div>

              {/* Подробное описание + ИИ */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Расскажите о себе подробнее</label>
                  <div className="flex items-center gap-2">
                    {aiLong.original && !aiLong.loading && (
                      <button type="button" onClick={() => restoreOriginal("longDescription")}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        <RotateCcw size={12} /> Восстановить
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => improveWithAI("longDescription")}
                      disabled={aiLong.loading || !form.longDescription.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #D4001A)", color: "white" }}
                    >
                      {aiLong.loading
                        ? <><Loader2 size={12} className="animate-spin" /> Пишет...</>
                        : <><Sparkles size={12} /> Улучшить с ИИ</>
                      }
                    </button>
                  </div>
                </div>
                <textarea value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)}
                  rows={6} placeholder="Наша семья живёт в Армении уже три поколения..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-900 resize-none transition-colors ${aiLong.loading ? "border-purple-300 bg-purple-50" : "border-gray-200 focus:border-red-400"}`} />
                {aiLong.original && !aiLong.loading && (
                  <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                    <Sparkles size={10} /> ИИ улучшил текст — проверьте и отредактируйте при необходимости
                  </p>
                )}
              </div>

              {/* Подсказка */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <p className="text-xs text-purple-700 leading-relaxed">
                  <strong>✨ Как работает ИИ-улучшение:</strong> Напишите текст своими словами, даже вкратце — потом нажмите кнопку. ИИ сделает его теплее, ярче и привлекательнее для гостей, сохранив все ваши факты.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Experiences & Amenities */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Что вы предлагаете</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Удобства</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_LIST.map((a) => (
                    <button key={a} type="button" onClick={() => toggleArr("amenities", a)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${form.amenities.includes(a) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {form.amenities.includes(a) && "✓ "}{a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Опыт для гостей</label>
                <div className="grid grid-cols-1 gap-2">
                  {EXPERIENCES_LIST.map((e) => (
                    <button key={e} type="button" onClick={() => toggleArr("experiences", e)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${form.experiences.includes(e) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {form.experiences.includes(e) && "✓ "}{e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Языки общения</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES_LIST.map((l) => (
                    <button key={l} type="button" onClick={() => toggleArr("languages", l)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${form.languages.includes(l) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Мы получили вашу заявку. Наш менеджер свяжется с вами в течение 24–48 часов для верификации.
                После проверки вы получите звёзды и ваш профиль появится на платформе.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-yellow-800 mb-2">Следующие шаги:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>✓ Ожидайте звонка от нашего менеджера</li>
                  <li>✓ Подготовьте документы (паспорт)</li>
                  <li>✓ Наш инспектор посетит ваш дом</li>
                  <li>✓ После верификации — вы в системе!</li>
                </ul>
              </div>
              <button onClick={() => router.push("/")} className="px-8 py-3 rounded-full text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                На главную
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 font-medium disabled:opacity-30 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={18} /> Назад
              </button>
              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                >
                  Далее <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-1 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                >
                  {loading ? "Отправляем..." : "Отправить заявку"} <Check size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
