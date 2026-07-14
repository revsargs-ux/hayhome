"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

function ForgotContent() {
  const { tr, lang } = useLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  };

  const T = {
    title: { ru: "Восстановление пароля", en: "Reset Password", hy: "Վերականգնել գաղտնաբառը", fr: "Réinitialiser le mot de passe", de: "Passwort zurücksetzen", es: "Recuperar contraseña", it: "Recupera password", ar: "إعادة تعيين كلمة المرور", zh: "重置密码", fa: "بازنشانی رمز عبور" },
    sub: { ru: "Введите ваш email — мы отправим ссылку для сброса пароля", en: "Enter your email — we'll send a reset link", hy: "Մուտքագրեք ձեր email-ը", fr: "Entrez votre email — nous enverrons un lien", de: "Email eingeben — wir senden einen Link", es: "Ingresa tu email — enviaremos un enlace", it: "Inserisci la tua email", ar: "أدخل بريدك الإلكتروني", zh: "输入您的邮箱", fa: "ایمیل خود را وارد کنید" },
    btn: { ru: "Отправить ссылку", en: "Send reset link", hy: "Ուղարկել", fr: "Envoyer le lien", de: "Link senden", es: "Enviar enlace", it: "Invia link", ar: "إرسال الرابط", zh: "发送链接", fa: "ارسال لینک" },
    sending: { ru: "Отправляем...", en: "Sending...", hy: "Ուղարկում...", fr: "Envoi...", de: "Senden...", es: "Enviando...", it: "Invio...", ar: "جارٍ الإرسال...", zh: "发送中...", fa: "در حال ارسال..." },
    sentTitle: { ru: "Письмо отправлено!", en: "Email sent!", hy: "Նամակն ուղարկվեց!", fr: "Email envoyé!", de: "E-Mail gesendet!", es: "¡Correo enviado!", it: "Email inviata!", ar: "تم إرسال البريد!", zh: "邮件已发送！", fa: "ایمیل ارسال شد!" },
    sentDesc: { ru: "Проверьте почту. Ссылка действительна 15 минут.", en: "Check your inbox. Link expires in 15 minutes.", hy: "Ստուգեք ձեր էլ. փոստը։ Հղումը ունի 15 րոպե ժամկետը。", fr: "Vérifiez votre boîte mail. Lien valide 15 minutes.", de: "Prüfen Sie Ihre E-Mail. Link gilt 15 Minuten.", es: "Revisa tu correo. El enlace expira en 15 minutos.", it: "Controlla la tua email. Il link scade in 15 minuti.", ar: "تحقق من بريدك. الرابط صالح 15 دقيقة.", zh: "检查您的收件箱。链接15分钟内有效。", fa: "صندوق ورودی خود را بررسی کنید. لینک ۱۵ دقیقه اعتبار دارد." },
    back: { ru: "Вернуться ко входу", en: "Back to login", hy: "Վերադառնալ մուտքի", fr: "Retour à la connexion", de: "Zurück zur Anmeldung", es: "Volver al inicio", it: "Torna al login", ar: "العودة لتسجيل الدخول", zh: "返回登录", fa: "بازگشت به ورود" },
  };

  const t = (k: keyof typeof T) => (T[k] as any)[lang] ?? (T[k] as any).en;

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
          {!sent && <p className="text-gray-500 text-sm mt-2">{t("sub")}</p>}
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("sentTitle")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("sentDesc")}</p>
            <Link href="/login" className="block w-full py-3 rounded-full text-white font-semibold text-center"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {t("back")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input required type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-400 text-gray-900" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {loading ? t("sending") : t("btn")}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#D4001A" }}>
            {t("back")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotContent />
    </Suspense>
  );
}
