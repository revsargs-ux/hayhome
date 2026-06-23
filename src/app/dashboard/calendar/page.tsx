"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Host } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarEntry {
  id?: string;
  host_id: string;
  date: string;
  status: "available" | "booked" | "blocked";
  booking_id?: string | null;
  note?: string | null;
}

interface BookingInfo {
  id: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

// Generate calendar grid for a month: returns array of weeks, each week is array of 7 cells (Mon-Sun)
function getMonthGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Convert JS day (0=Sun..6=Sat) to Mon-Sun index (0=Mon..6=Sun)
  const firstDayIdx = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIdx; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HostCalendarPage() {
  const { tr, lang } = useLang();
  const h = tr.hosts;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [myProfile, setMyProfile] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarEntries, setCalendarEntries] = useState<Map<string, CalendarEntry>>(new Map());
  const [bookings, setBookings] = useState<Map<string, BookingInfo>>(new Map());

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [popupEntry, setPopupEntry] = useState<CalendarEntry | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadProfile();
  }, [user, authLoading]);

  const loadProfile = async () => {
    const res = await fetch("/api/hosts?all=1", { credentials: "include" });
    const data = await res.json();
    if (Array.isArray(data)) {
      const profile = data.find((host: Host) => host.email === user?.email);
      if (profile) {
        setMyProfile(profile);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (myProfile) loadCalendar();
  }, [myProfile, viewYear, viewMonth]);

  const loadCalendar = useCallback(async () => {
    if (!myProfile) return;
    setLoading(true);
    const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
    const [calRes, bookRes] = await Promise.all([
      fetch(`/api/calendar?hostId=${myProfile.id}&month=${monthStr}`, { credentials: "include" }),
      fetch(`/api/bookings?hostId=${myProfile.id}`, { credentials: "include" }),
    ]);

    const calData: CalendarEntry[] = await calRes.json();
    const bookData: BookingInfo[] = await bookRes.json();

    const calMap = new Map<string, CalendarEntry>();
    (Array.isArray(calData) ? calData : []).forEach((e) => calMap.set(e.date, e));
    setCalendarEntries(calMap);

    const bookMap = new Map<string, BookingInfo>();
    (Array.isArray(bookData) ? bookData : []).forEach((b) => bookMap.set(b.id, b));
    setBookings(bookMap);

    setLoading(false);
  }, [myProfile, viewYear, viewMonth]);

  const toggleDate = async (date: string, currentStatus: string) => {
    if (!myProfile) return;
    if (currentStatus === "booked") return; // Can't toggle booked dates

    setUpdating(date);
    const newStatus = currentStatus === "blocked" ? "available" : "blocked";
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId: myProfile.id, date, status: newStatus }),
      });
      if (res.ok) {
        await loadCalendar();
      }
    } catch (e) {
      console.error("[Calendar] toggle error:", e);
    } finally {
      setUpdating(null);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const monthNames = lang === "ru"
    ? ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const dayLabels = [h.mon, h.tue, h.wed, h.thu, h.fri, h.sat, h.sun];

  const weeks = getMonthGrid(viewYear, viewMonth);

  const getCellStatus = (date: Date): string => {
    const dateStr = formatDate(date);
    const entry = calendarEntries.get(dateStr);
    if (entry) return entry.status;
    // No entry = available by default
    return "available";
  };

  const getBookingForDate = (date: Date): BookingInfo | null => {
    const dateStr = formatDate(date);
    const entry = calendarEntries.get(dateStr);
    if (entry?.booking_id) {
      return bookings.get(entry.booking_id) || null;
    }
    return null;
  };

  const cellBgClass = (status: string, isPast: boolean, isToday: boolean): string => {
    if (isPast) return "bg-gray-50 text-gray-300";
    if (status === "booked") return "bg-red-100 text-red-800 hover:ring-2 hover:ring-red-300 cursor-pointer";
    if (status === "blocked") return "bg-gray-200 text-gray-500 hover:ring-2 hover:ring-gray-400 cursor-pointer";
    return "bg-green-100 text-green-800 hover:ring-2 hover:ring-green-300 cursor-pointer";
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  );

  if (!myProfile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-gray-600">{h.noCalendar}</p>
      </div>
    </div>
  );

  const todayStr = formatDate(today);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{h.calendarTitle}</h1>
            <p className="text-gray-500 text-sm">{myProfile.familyName}</p>
          </div>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <ChevronLeft size={16} /> {lang === "ru" ? "Назад" : "Back"}
          </a>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-green-100" /> <span className="text-gray-600">{h.available}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-red-100" /> <span className="text-gray-600">{h.booked}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-gray-200" /> <span className="text-gray-600">{h.blocked}</span>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900">{monthNames[viewMonth]} {viewYear}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          {loading ? (
            <div className="text-center py-16 text-gray-400">{tr.common.loading}</div>
          ) : (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayLabels.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
                ))}
              </div>
              {/* Weeks */}
              {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-2 mb-2">
                  {week.map((date, di) => {
                    if (!date) return <div key={di} className="min-h-[64px]" />;
                    const dateStr = formatDate(date);
                    const status = getCellStatus(date);
                    const isPast = dateStr < todayStr;
                    const isToday = dateStr === todayStr;
                    const booking = getBookingForDate(date);
                    const isUpdating = updating === dateStr;

                    return (
                      <div
                        key={di}
                        onClick={() => {
                          if (!isPast && status !== "booked") toggleDate(dateStr, status);
                          else if (status === "booked") setPopupEntry(calendarEntries.get(dateStr) || null);
                        }}
                        className={`min-h-[64px] rounded-xl p-2 transition-all ${cellBgClass(status, isPast, isToday)} ${isToday ? "ring-2 ring-blue-400" : ""} ${isUpdating ? "opacity-50" : ""}`}
                      >
                        <div className="text-sm font-bold">{date.getDate()}</div>
                        {status === "booked" && booking && (
                          <div className="text-[10px] truncate mt-0.5 text-red-600">{booking.guestName}</div>
                        )}
                        {status === "blocked" && (
                          <div className="text-[10px] mt-0.5 text-gray-400">🚫</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {lang === "ru"
            ? "Нажмите на дату, чтобы заблокировать/разблокировать. Красные даты — бронированы гостями."
            : "Click a date to toggle blocked/available. Red dates are booked by guests."}
        </p>
      </div>

      {/* Booking info popup */}
      {popupEntry && (() => {
        const booking = popupEntry.booking_id ? bookings.get(popupEntry.booking_id) : null;
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPopupEntry(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{popupEntry.date}</h3>
                <button onClick={() => setPopupEntry(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              {booking ? (
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">{lang === "ru" ? "Гость" : "Guest"}:</span> <span className="font-semibold">{booking.guestName}</span></div>
                  <div><span className="text-gray-500">{lang === "ru" ? "Заезд" : "Check-in"}:</span> {booking.checkIn}</div>
                  <div><span className="text-gray-500">{lang === "ru" ? "Выезд" : "Check-out"}:</span> {booking.checkOut}</div>
                  <div><span className="text-gray-500">{lang === "ru" ? "Гостей" : "Guests"}:</span> {booking.guests}</div>
                  <div><span className="text-gray-500">{lang === "ru" ? "Сумма" : "Total"}:</span> ${booking.totalPrice}</div>
                  <div><span className="text-gray-500">{lang === "ru" ? "Статус" : "Status"}:</span> {booking.status}</div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">{lang === "ru" ? "Нет информации о бронировании" : "No booking info"}</p>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
