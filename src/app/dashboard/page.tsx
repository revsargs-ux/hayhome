"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Booking } from "@/lib/types";
import { Calendar, DollarSign, Users, Star } from "lucide-react";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => { setBookings(data); setLoading(false); });
  }, []);

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Личный кабинет</h1>
          <p className="text-gray-500">Управление вашими бронированиями</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, value: pending, label: "Новых заявок", color: "text-yellow-500" },
            { icon: <Users size={20} />, value: confirmed, label: "Подтверждённых", color: "text-blue-500" },
            { icon: <Star size={20} />, value: bookings.length, label: "Всего бронирований", color: "text-purple-500" },
            { icon: <DollarSign size={20} />, value: `$${revenue}`, label: "Заработано", color: "text-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`${stat.color} flex-shrink-0`}>{stat.icon}</div>
              <div>
                <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Заявки на бронирование</h2>
            <Link href="/admin" className="text-sm font-medium hover:underline" style={{ color: "#D4001A" }}>
              Полная панель
            </Link>
          </div>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Загрузка...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 mb-4">Пока нет заявок</p>
              <Link href="/hosts" className="text-sm font-semibold" style={{ color: "#D4001A" }}>
                Посмотреть профиль
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900">{b.guestName}</span>
                      <span className="text-gray-400 text-sm">· {b.guestCountry}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      {b.checkIn} → {b.checkOut} · {b.guests} гост. · <strong>${b.totalPrice}</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{b.guestEmail} · {b.guestPhone}</p>
                    {b.message && <p className="text-xs text-gray-500 italic mt-1">"{b.message}"</p>}
                  </div>
                  {b.status === "pending" && (
                    <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-3 py-1.5 rounded-full">
                      Ожидает ответа
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles: Record<Booking["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<Booking["status"], string> = {
    pending: "Ожидает", confirmed: "Подтверждено", completed: "Завершено", cancelled: "Отменено",
  };
  return <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${styles[status]}`}>{labels[status]}</span>;
}
