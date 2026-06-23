"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import getUI from "@/lib/ui";

function SuccessContent() {
  const { lang } = useLang();
  const u = getUI(lang);
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{u.paymentSuccess}</h1>
        <p className="text-gray-500 mb-2">
          {lang === "ru" ? "Ваше бронирование подтверждено и оплачено." : "Your booking is confirmed and paid."}
        </p>
        {paymentId && (
          <p className="text-gray-400 text-sm mb-6">
            {lang === "ru" ? "ID платежа" : "Payment ID"}: {paymentId}
          </p>
        )}
        <div className="flex flex-col gap-3 mt-6">
          <Link href="/dashboard" className="block w-full py-3 rounded-full text-white font-semibold text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
            {u.dashboard}
          </Link>
          <Link href="/hosts" className="block w-full py-3 rounded-full border-2 border-gray-200 text-gray-700 font-semibold text-center hover:bg-gray-50 transition">
            {lang === "ru" ? "Найти ещё семьи" : "Find more families"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
