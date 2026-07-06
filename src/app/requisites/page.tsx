import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RequisitesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} /> HayHome
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-10 text-center"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Ռեկվիզիտներ / Реквизиты
            </h1>
            <p className="text-white/80 text-sm">HayHome · hay-home.com</p>
          </div>

          {/* Body */}
          <div className="p-8 md:p-10 space-y-8">
            {/* Entity */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Реквизиты индивидуального предпринимателя
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-2">
                <p className="text-lg font-bold text-gray-900">
                  ИП Саргсян Ревик Сергеевич (ՍԱՐԳՍՅԱՆ ՐԵՎԻՔ ՍԵՐԳԵԵՎԻՉ)
                </p>
                <p className="text-sm text-gray-500">
                  Регистрационный номер: 772872487
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">ՀՎՀՀ / УНП:</span>
                    <span className="font-mono font-medium text-gray-900">
                      20336085, 286.1594303
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">Рег. номер:</span>
                    <span className="font-mono font-medium text-gray-900">
                      269608863
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">Код деятельности:</span>
                    <span className="font-mono font-medium text-gray-900">
                      62.01.0
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">Дата регистрации:</span>
                    <span className="font-mono font-medium text-gray-900">
                      06.07.2026
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bank */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Банковские реквизиты
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Расчётный счёт</span>
                  <span className="font-mono font-medium text-gray-900 italic">
                    (указать после открытия счёта)
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Банк</span>
                  <span className="font-medium text-gray-900 italic">
                    (указать после открытия счёта)
                  </span>
                </div>
              </div>
            </section>

            {/* Legal address */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Адрес
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  Գյունյակ / Город Ереван
                </p>
                <p className="text-gray-600">
                  Котайкская обл., Наири, г. Егвард, ул. Арапня, д. 2
                </p>
              </div>
            </section>

            {/* Contacts */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Контакты
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="tel:+37477712268"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">📱</span>
                  <span className="font-medium">+374 77-712-268</span>
                </a>
                <a
                  href="mailto:oooplus.ru@yandex.ru"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">✉️</span>
                  <span className="font-medium">oooplus.ru@yandex.ru</span>
                </a>
                <a
                  href="https://hay-home.com"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">🌐</span>
                  <span className="font-medium">hay-home.com</span>
                </a>
              </div>
            </section>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 HayHome — ИП Саргсян Ревик Сергеевич
        </p>
      </main>
    </div>
  );
}
