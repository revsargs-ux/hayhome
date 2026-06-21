"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Host } from "@/lib/types";
import { ChevronLeft, Star, Check } from "lucide-react";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestCountry: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    message: "",
  });

  useEffect(() => {
    fetch(`/api/hosts/${id}`).then((r) => r.json()).then(setHost);
  }, [id]);

  const nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  })();

  const total = host ? nights * host.pricePerNight : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host) return;
    if (nights < 1) { setError("Выберите корректные даты"); return; }
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
      setError("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (!host) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-400">Загрузка...</div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Заявка отправлена!</h2>
        <p className="text-gray-600 mb-3 leading-relaxed">
          Семья <strong>{host.familyName}</strong> получила вашу заявку и свяжется с вами в течение 24 часов.
        </p>
        <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left text-sm">
          <p className="font-semibold text-gray-800 mb-2">Детали:</p>
          <p>📅 {form.checkIn} → {form.checkOut} ({nights} ночей)</p>
          <p>👥 Гостей: {form.guests}</p>
          <p>💵 Итого: ${total}</p>
        </div>
        <Link href="/hosts" className="block w-full py-3 rounded-full text-white font-semibold text-center"
          style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
          Найти ещё семьи
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/hosts/${id}`} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm font-medium mb-6">
          <ChevronLeft size={16} /> Назад к профилю
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Бронирование визита</h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ваше имя *</label>
                    <input required value={form.guestName} onChange={(e) => setForm(f => ({ ...f, guestName: e.target.value }))}
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Страна *</label>
                    <input required value={form.guestCountry} onChange={(e) => setForm(f => ({ ...f, guestCountry: e.target.value }))}
                      placeholder="Россия"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input required type="email" value={form.guestEmail} onChange={(e) => setForm(f => ({ ...f, guestEmail: e.target.value }))}
                      placeholder="guest@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Телефон</label>
                    <input value={form.guestPhone} onChange={(e) => setForm(f => ({ ...f, guestPhone: e.target.value }))}
                      placeholder="+7 900 ..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Дата заезда *</label>
                    <input required type="date" value={form.checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setForm(f => ({ ...f, checkIn: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Дата отъезда *</label>
                    <input required type="date" value={form.checkOut}
                      min={form.checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setForm(f => ({ ...f, checkOut: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Количество гостей</label>
                  <input type="number" min={1} max={host.maxGuests} value={form.guests}
                    onChange={(e) => setForm(f => ({ ...f, guests: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
                  <p className="text-xs text-gray-400 mt-1">Максимум {host.maxGuests} гостей</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Сообщение семье</label>
                  <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4} placeholder="Расскажите о себе: откуда вы, цель визита, особые пожелания..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900 resize-none" />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  {loading ? "Отправляем..." : `Запросить бронирование · $${total}`}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Бесплатная отмена за 48 часов до заезда
                </p>
              </form>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-32">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #D4001A22, #F2A90044)" }}>
                  🏠
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{host.familyName}</p>
                  <p className="text-gray-500 text-xs">{host.city}, {host.region}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} fill="#F2A900" color="#F2A900" />
                    <span className="text-xs font-semibold text-gray-700">
                      {host.rating > 0 ? host.rating : "Новый"}
                    </span>
                  </div>
                </div>
              </div>

              {nights > 0 ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>${host.pricePerNight} × {nights} ночей</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Сервисный сбор</span>
                    <span className="text-green-600 font-medium">Бесплатно</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                    <span>Итого</span>
                    <span>${total}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">Выберите даты для расчёта стоимости</p>
              )}

              <div className="mt-4 space-y-2">
                {[`До ${host.maxGuests} гостей`, "Бесплатная отмена за 48ч", "Прямой контакт с семьёй"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={12} className="text-green-500 flex-shrink-0" />
                    {f}
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
