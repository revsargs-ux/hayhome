"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

function ResetContent() {
  const { tr, lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const T = {
    title: { ru: "Новый пароль", en: "New Password", hy: "Նոր գաղտնաբառ", fr: "Nouveau mot de passe", de: "Neues Passwort", es: "Nueva contraseña", it: "Nuova password", ar: "كلمة مرور جديدة", zh: "新密码", fa: "رمز عبور جدید" },
    btn: { ru: "Сохранить пароль", en: "Save Password", hy: "Պահպանել", fr: "Enregistrer", de: "Speichern", es: "Guardar", it: "Salva", ar: "حفظ", zh: "保存", fa: "ذخیره" },
    saving: { ru: "Сохраняем...", en: "Saving...", fr: "Enregistrement...", de: "Speichern...", es: "Guardando...", it: "Salvataggio...", ar: "جارٍ الحفظ...", zh: "保存中...", fa: "در حال ذخیره..." },
    doneTitle: { ru: "Пароль изменён!", en: "Password changed!", hy: "Գաղtnabarry poksvel e!", fr: "Mot de passe modifié!", de: "Passwort geändert!", es: "¡Contraseña cambiada!", it: "Password modificata!", ar: "تم تغيير كلمة المرور!", zh: "密码已更改！", fa: "رمز عبور تغییر کرد!" },
    doneDesc: { ru: "Теперь вы можете войти с новым паролем.", en: "You can now log in with your new password.", fr: "Vous pouvez maintenant vous connecter.", de: "Sie können sich jetzt anmelden.", es: "Ahora puedes iniciar sesión.", it: "Ora puoi accedere.", ar: "يمكنك الآن تسجيل الدخول.", zh: "您现在可以使用新密码登录。", fa: "اکنون می‌توانید با رمز عبور جدید وارد شوید." },
    expired: { ru: "Ссылка устарела или недействительна. Запросите новую.", en: "Link expired or invalid. Request a new one.", fr: "Lien expiré. Demandez-en un nouveau.", de: "Link abgelaufen. Neuen anfordern.", es: "Enlace expirado. Solicita uno nuevo.", it: "Link scaduto. Richiedine uno nuovo.", ar: "الرابط منتهي. اطلب رابطاً جديداً.", zh: "链接已过期。请申请新链接。", fa: "لینک منقضی شده. درخواست جدید کنید." },
  };

  const t = (k: keyof typeof T) => (T[k] as any)[lang] ?? (T[k] as any).en;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-6">{t("expired")}</p>
          <Link href="/forgot-password" className="block py-3 rounded-full text-white font-semibold"
            style={{ background: "#D4001A" }}>{tr.auth.loginBtn}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError(tr.auth.passMismatch); return; }
    if (password.length < 6) { setError(tr.auth.minPass); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setDone(true);
    } else {
      const d = await res.json();
      setError(d.error === "Token expired or invalid" ? t("expired") : tr.common.error);
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
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        </div>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("doneTitle")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("doneDesc")}</p>
            <Link href="/login" className="block w-full py-3 rounded-full text-white font-semibold text-center"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {tr.auth.loginBtn}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.auth.password}</label>
              <div className="relative">
                <input required type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={tr.auth.minPass}
                  className={`${inputCls} pr-12`} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.auth.confirmPassword}</label>
              <input required type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={inputCls} />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {loading ? t("saving") : t("btn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetContent />
    </Suspense>
  );
}
