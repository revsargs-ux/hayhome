"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { regionName } from "@/lib/i18n-utils";

const CATEGORIES = [
  { value: "events", labelRu: "Мероприятия", labelEn: "Events" },
  { value: "food", labelRu: "Еда", labelEn: "Food" },
  { value: "tour", labelRu: "Туры", labelEn: "Tours" },
  { value: "culture", labelRu: "Культура", labelEn: "Culture" },
  { value: "music", labelRu: "Музыка", labelEn: "Music" },
  { value: "custom", labelRu: "Другое", labelEn: "Custom" },
];

const REGIONS = [
  "all", "Yerevan", "Kotayk", "Tavush", "Gegharkunik", "Lori", "Shirak",
  "Aragatsotn", "Armavir", "Ararat", "Syunik", "Vayots Dzor",
];

interface Recommendation {
  services: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    region: string;
  }>;
  hosts: Array<{
    id: string;
    familyName: string;
    pricePerNight: number;
    region: string;
    city: string;
    coverPhoto: string;
    rating: number;
    maxGuests: number;
  }>;
}

export default function NewRequestPage() {
  const { lang } = useLang();
  const u = getUI(lang);
  const isRu = lang === "ru";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "events",
    region: "all",
    date_from: "",
    date_to: "",
    guests_count: 1,
    budget: "",
    budget_currency: "USD",
  });

  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ id: string; title: string } | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError(isRu ? "Заполните название и описание" : "Fill in title and description");
      return;
    }

    setSubmitting(true);
    setError("");

    // Auto-fill date_to = date_from if not set
    const finalForm = { ...form };
    if (!finalForm.date_to && finalForm.date_from) {
      finalForm.date_to = finalForm.date_from;
    }

    try {
      // 1. Create request
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...finalForm, budget: finalForm.budget ? `${finalForm.budget} ${finalForm.budget_currency}` : "" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create request");
      }

      const data = await res.json();
      setCreated({ id: data.id, title: data.title });

      // 2. Get recommendations
      try {
        const recRes = await fetch("/api/requests/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            region: form.region,
            category: form.category,
          }),
        });
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommendations(recData);
        }
      } catch {
        // Recommendations are optional
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Success view
  if (created && recommendations !== null) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Success banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">✓</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isRu ? "Запрос создан!" : "Request Created!"}
                </h2>
                <p className="text-gray-500 text-sm">{created.title}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Link
                href={`/requests/${created.id}`}
                className="px-4 py-2 rounded-full text-white text-sm font-medium"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
              >
                {isRu ? "Открыть запрос" : "View Request"} →
              </Link>
              <Link
                href="/requests"
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium"
              >
                {isRu ? "Все запросы" : "All Requests"}
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {isRu ? "🎯 Рекомендуемые услуги" : "🎯 Recommended Services"}
              </h3>
              {recommendations?.services?.length ? (
                <div className="space-y-3">
                  {recommendations.services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services#${s.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{s.title}</h4>
                        <span className="text-sm font-bold text-red-600">${s.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                      <div className="flex gap-2 mt-2 text-xs text-gray-400">
                        <span>{s.category}</span>
                        {s.region && <span>• {s.region}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{isRu ? "Услуги не найдены" : "No services found"}</p>
              )}
            </div>

            {/* Hosts */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {isRu ? "🏠 Рекомендуемые семьи" : "🏠 Recommended Hosts"}
              </h3>
              {recommendations?.hosts?.length ? (
                <div className="space-y-3">
                  {recommendations.hosts.map((h) => (
                    <Link
                      key={h.id}
                      href={`/hosts/${h.id}`}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {h.coverPhoto && (
                            <img src={h.coverPhoto} alt={h.familyName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{h.familyName}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span>{regionName(h.region, lang)}</span>
                            {h.rating > 0 && <span>⭐ {h.rating.toFixed(1)}</span>}
                          </div>
                          <p className="text-sm font-bold text-red-600 mt-0.5">
                            ${h.pricePerNight}<span className="text-xs text-gray-400 font-normal">/{isRu ? "ночь" : "night"}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{isRu ? "Семьи не найдены" : "No hosts found"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/requests" className="text-sm text-gray-500 hover:text-gray-700">
            ← {isRu ? "Все запросы" : "All requests"}
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {isRu ? "Что вы ищете?" : "What are you looking for?"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRu
              ? "Опишите что хотите — семьи и организаторы сами вам предложат"
              : "Describe what you want — hosts and organizers will offer you"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {isRu ? "Название" : "Title"} *
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={isRu ? "Напр: Ищу семью для отдыха на выходные" : "E.g.: Looking for a family for weekend stay"}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {isRu ? "Описание" : "Description"} *
            </label>
            <textarea
              required
              rows={4}
              maxLength={3000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={isRu ? "Подробно опишите что вам нужно..." : "Describe what you need in detail..."}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 resize-y"
            />
          </div>

          {/* Category + Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Категория" : "Category"}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {isRu ? c.labelRu : c.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Регион" : "Region"}
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{regionName(r, lang)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Дата заезда" : "Date from"}
              </label>
              <input
                type="date"
                value={form.date_from}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setForm(f => ({ ...f, date_from: newDate, date_to: f.date_to || newDate }));
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Дата выезда" : "Date to"}
              </label>
              <input
                type="date"
                value={form.date_to}
                onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {isRu ? "Кол-во гостей" : "Guests"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.guests_count || ""}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, guests_count: v ? parseInt(v) : 0 });
              }}
              onBlur={() => {
                if (!form.guests_count || form.guests_count < 1) setForm({ ...form, guests_count: 1 });
              }}
              placeholder="1"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {isRu ? "Бюджет" : "Budget"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value.replace(/[^0-9]/g, "") })}
                placeholder="100"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              />
              <select
                value={form.budget_currency}
                onChange={(e) => setForm({ ...form, budget_currency: e.target.value })}
                className="px-2 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 bg-white flex-shrink-0"
              >
                <option value="USD">$</option>
                <option value="EUR">€</option>
                <option value="AMD">֏</option>
                <option value="RUB">₽</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              {submitting
                ? (isRu ? "Отправка..." : "Submitting...")
                : (isRu ? "Отправить запрос" : "Submit Request")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
