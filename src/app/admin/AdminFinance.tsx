"use client";
import { useLang } from "@/contexts/LanguageContext";

const STATUS: Record<string, Record<string, string>> = {
  ru: { pending: "Ожидает", confirmed: "Подтверждено", completed: "Завершено", cancelled: "Отменено" },
  en: { pending: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
  hy: { pending: "Սպասում", confirmed: "Հաստատված", completed: "Ավարտված", cancelled: "Չեղարկված" },
  fr: { pending: "En attente", confirmed: "Confirmé", completed: "Terminé", cancelled: "Annulé" },
  de: { pending: "Ausstehend", confirmed: "Bestätigt", completed: "Abgeschlossen", cancelled: "Storniert" },
  es: { pending: "Pendiente", confirmed: "Confirmado", completed: "Completado", cancelled: "Cancelado" },
  it: { pending: "In attesa", confirmed: "Confermato", completed: "Completato", cancelled: "Annullato" },
  ar: { pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي" },
  zh: { pending: "待处理", confirmed: "已确认", completed: "已完成", cancelled: "已取消" },
  fa: { pending: "در انتظار", confirmed: "تأیید شده", completed: "تکمیل شده", cancelled: "لغو شده" },
};

export default function AdminFinance({ bookings, commission }: { bookings: any[]; commission: number }) {
  const { lang } = useLang();
  const rev = bookings.filter((b: any) => b.status === "completed").reduce((s: number, b: any) => s + b.totalPrice, 0);
  const com = rev * commission / 100;
  const pen = bookings.filter((b: any) => b.status === "pending").length;
  const colors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { val: "$" + rev, label: lang === "ru" ? "Общая выручка" : "Total Revenue", color: "text-gray-900" },
          { val: "$" + com.toFixed(0), label: `Комиссия (${commission}%)`, color: "text-green-600" },
          { val: "$" + (rev - com).toFixed(0), label: lang === "ru" ? "К выплате партнёрам" : "To partners", color: "text-amber-600" },
          { val: "" + pen, label: lang === "ru" ? "Ожидают подтверждения" : "Pending", color: "text-red-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className={"text-3xl font-bold " + s.color}>{s.val}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">{lang === "ru" ? "История бронирований" : "Booking History"}</h3>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-8">{lang === "ru" ? "Нет бронирований" : "No bookings"}</p>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Гость" : "Guest"}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Хозяин" : "Host"}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Даты" : "Dates"}</th>
              <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Сумма" : "Amount"}</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.guestName || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{b.hostName || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{b.checkIn} → {b.checkOut}</td>
                  <td className="px-4 py-3 font-semibold">${b.totalPrice}</td>
                  <td className="px-4 py-3"><span className={"text-xs rounded-full px-2 py-0.5 font-medium " + (colors[b.status] || "bg-gray-100 text-gray-600")}>{STATUS[b.status]?.[lang] || b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
