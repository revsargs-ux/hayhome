"use client";
import { useLang } from "@/contexts/LanguageContext";

const ACTIONS: Record<string, Record<string, string>> = {
  ru: { submitted: "Заявка подана", approved: "Одобрена", rejected: "Отклонена", suspended: "Приостановлена", restored: "Восстановлена", note_added: "Заметка" },
  en: { submitted: "Submitted", approved: "Approved", rejected: "Rejected", suspended: "Suspended", restored: "Restored", note_added: "Note" },
  hy: { submitted: "Հայտը ներկայացված է", approved: "Հաստատված", rejected: "Մերժված", suspended: "Կասեցված", restored: "Վերականգնված", note_added: "Նշում" },
};

export default function AdminLogs({ history }: { history: any[] }) {
  const { lang } = useLang();

  if (history.length === 0) {
    return <div className="text-center py-20 text-gray-400">{lang === "ru" ? "Нет записей" : "No records"}</div>;
  }

  const colors: Record<string, string> = { approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-600", suspended: "bg-yellow-100 text-yellow-700" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{lang === "ru" ? "История действий" : "Activity Log"}</h3>
        <span className="text-sm text-gray-400">{history.length} {lang === "ru" ? "записей" : "records"}</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Дата" : "Date"}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Действие" : "Action"}</th>
            <th className="px-4 py-3 font-medium text-gray-600">{lang === "ru" ? "Заметка" : "Note"}</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {[...history].sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || "")).map((h: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 text-xs">{h.created_at ? h.created_at.slice(0, 16) : "—"}</td>
                <td className="px-4 py-3">
                  <span className={"text-xs rounded-full px-2 py-0.5 font-medium " + (colors[h.action] || "bg-gray-100 text-gray-600")}>
                    {ACTIONS[h.action]?.[lang] || h.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{h.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
