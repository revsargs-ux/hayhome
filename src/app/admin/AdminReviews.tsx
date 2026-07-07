"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function AdminReviews({ reviews, onDelete }: { reviews: any[]; onDelete: (id: string) => void }) {
  const { lang } = useLang();

  if (reviews.length === 0) {
    return <div className="text-center py-20 text-gray-400">{lang === "ru" ? "Нет отзывов" : "No reviews"}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">{lang === "ru" ? "Все отзывы" : "All reviews"} ({reviews.length})</h3>
      <div className="space-y-3">
        {reviews.map((r: any) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">{"★".repeat(Math.round(r.rating || 0))}{"☆".repeat(5 - Math.round(r.rating || 0))}</span>
                <span className="font-semibold text-gray-900">{r.authorName || "—"}</span>
              </div>
              <span className="text-xs text-gray-400">{r.created_at ? r.created_at.slice(0, 10) : ""}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{r.text || "—"}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">→ {r.hostName || r.hostId || "—"}</span>
              <button onClick={() => onDelete(r.id)} className="text-xs text-red-500 hover:text-red-700">
                {lang === "ru" ? "Удалить" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
