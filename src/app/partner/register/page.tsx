"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Gift, MapPin, Loader2, Copy } from "lucide-react";

function PartnerRegisterContent() {
  const { lang } = useLang();
  const { user } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<"ambassador" | "hunter">("ambassador");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [partner, setPartner] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">{lang === "ru" ? "Войдите чтобы стать партнёром" : "Log in to become a partner"}</p>
          <Link href="/login" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {lang === "ru" ? "Войти" : "Log In"}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/partners", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (res.ok) {
      setPartner(data.partner);
      setDone(true);
    }
    setLoading(false);
  };

  const copyLink = () => {
    const link = `https://hay-home.com/register?ref=${partner.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refLink = partner ? `https://hay-home.com/register?ref=${partner.code}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        {!done ? (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{lang === "ru" ? "Станьте партнёром" : "Become a Partner"}</h1>
              <p className="text-gray-500 mt-2">{lang === "ru" ? "Выберите вашу роль" : "Choose your role"}</p>
            </div>

            {/* Ambassador */}
            <button onClick={() => setRole("ambassador")}
              className={`w-full text-left p-6 rounded-2xl border-2 transition ${role === "ambassador" ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  <Gift size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{lang === "ru" ? "Амбассадор" : "Ambassador"}</h3>
                  <p className="text-gray-500 text-sm mt-1">{lang === "ru" ? "Привлекаете туристов по своей ссылке" : "Invite tourists via your link"}</p>
                  <div className="mt-2 text-sm font-bold" style={{ color: "#D4001A" }}>5% × 2 {lang === "ru" ? "года" : "years"}</div>
                </div>
              </div>
            </button>

            {/* Hunter */}
            <button onClick={() => setRole("hunter")}
              className={`w-full text-left p-6 rounded-2xl border-2 transition ${role === "hunter" ? "border-red-500 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                  <MapPin size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{lang === "ru" ? "Охотник за семьями" : "Family Hunter"}</h3>
                  <p className="text-gray-500 text-sm mt-1">{lang === "ru" ? "Находите семьи и мастеров для платформы" : "Find families and artisans for the platform"}</p>
                  <div className="mt-2 text-sm font-bold" style={{ color: "#D4001A" }}>$5 + 5% × 2 {lang === "ru" ? "года" : "years"}</div>
                </div>
              </div>
            </button>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
              {lang === "ru" ? "Начать" : "Start"}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900">{lang === "ru" ? "Вы теперь партнёр!" : "You're now a partner!"}</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">{lang === "ru" ? "Ваш код:" : "Your code:"}</p>
              <div className="text-3xl font-bold font-mono" style={{ color: "#D4001A" }}>{partner.code}</div>
              <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-xl p-3">
                <code className="text-sm text-gray-700 flex-1 text-left truncate">{refLink}</code>
                <button onClick={copyLink} className="p-2 rounded-lg hover:bg-gray-200 transition">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{lang === "ru" ? "Скопируйте ссылку и делитесь" : "Copy the link and share it"}</p>
            </div>
            <Link href="/partner/dashboard" className="block w-full py-3 rounded-full text-white font-semibold text-center"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {lang === "ru" ? "Панель партнёра" : "Partner Dashboard"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnerRegisterPage() {
  return (
    <Suspense fallback={null}>
      <PartnerRegisterContent />
    </Suspense>
  );
}
