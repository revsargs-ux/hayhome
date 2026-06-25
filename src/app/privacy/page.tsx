"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{l.privacy}</h1>
          <p className="text-gray-500 text-sm mb-8">HayHome · hay-home.com</p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Общие положения</h2>
              <p>
                Настоящая Политика конфиденциальности определяет, как компания HayHome (далее — «мы», «нас», «наш»)
                собирает, использует и защищает информацию, полученную от пользователей платформы hay-home.com
                (далее — «Платформа»).
              </p>
              <p className="mt-2">
                Используя Платформу, вы соглашаетесь с условиями настоящей Политики.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Данные, которые мы собираем</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Регистрационные данные:</strong> имя, адрес электронной почты, пароль (в зашифрованном виде).</li>
                <li><strong>Профиль:</strong> страна проживания, язык общения, предпочтения.</li>
                <li><strong>Данные бронирования:</strong> даты заезда/выезда, количество гостей, сообщение семье.</li>
                <li><strong>Технические данные:</strong> IP-адрес, тип браузера, файлы cookie.</li>
                <li><strong>Отзывы:</strong> текст отзыва и оценка, оставленные вами.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Как мы используем данные</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Для предоставления услуг поиска и бронирования проживания.</li>
                <li>Для связи с вами по вопросам бронирования и поддержки.</li>
                <li>Для улучшения работы Платформы и качества обслуживания.</li>
                <li>Для обеспечения безопасности и предотвращения мошенничества.</li>
                <li>Для отправки уведомлений (при согласии пользователя).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Передача данных третьим лицам</h2>
              <p>
                Мы не продаём и не передаём ваши личные данные третьим лицам в коммерческих целях.
                Данные могут быть переданы только в следующих случаях:
              </p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>С вашего согласия (например, при передаче контактов принимающей семье).</li>
                <li>По требованию уполномоченных государственных органов в рамках закона.</li>
                <li>Для обеспечения технической работы Платформы (хостинг, платёжные системы).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Защита данных</h2>
              <p>
                Мы применяем технические и организационные меры для защиты ваших данных:
                шифрование паролей, ограниченный доступ к базам данных, регулярное резервное копирование,
                использование протокола HTTPS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Файлы cookie</h2>
              <p>
                Платформа использует файлы cookie для обеспечения корректной работы (сессии, язык интерфейса,
                аналитика). Вы можете отключить cookie в настройках браузера, но это может повлиять на
                работоспособность Платформы.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Права пользователя</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Право на доступ к своим личным данным.</li>
                <li>Право на исправление или удаление данных.</li>
                <li>Право на отзыв согласия на обработку данных.</li>
                <li>Право на подачу жалобы в надзорный орган.</li>
              </ol>
              <p className="mt-2">
                Для реализации этих прав напишите на: <a href="mailto:info@hayhome.am" className="text-red-600 hover:underline">info@hayhome.am</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Изменения политики</h2>
              <p>
                Мы оставляем за собой право обновлять настоящую Политику. Актуальная версия всегда доступна
                на данной странице.
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
