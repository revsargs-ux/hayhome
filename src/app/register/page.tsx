"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";

export default function RegisterPage() {
  const router = useRouter();
  const { tr } = useLang();
  const a = tr.auth;
  const n = tr.nav;

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError(a.passMismatch); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: "guest" }),
    });
    if (res.ok) {
      router.push("/hosts");
    } else {
      const d = await res.json();
      setError(d.error || a.wrongCreds);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>H</div>
            <span className="text-xl font-bold text-gray-900">Hay<span style={{ color: "#D4001A" }}>Home</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{a.registerTitle}</h1>
          <p className="text-gray-500 text-sm mt-1">{a.registerSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.name}</label>
            <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Smith"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.password}</label>
            <input required type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder={a.minPass}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{a.confirmPassword}</label>
            <input required type="password" value={form.confirm} onChange={(e) => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {loading ? a.registering : a.registerBtn}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {a.hasAccount}{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#D4001A" }}>
            {n.login}
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
