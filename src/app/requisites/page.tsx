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
            style={{
              background: "linear-gradient(135deg, #D4001A, #F2A900)",
            }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Реквизиты
            </h1>
            <p className="text-white/80 text-sm">HayHome · hay-home.com</p>
          </div>

          {/* Body */}
          <div className="p-8 md:p-10 space-y-8">
            {/* Entity */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Реквизиты юридического лица
              </h2>
              <div className="bg-amber-50/50 rounded-xl p-5 space-y-2">
                <p className="text-lg font-bold text-gray-900">
                  ИП САРГСЯН РЕВИК СЕРГЕЕВИЧ
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">ИНН:</span>
                    <span className="font-mono font-medium text-gray-900">
                      410102126296
                    </span>
                  </div>
                  <div className="flex justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-500">ОГРНИП:</span>
                    <span className="font-mono font-medium text-gray-900">
                      325410000011701
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
                  <span className="font-mono font-medium text-gray-900">
                    40802810836710000838
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Банк</span>
                  <span className="font-medium text-gray-900">
                    СЕВЕРО-ВОСТОЧНОЕ ОТДЕЛЕНИЕ N8645 ПАО СБЕРБАНК
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-gray-500">БИК</span>
                    <span className="font-mono font-medium text-gray-900">
                      044442607
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Корсчёт</span>
                    <span className="font-mono font-medium text-gray-900">
                      30101810300000000607
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">ИНН банка</span>
                    <span className="font-mono font-medium text-gray-900">
                      7707083893
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">КПП банка</span>
                    <span className="font-mono font-medium text-gray-900">
                      410132026
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contacts */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                Контакты
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="mailto:info@hayhome.am"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-amber-700 transition-colors"
                >
                  <span className="text-gray-400">✉️</span>
                  <span className="font-medium">info@hayhome.am</span>
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
          © 2025 HayHome — ИП САРГСЯН РЕВИК СЕРГЕЕВИЧ
        </p>
      </main>
    </div>
  );
}
