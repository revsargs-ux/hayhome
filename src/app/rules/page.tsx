"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function RulesPage() {
  const { tr } = useLang();
  const l = tr.legal;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> {l.back}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{l.rules}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Назначение Правил</h2>
              <p>
                Настоящие Правила разработаны для обеспечения комфортного, безопасного и уважительного
                взаимодействия между Пользователями платформы HayHome (далее — «Платформа»).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Основные принципы</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Взаимоуважение.</strong> Пользователи обязаны относиться друг к другу с уважением, независимо от национальности, религии и культуры.</li>
                <li><strong>Честность.</strong> Информация в профилях, отзывах и бронированиях должна быть достоверной.</li>
                <li><strong>Гостеприимство.</strong> HayHome — это не просто аренда жилья, это культурный обмен. Ожидается открытое и доброжелательное отношение.</li>
                <li><strong>Безопасность.</strong> Пользователи обязаны соблюдать правила безопасности и не подвергать риску себя и окружающих.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Правила для Гостей</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Соблюдайте правила дома принимающей семьи.</li>
                <li>Уважайте распорядок дня, привычки и традиции семьи.</li>
                <li>Не причиняйте ущерб имуществу. В случае ущерба — возместите его.</li>
                <li>Не допускайте некорректного поведения, насилия или дискриминации.</li>
                <li>При прибытии предъявите документ, удостоверяющий личность.</li>
                <li>Соблюдайте чистоту и порядок в доме.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Правила для Хозяев</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Предоставляйте достоверную информацию о своём доме и условиях.</li>
                <li>Обеспечьте базовый уровень комфорта: чистое постельное бельё, горячая вода, безопасность.</li>
                <li>Уважайте частную жизнь Гостей.</li>
                <li>Не допускайте дискриминации по любому признаку.</li>
                <li>Своевременно отвечайте на запросы о бронировании.</li>
                <li>Сообщайте Платформе о любых инцидентах.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Запрещённые действия</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Размещение недостоверной информации или чужих фотографий.</li>
                <li>Организация любых незаконных деятельностей на территории проживания.</li>
                <li>Курение в доме без разрешения Хозяина.</li>
                <li>Передача бронирования третьим лицам без согласования.</li>
                <li>Мошенничество, включая фиктивные отзывы и бронирования.</li>
                <li>Спам и массовая рассылка через Платформу.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Система рейтинга и отзывов</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Оценки и отзывы — основа доверия на Платформе.</li>
                <li>Отзывы оставляются только после завершённого Визита.</li>
                <li>Запрещается оставлять отзывы за вознаграждение или под давлением.</li>
                <li>Платформа может удалить отзыв, нарушающий Правила.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Меры за нарушение</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Предупреждение.</li>
                <li>Временная блокировка аккаунта.</li>
                <li>Удаление отзывов или профиля.</li>
                <li>Постоянная блокировка на Платформе.</li>
                <li>Передача информации в правоохранительные органы (при необходимости).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Обратная связь</h2>
              <p>
                Сообщить о нарушении или задать вопрос можно по адресу:{" "}
                <a href="mailto:hayhome.arm@gmail.com" className="text-red-600 hover:underline">hayhome.arm@gmail.com</a>
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-400">
            <p>Последнее обновление: 22 июня 2026 г.</p>
            <p className="mt-1">Связь: <a href="mailto:hayhome.arm@gmail.com" className="text-red-600 hover:underline">hayhome.arm@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
