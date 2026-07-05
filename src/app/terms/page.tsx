"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{l.terms}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Общие положения</h2>
              <p>
                Настоящие Условия использования (далее — «Условия») регулируют отношения между компанией HayHome
                (далее — «Платформа») и пользователями платформы hay-home.com (далее — «Пользователи»).
              </p>
              <p className="mt-2">
                Регистрируясь и используя Платформу, Пользователь подтверждает своё согласие с настоящими Условиями.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Определения</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Гость</strong> — Пользователь, ищущий проживание у принимающей семьи.</li>
                <li><strong>Хозяин</strong> — Пользователь, предоставляющий проживание в своём доме.</li>
                <li><strong>Бронирование</strong> — запрос Гостя на проживание в семье Хозяина.</li>
                <li><strong>Визит</strong> — фактическое проживание Гостя в семье Хозяина.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Регистрация и аккаунт</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Регистрация на Платформе бесплатна.</li>
                <li>Пользователь обязан указывать достоверную информацию.</li>
                <li>Пользователь несёт ответственность за безопасность своего аккаунта.</li>
                <li>Один Пользователь — один аккаунт. Передача аккаунта запрещена.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Права и обязанности сторон</h2>
              <p className="font-semibold text-gray-900 mt-3 mb-1">4.1. Платформа обязуется:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Предоставлять инструменты поиска и бронирования.</li>
                <li>Обеспечивать техническую поддержку.</li>
                <li>Защищать личные данные Пользователей.</li>
              </ol>
              <p className="font-semibold text-gray-900 mt-4 mb-1">4.2. Хозяин обязуется:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Предоставлять достоверную информацию о своём доме.</li>
                <li>Обеспечивать безопасность и комфорт Гостя.</li>
                <li>Соблюдать законы Республики Армения.</li>
              </ol>
              <p className="font-semibold text-gray-900 mt-4 mb-1">4.3. Гость обязуется:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Соблюдать правила дома принимающей семьи.</li>
                <li>Уважать культуру и традиции хозяев.</li>
                <li>Не причинять ущерб имуществу семьи.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Бронирование и оплата</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Бронирование осуществляется через Платформу.</li>
                <li>Стоимость и условия проживания определяются Хозяином.</li>
                <li><strong>Комиссия Платформы:</strong> 15% от стоимости бронирования + 1% за обработку платежа.</li>
                <li><strong>Отмена бронирования:</strong> бесплатно, если отменено не позднее чем за 48 часов до заезда. При отмене менее чем за 48 часов удерживается 50% от стоимости проживания.</li>
                <li>Платформа является посредником между Гостем и Хозяином и не несёт ответственности за действия принимающей стороны.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Отзывы и оценки</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Гости могут оставлять отзывы после завершения Визита.</li>
                <li>Отзывы должны быть честными и корректными.</li>
                <li>Платформа оставляет за собой право удалять оскорбительные отзывы.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Ограничение ответственности</h2>
              <p>
                Платформа является посредником между Гостем и Хозяином и не несёт ответственности
                за качество проживания, поведение сторон и возможные материальные убытки. Платформа
                прилагает усилия по верификации Хозяев, но не гарантирует отсутствие проблемных ситуаций.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Блокировка аккаунта</h2>
              <p>
                Платформа оставляет за собой право заблокировать аккаунт Пользователя в случае нарушения
                настоящих Условий, мошенничества, нарушения законодательства Республики Армения или недобросовестного поведения.
              </p>
              <p className="mt-2">
                <strong>Запрещено:</strong> мошенничество (фиктивные отзывы, ложные данные о жилье), любые действия, нарушающие законы Армении, а также передача аккаунта третьим лицам.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Изменение Условий</h2>
              <p>
                Платформа вправе изменять настоящие Условия. Актуальная версия всегда доступна на данной странице.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Применимое право</h2>
              <p>
                Настоящие Условия регулируются законодательством Республики Армения. Все споры разрешаются путём переговоров, при невозможности — в компетентном суде города Ереван, Республика Армения.
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-400">
            <p>Последнее обновление: 22 июня 2026 г.</p>
            <p className="mt-1">Связь: <a href="mailto:info@hayhome.am" className="text-red-600 hover:underline">info@hayhome.am</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
