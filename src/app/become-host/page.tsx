"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Sparkles, RotateCcw, Loader2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const AMENITIES = [
  "Wi-Fi", "Отдельная комната", "Завтрак", "Ужин", "Полное питание",
  "Горячая вода", "Кондиционер", "Баня", "Огород", "Домашнее вино",
  "Домашнее молоко и сыр", "Вид на природу", "Трансфер", "Стиральная машина",
];
const EXPERIENCES = [
  "Мастер-класс по долме", "Мастер-класс по гате/кяте", "Дегустация армянских вин",
  "Виноделие", "Сбор трав в горах", "Посещение монастыря", "Экскурсия по городу",
  "Рыбалка", "Приготовление хоровац (шашлык)", "Ткачество карпетов",
  "Гончарное мастерство", "Посещение рынка", "Уход за животными", "Сбор урожая",
];
const LANGS_LIST = ["Армянский", "Русский", "Английский", "Французский", "Немецкий", "Персидский", "Арабский"];
const REGIONS = ["Ереван","Арарат","Арагацотн","Гегаркуник","Лори","Котайк","Ширак","Сюник","Вайоц Дзор","Тавуш"];

interface AiState { loading: boolean; original: string | null; }

export default function BecomeHostPage() {
  const router = useRouter();
  const { tr } = useLang();
  const b = tr.become;
  const steps = [b.step0, b.step1, b.step2, b.step3];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiDesc, setAiDesc] = useState<AiState>({ loading: false, original: null });
  const [aiLong, setAiLong] = useState<AiState>({ loading: false, original: null });

  const [form, setForm] = useState({
    familyName: "", name: "", phone: "", email: "",
    city: "", region: "", location: "",
    pricePerNight: 30, maxGuests: 2, availableRooms: 1,
    description: "", longDescription: "",
    amenities: [] as string[], experiences: [] as string[],
    languages: ["Армянский"] as string[],
  });

  const [customExp, setCustomExp] = useState("");
  const [customAmenity, setCustomAmenity] = useState("");

  const set = (field: string, value: unknown) => setForm(f => ({ ...f, [field]: value }));
  const toggle = (field: "amenities" | "experiences" | "languages", val: string) =>
    setForm(f => ({ ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val] }));

  const addCustom = (field: "experiences" | "amenities") => {
    const val = field === "experiences" ? customExp.trim() : customAmenity.trim();
    if (!val || form[field].includes(val)) return;
    setForm(f => ({ ...f, [field]: [...f[field], val] }));
    if (field === "experiences") setCustomExp("");
    else setCustomAmenity("");
  };

  const improveAI = async (field: "description" | "longDescription") => {
    const text = form[field];
    if (!text || text.trim().length < 10) { alert(b.aiHint); return; }
    const setState = field === "description" ? setAiDesc : setAiLong;
    setState({ loading: true, original: text });
    try {
      const res = await fetch("/api/ai/improve-text", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: field === "description" ? "short" : "long" }),
      });
      if (!res.ok) throw new Error(await res.text());
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
      const msg = e instanceof Error ? e.message : "Error";
      alert(`${tr.common.error}: ${msg}`);
      setState(prev => { if (prev.original) set(field, prev.original); return { loading: false, original: prev.original }; });
      return;
    }
    setState(prev => ({ ...prev, loading: false }));
  };

  const restore = (field: "description" | "longDescription") => {
    const st = field === "description" ? aiDesc : aiLong;
    const setSt = field === "description" ? setAiDesc : setAiLong;
    if (st.original) { set(field, st.original); setSt({ loading: false, original: null }); }
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/hosts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stars: 1, photos: [], coverPhoto: "" }),
      });
      if (!res.ok) throw new Error();
      setStep(4);
    } catch { setError(tr.common.error); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 bg-white";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{b.title}</h1>
          <p className="text-gray-500">{b.subtitle}</p>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-center gap-1 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= step ? "text-white" : "bg-gray-200 text-gray-500"}`}
                  style={i <= step ? { background: "linear-gradient(135deg, #D4001A, #F2A900)" } : {}}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 transition-colors ${i < step ? "bg-red-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{b.step0}</h2>
              {[
                { label: b.familyName, field: "familyName", placeholder: "Семья Арутюнян" },
                { label: b.yourName, field: "name", placeholder: "Арутюн Арутюнян" },
                { label: b.phone, field: "phone", placeholder: "+374 91 ..." },
                { label: b.email, field: "email", placeholder: "family@example.com", type: "email" },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label} *</label>
                  <input type={f.type || "text"} value={(form as any)[f.field]} onChange={e => set(f.field, e.target.value)}
                    placeholder={f.placeholder} className={inputCls} />
                </div>
              ))}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{b.step1}</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{b.city} *</label>
                <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Ереван" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{b.region} *</label>
                <select value={form.region} onChange={e => set("region", e.target.value)} className={inputCls}>
                  <option value="">{b.pickRegion}</option>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{b.address}</label>
                <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="ул. Абовяна 12" className={inputCls} />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{b.step2}</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {b.priceNight}: <strong>${form.pricePerNight}</strong>
                </label>
                <input type="range" min={10} max={150} step={5}
                  value={form.pricePerNight} onChange={e => set("pricePerNight", Number(e.target.value))} className="w-full accent-red-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$10</span><span>$150</span></div>
                <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">💰 Расчёт вашего дохода за ночь:</p>
                  <p>Гость платит: <strong>${form.pricePerNight}</strong></p>
                  <p>Комиссия платформы (15%): −${(form.pricePerNight * 0.15).toFixed(2)}</p>
                  <p>Комиссия за перевод (1%): −${(form.pricePerNight * 0.84 * 0.01).toFixed(2)}</p>
                  <p className="font-bold text-green-700">Вы получите: <span className="text-base">${(form.pricePerNight * 0.84 * 0.99).toFixed(2)}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{b.maxGuests}</label>
                  <input type="number" min={1} max={20} value={form.maxGuests}
                    onChange={e => set("maxGuests", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{b.rooms}</label>
                  <input type="number" min={1} max={10} value={form.availableRooms}
                    onChange={e => set("availableRooms", Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              {/* Short desc + AI */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">{b.shortDesc} *</label>
                  <div className="flex gap-2">
                    {aiDesc.original && !aiDesc.loading && (
                      <button type="button" onClick={() => restore("description")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                        <RotateCcw size={12} /> {b.restore}
                      </button>
                    )}
                    <button type="button" onClick={() => improveAI("description")} disabled={aiDesc.loading || !form.description.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #D4001A)", color: "white" }}>
                      {aiDesc.loading ? <><Loader2 size={12} className="animate-spin" /> {b.aiLoading}</> : <><Sparkles size={12} /> {b.aiBtn}</>}
                    </button>
                  </div>
                </div>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  rows={2} placeholder={b.shortDesc}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-900 resize-none ${aiDesc.loading ? "border-amber-300 bg-amber-50" : "border-gray-200 focus:border-red-400"}`} />
                {aiDesc.original && !aiDesc.loading && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Sparkles size={10} /> {b.aiImproved}</p>
                )}
              </div>

              {/* Long desc + AI */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">{b.longDesc}</label>
                  <div className="flex gap-2">
                    {aiLong.original && !aiLong.loading && (
                      <button type="button" onClick={() => restore("longDescription")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                        <RotateCcw size={12} /> {b.restore}
                      </button>
                    )}
                    <button type="button" onClick={() => improveAI("longDescription")} disabled={aiLong.loading || !form.longDescription.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #D4001A)", color: "white" }}>
                      {aiLong.loading ? <><Loader2 size={12} className="animate-spin" /> {b.aiLoading}</> : <><Sparkles size={12} /> {b.aiBtn}</>}
                    </button>
                  </div>
                </div>
                <textarea value={form.longDescription} onChange={e => set("longDescription", e.target.value)}
                  rows={5} placeholder={b.longDesc}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-900 resize-none ${aiLong.loading ? "border-amber-300 bg-amber-50" : "border-gray-200 focus:border-red-400"}`} />
                {aiLong.original && !aiLong.loading && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Sparkles size={10} /> {b.aiImprovedLong}</p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs text-amber-700 leading-relaxed"><strong>✨</strong> {b.aiHint}</p>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">{b.step3}</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{b.amenitiesLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(a => (
                    <button key={a} type="button" onClick={() => toggle("amenities", a)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${form.amenities.includes(a) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {form.amenities.includes(a) && "✓ "}{a}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input type="text" value={customAmenity}
                    onChange={e => setCustomAmenity(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && customAmenity.trim()) { e.preventDefault(); addCustom("amenities"); } }}
                    placeholder="Add your own..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400" />
                  <button type="button" onClick={() => addCustom("amenities")}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{b.experiencesLabel}</label>
                <div className="grid grid-cols-1 gap-2">
                  {EXPERIENCES.map(e => (
                    <button key={e} type="button" onClick={() => toggle("experiences", e)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${form.experiences.includes(e) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                      {form.experiences.includes(e) && "✓ "}{e}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input type="text" value={customExp}
                    onChange={e => setCustomExp(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && customExp.trim()) { e.preventDefault(); addCustom("experiences"); } }}
                    placeholder="Add your own..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-red-400" />
                  <button type="button" onClick={() => addCustom("experiences")}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{b.langsLabel}</label>
                <div className="flex flex-wrap gap-2">
                  {LANGS_LIST.map(l => (
                    <button key={l} type="button" onClick={() => toggle("languages", l)}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{b.successTitle}</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">{b.successText}</p>
              <button onClick={() => router.push("/")} className="px-8 py-3 rounded-full text-white font-semibold"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {b.toHome}
              </button>
            </div>
          )}

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 font-medium disabled:opacity-30 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} /> {b.back}
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {b.next} <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="flex items-center gap-1 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {loading ? b.submitting : b.submit} <Check size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
