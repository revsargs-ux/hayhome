"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";

function CancelContent() {
  const { lang } = useLang();
  const u = getUI(lang);
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <XCircle size={36} className="text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{u.paymentCancelled}</h1>
        <p className="text-gray-500 mb-6">
          {lang === "ru" ? "Платёж не был завершён. Вы можете попробовать снова." : "Payment was not completed. You can try again."}
        </p>
        <div className="flex flex-col gap-3">
          {paymentId && (
            <Link href={`/dashboard`} className="block w-full py-3 rounded-full text-white font-semibold text-center"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {lang === "ru" ? "Повторить оплату" : "Retry payment"}
            </Link>
          )}
          <Link href="/hosts" className="block w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-center hover:bg-gray-50 transition">
            {lang === "ru" ? "К семьям" : "Back to hosts"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>}>
      <CancelContent />
    </Suspense>
  );
}
