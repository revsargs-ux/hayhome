"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import getUI from "@/lib/ui";
import { DollarSign, Users, TrendingUp, ArrowRight, Loader2, Wallet, Clock } from "lucide-react";

function PartnerDashboardContent() {
  const { lang } = useLang();
  const { user } = useAuth();
  const u = getUI(lang);
  const [partner, setPartner] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayout, setShowPayout] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount: "", method: "idram", details: "" });
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);

  useEffect(() => {
    fetch("/api/partners", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setPartner(data.partner); setStats(data.stats); setPayouts(data.recentPayouts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutLoading(true);
    const res = await fetch("/api/partners/payout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(payoutForm.amount), method: payoutForm.method, details: payoutForm.details }),
    });
    if (res.ok) {
      const data: any = await res.json();
      setPartner((p: any) => ({ ...p, balance: data.newBalance }));
      setShowPayout(false);
      setPayoutDone(true);
      setTimeout(() => setPayoutDone(false), 3000);
    }
    setPayoutLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">{u.logInToBecome}</p>
          <Link href="/login" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "#D4001A" }}>
            {u.logInBtn}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🤝</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{u.notPartnerTitle}</h2>
          <p className="text-gray-500 mb-6">{u.notPartnerDesc}</p>
          <Link href="/partner/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {u.becomePartner} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const statusMap: Record<string, Record<string, string>> = {
    pending: { ru: "Ожидает", en: "Pending" },
    completed: { ru: "Выплачен", en: "Completed" },
    rejected: { ru: "Отклонён", en: "Rejected" },
  };

  const refLink = `https://hay-home.com/register?ref=${partner.code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{u.partnerDashboard}</h1>
            <p className="text-gray-500 text-sm">{u.partnerCode} <span className="font-bold font-mono" style={{ color: "#D4001A" }}>{partner.code}</span></p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(refLink); }}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            📋 {u.copyLink}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <Wallet size={20} className="text-red-600" />
              <span className="text-sm text-gray-500">{u.balance}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">${(partner.balance || 0).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-green-600" />
              <span className="text-sm text-gray-500">{u.totalEarned}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">${(partner.total_earned || 0).toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-blue-600" />
              <span className="text-sm text-gray-500">{u.referrals}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalReferrals || 0}</div>
          </div>
        </div>

        {/* Payout button */}
        <div className="flex gap-3">
          <button onClick={() => setShowPayout(!showPayout)}
            className="flex-1 py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            <DollarSign size={20} /> {u.requestPayout}
          </button>
        </div>

        {payoutDone && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-medium">
            ✅ {u.payoutSubmitted}
          </div>
        )}

        {/* Payout form */}
        {showPayout && (
          <form onSubmit={handlePayout} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">{u.payoutTitle}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{u.amountLabel}</label>
              <input type="number" min="30" max={partner.balance} value={payoutForm.amount}
                onChange={e => setPayoutForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="30"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400" />
              <p className="text-xs text-gray-400 mt-1">"Min $30." ${(partner.balance || 0).toFixed(2)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{u.methodLabel}</label>
              <select value={payoutForm.method} onChange={e => setPayoutForm(f => ({ ...f, method: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400">
                <option value="idram">Idram</option>
                <option value="bank_transfer">{u.bankTransfer}</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{u.detailsLabel}</label>
              <input type="text" value={payoutForm.details}
                onChange={e => setPayoutForm(f => ({ ...f, details: e.target.value }))}
                placeholder={u.detailsPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={payoutLoading}
                className="flex-1 py-3 rounded-xl text-white font-bold hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: "#D4001A" }}>
                {payoutLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                {u.submitBtn}
              </button>
              <button type="button" onClick={() => setShowPayout(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                {u.cancel}
              </button>
            </div>
          </form>
        )}

        {/* Payouts history */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">{u.payoutHistory}</h3>
          </div>
          {payouts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Clock size={32} className="mx-auto mb-2" />
              {u.noPayouts}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {payouts.map(p => (
                <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">${p.amount}</span>
                    <span className="text-gray-400 text-sm ml-2">{p.method}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</span>
                    <span className={`text-xs rounded-full px-2 py-1 font-medium ${
                      p.status === "completed" ? "bg-green-100 text-green-700" :
                      p.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{statusMap[p.status]?.[lang] || p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PartnerDashboardPage() {
  return (
    <Suspense fallback={null}>
      <PartnerDashboardContent />
    </Suspense>
  );
}
