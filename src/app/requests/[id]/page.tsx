"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";
import { regionName } from "@/lib/i18n-utils";
import { MapPin, Users, Calendar } from "lucide-react";

interface RequestResponse {
  id: string;
  request_id: string;
  user_id: string;
  message: string;
  price: string | null;
  status: string;
  created_at: string;
}

interface GuestRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string | null;
  region: string | null;
  date_from: string | null;
  date_to: string | null;
  guests_count: number;
  budget: string | null;
  status: string;
  created_at: string;
  responses?: RequestResponse[];
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const u = getUI(lang);
  const isRu = lang === "ru";

  const [request, setRequest] = useState<GuestRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRespondForm, setShowRespondForm] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responsePrice, setResponsePrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setSubmitting(true);
    const res = await fetch(`/api/requests/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: responseText, price: responsePrice || undefined }),
    });

    if (res.ok) {
      // Reload request to show new response
      const updated = await fetch(`/api/requests/${id}`).then((r) => r.json());
      setRequest(updated);
      setShowRespondForm(false);
      setResponseText("");
      setResponsePrice("");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{u.loadingText}</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">{isRu ? "Запрос не найден" : "Request not found"}</p>
          <Link href="/requests" className="text-red-600 text-sm mt-2 inline-block">
            ← {isRu ? "Назад" : "Back"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/requests" className="text-sm text-gray-500 hover:text-gray-700">
          ← {isRu ? "Все запросы" : "All Requests"}
        </Link>

        {/* Request card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-3 mb-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
            <span
              className="text-xs px-3 py-1 rounded-full text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              {request.status === "open" ? (isRu ? "Открыт" : "Open") : request.status}
            </span>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap mb-4">{request.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {request.category && (
              <span>📂 {request.category}</span>
            )}
            {request.region && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {regionName(request.region, lang)}
              </span>
            )}
            {request.guests_count > 0 && (
              <span className="flex items-center gap-1">
                <Users size={14} /> {request.guests_count} {isRu ? "гостей" : "guests"}
              </span>
            )}
            {request.date_from && (
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {request.date_from}
                {request.date_to ? ` — ${request.date_to}` : ""}
              </span>
            )}
            {request.budget && (
              <span>💰 {request.budget}</span>
            )}
          </div>
        </div>

        {/* Responses */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isRu ? "Отклики" : "Responses"}
            {request.responses && request.responses.length > 0 && (
              <span className="text-gray-400 font-normal ml-1">({request.responses.length})</span>
            )}
          </h2>
          <button
            onClick={() => setShowRespondForm(!showRespondForm)}
            className="px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            {isRu ? "Откликнуться" : "Respond"}
          </button>
        </div>

        {/* Respond form */}
        {showRespondForm && (
          <form onSubmit={handleRespond} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Сообщение" : "Message"} *
              </label>
              <textarea
                required
                rows={3}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={isRu ? "Расскажите что можете предложить..." : "Describe what you can offer..."}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400 resize-y"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {isRu ? "Цена (опционально)" : "Price (optional)"}
              </label>
              <input
                type="text"
                value={responsePrice}
                onChange={(e) => setResponsePrice(e.target.value)}
                placeholder={isRu ? "Напр: $50/ночь" : "E.g.: $50/night"}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-red-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl text-white font-medium text-sm disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              {submitting ? (isRu ? "Отправка..." : "Sending...") : (isRu ? "Отправить" : "Send")}
            </button>
          </form>
        )}

        {/* Response list */}
        {request.responses && request.responses.length > 0 ? (
          <div className="space-y-3">
            {request.responses.map((resp) => (
              <div key={resp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{resp.message}</p>
                {resp.price && (
                  <p className="text-red-600 font-bold text-sm mt-2">💰 {resp.price}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(resp.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-6">
            {isRu ? "Пока нет откликов" : "No responses yet"}
          </p>
        )}
      </div>
    </div>
  );
}
