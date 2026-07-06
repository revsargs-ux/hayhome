import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HayHome — Описание деятельности",
  robots: { index: false, follow: false },
};

export default function BankDescriptionPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-serif">
      <h1 className="text-3xl font-bold text-center mb-8">HayHome — Описание деятельности</h1>

      <div className="space-y-6 text-base leading-relaxed text-gray-800">
        <table className="w-full mb-8">
          <tbody>
            <tr><td className="font-semibold py-1 w-48">Наименование:</td><td>HayHome</td></tr>
            <tr><td className="font-semibold py-1">Проект:</td><td>Онлайн-платформа гостеприимства в Армении</td></tr>
            <tr><td className="font-semibold py-1">Домен:</td><td>hay-home.com</td></tr>
            <tr><td className="font-semibold py-1">Год запуска:</td><td>2026</td></tr>
            <tr><td className="font-semibold py-1">Контакт:</td><td>oooplus.ru@yandex.ru</td></tr>
          </tbody>
        </table>

        <hr />

        <section>
          <h2 className="text-xl font-bold mb-3">Чем занимается компания</h2>
          <p>
            HayHome — это онлайн-платформа, которая соединяет туристов с армянскими семьями, желающими принять гостей в своём доме. Мы предлагаем туристам проживание в реальных армянских семьях вместо отелей — с традиционной кухней, местными экскурсиями и культурным погружением.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Основные услуги</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Бронирование проживания у семей</strong> — турист выбирает семью, бронирует даты и живёт как член семьи.</li>
            <li><strong>Бронирование услуг и впечатлений</strong> — мастер-классы (виноделие, кулинария), экскурсии, походы.</li>
            <li><strong>Организация мероприятий</strong> — тематические вечера, дегустации, культурные события.</li>
            <li><strong>Комиссионное вознаграждение</strong> — платформа берёт комиссию 16% от каждой транзакции между гостем и хозяином.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Модель дохода</h2>
          <p>Комиссия 16% от каждого бронирования (оплачивается гостём):</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>84% — хозяину (армянской семье)</li>
            <li>15% — платформе HayHome</li>
            <li>1% — комиссия за банковский перевод</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Целевая аудитория</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Иностранные туристы, посещающие Армению</li>
            <li>Армянские семьи, желающие заработать на приёме гостей</li>
            <li>Диаспора, возвращающаяся в Армению</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Рынок</h2>
          <p>
            Армения принимает более 1,9 млн туристов в год. Все они нуждаются в проживании. HayHome предлагает уникальную альтернативу — жить в семье, а не в отеле.
          </p>
        </section>

        <hr />

        <div className="text-center text-sm text-gray-500">
          <p>Сайт: hay-home.com</p>
          <p>Email: oooplus.ru@yandex.ru</p>
        </div>
      </div>
    </div>
  );
}
