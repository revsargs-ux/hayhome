"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { tr } = useLang();
  const { refresh } = useAuth();
  const a = tr.auth;
  const n = tr.nav;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      await refresh(); // обновить AuthContext до навигации
      router.push(data.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(a.wrongCreds);
    }
    setLoading(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>H</div>
            <span className="text-xl font-bold text-gray-900">Hay<span style={{ color: "#D4001A" }}>Home</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{a.loginTitle}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input required type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.password}</label>
            <div className="relative">
              <input required type={showPassword ? "text" : "password"} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className={`${inputCls} pr-12`} />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {loading ? a.loggingIn : a.loginBtn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {a.noAccount}{" "}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: "#D4001A" }}>
            {n.register}
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-3">
          {a.wantToHost}{" "}
          <Link href="/become-host" className="font-semibold hover:underline" style={{ color: "#D4001A" }}>
            {n.hostGuests}
          </Link>
        </p>
      </div>
    </div>
  );
}
