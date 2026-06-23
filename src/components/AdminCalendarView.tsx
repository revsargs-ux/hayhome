"use client";
import { useState, useEffect } from "react";
import { Host, Booking } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminCalendarViewProps {
  hosts: Host[];
  calHostId: string;
  setCalHostId: (v: string) => void;
  calYear: number;
  setCalYear: (v: number) => void;
  calMonth: number;
  setCalMonth: (v: number) => void;
  bookings: Booking[];
  lang: string;
  a: (ru: string, en: string) => string;
}

export default function AdminCalendarView({
  hosts, calHostId, setCalHostId, calYear, setCalYear, calMonth, setCalMonth, bookings, lang, a,
}: AdminCalendarViewProps) {
  const [calEntries, setCalEntries] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    if (!calHostId) return;
    const monthStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
    fetch(`/api/calendar?hostId=${calHostId}&month=${monthStr}`)
      .then(r => r.json())
      .then(data => {
        const m = new Map<string, any>();
        (Array.isArray(data) ? data : []).forEach((e: any) => m.set(e.date, e));
        setCalEntries(m);
      })
      .catch(() => {});
  }, [calHostId, calYear, calMonth]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const monthNames = lang === "ru"
    ? ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayLabels = [a("Пн","Mon"), a("Вт","Tue"), a("Ср","Wed"), a("Чт","Thu"), a("Пт","Fri"), a("Сб","Sat"), a("Вс","Sun")];

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const firstDayIdx = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(calYear, calMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const getBookingInfo = (bookingId: string | null): Booking | undefined => {
    if (!bookingId) return undefined;
    return bookings.find(b => b.id === bookingId);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  return (
    <div>
      {/* Host filter */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-semibold text-gray-700">{a("Семья","Host")}:</label>
        <select value={calHostId} onChange={e => setCalHostId(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-red-400">
          {hosts.map(h => <option key={h.id} value={h.id}>{h.familyName} ({h.city})</option>)}
        </select>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft size={18} /></button>
        <h3 className="font-bold text-gray-900 capitalize">{monthNames[calMonth]} {calYear}</h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100"><ChevronRight size={18} /></button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayLabels.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((date, di) => {
              if (!date) return <div key={di} className="min-h-[64px]" />;
              const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              const entry = calEntries.get(dateStr);
              const status = entry ? entry.status : "available";
              const isPast = dateStr < todayStr;
              const booking = entry && entry.booking_id ? getBookingInfo(entry.booking_id) : undefined;

              const bg = isPast ? "bg-gray-50 text-gray-300"
                : status === "booked" ? "bg-red-100 text-red-800"
                : status === "blocked" ? "bg-gray-200 text-gray-500"
                : "bg-green-100 text-green-800";

              return (
                <div key={di} className={`min-h-[64px] rounded-xl p-2 ${bg}`}
                  title={booking ? `${booking.guestName} (${booking.checkIn} - ${booking.checkOut})` : undefined}>
                  <div className="text-sm font-bold">{date.getDate()}</div>
                  {booking && <div className="text-[10px] truncate text-red-600">{booking.guestName}</div>}
                  {status === "blocked" && <div className="text-[10px]">🚫</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-green-100" /> {a("Свободно","Available")}</div>
        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-red-100" /> {a("Забронировано","Booked")}</div>
        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded bg-gray-200" /> {a("Заблокировано","Blocked")}</div>
      </div>
    </div>
  );
}
