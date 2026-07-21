"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function AdminGuestRequests({ requests }: { requests: any[] }) {
  const { lang } = useLang();
  const t = (ru: string, en: string) => lang === "ru" ? ru : en;
  const pendingCount = requests.filter((r: any) => r.status === "pending").length;

  if (requests.length === 0) {
    return <div className="text-center py-20 text-gray-400">{t("Нет запросов от туристов", "No guest requests")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{t("Запросы туристов", "Guest Requests")} ({requests.length})</h3>
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
          {t("Ожидает", "Pending")}: {pendingCount}
        </span>
      </div>
      <div className="space-y-3">
        {requests.map((r: any) => {
          const colors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", responded: "bg-green-100 text-green-700" };
          return (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{r.name || r.guestName || "—"}</span>
                    <span className={"text-xs rounded-full px-2 py-0.5 font-medium " + (colors[r.status] || "bg-gray-100 text-gray-600")}>{r.status || "pending"}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {r.destination || r.city || "—"} · {r.checkIn || ""} → {r.checkOut || ""} · {r.guests || 1} {t("гост.", "guests")}
                  </p>
                  {r.message && <p className="text-xs text-gray-400 mt-1 italic">&quot;{r.message}&quot;</p>}
                </div>
                <span className="text-xs text-gray-400">{r.created_at ? r.created_at.slice(0, 10) : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
