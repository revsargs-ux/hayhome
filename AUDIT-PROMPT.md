# 📄 ТЕХНИЧЕСКОЕ ЗАДАНИЕ: Комплексный аудит приложения HayHome

Дата: 29 июня 2026 г.
Объект: Веб-приложение HayHome (Next.js/React + Supabase)
Цель: Выявление всех уязвимостей, багов, проблем UX/UI, безопасности и производительности.
Методология: Рекурсивный анализ кода, статический и динамический анализ.

---

## 1. 🌍 Аудит i18n и Локализации (10 языков: ru, en, hy, fr, de, es, it, ar, zh, fa)

### 1.1. Полнота переводов

- [ ] Скан всех .tsx на хардкод текста
- [ ] Проверка src/lib/translations.ts — все ключи для всех 10 языков, нет "" или "TODO"
- [ ] Проверка src/lib/aboutTexts.ts — все 10 языков, нет пустых
- [ ] Динамический контент из БД переведён? Fallback?
- [ ] Мета-данные переведены? robots.txt, sitemap.xml

### 1.2. Корректность отображения

- [ ] Тернарники lang === 'ru' ? — все 10 языков
- [ ] RTL для ar, fa. Армянский subset шрифта Inter
- [ ] Форматирование дат/чисел по локали

---

## 2. ⚙️ Функциональность и Навигация

### 2.1. Роутинг

- [ ] Рекурсивная карта связей
- [ ] Битые ссылки (404)
- [ ] Динамические роуты — несуществующий ID
- [ ] /about, /events, /become-host, /compare

### 2.2. Интерактив

- [ ] Валидация форм, состояния loading/success/error
- [ ] Модалки — клик, ESC, ARIA
- [ ] Все компоненты + контексты

---

## 3. 🔒 Безопасность и API (48 эндпоинтов)

### 3.1. API

- [ ] Авторизация на приватных эндпоинтах
- [ ] Валидация (Zod), XSS, SQL-инъекции
- [ ] Rate limiting
- [ ] CORS и CSP

### 3.2. Supabase

- [ ] RLS на всех таблицах
- [ ] Типы TS ↔ БД
- [ ] Индексы

### 3.3. Интеграции

- [ ] OAuth × 6 (Google, Apple, VK, Yandex, Telegram, Facebook)
- [ ] Загрузка файлов — MIME, размер, защита
- [ ] Webhook — верификация подписи

---

## 4. 🎨 UX/UI и A11y

- [ ] Бренд, контраст WCAG AA, адаптив (320-1440px), кнопки 44x44
- [ ] Изображения — WebP/AVIF, lazy, alt
- [ ] Empty/Error/Loading states
- [ ] Семантика, Tab-навигация, ARIA, скринридеры

---

## 5. 🚀 SEO и Производительность

- [ ] Core Web Vitals (LCP<2.5s, FID<100ms, CLS<0.1)
- [ ] Tree Shaking, code-splitting
- [ ] Sitemap (НЕТ), robots.txt, hreflang, generateMetadata
- [ ] JSON-LD
- [ ] PWA: manifest ✅, SW кэширует ВСЕ GET включая API 🔴

---

## 6. 🛠 DevOps

- [ ] Логирование, мониторинг (Sentry?)
- [ ] README.md
- [ ] .env.example MISSING
- [ ] TypeScript: any типы, strict: true ✅

---

## 7. 🧹 Чистота кода

- [ ] 189 .bak файлов — удалить
- [ ] Дубликат next.config.ts — оставить один
- [ ] src/data/*.json мёртвые — удалить
- [ ] Vercel дефолтные файлы (vercel.svg, next.svg) — удалить
- [ ] public/demo-services/ — нужна ли?

---

## 8. 🤖 AI-интеграция (ZAI / glm-5.2)

- [ ] /api/ai/improve-text:
  - Rate limit ✅, Auth ✅
  - Макс. длина НЕ ограничена — добавить
  - Prompt injection — текст напрямую в промт
  - Утечка ключа в err.message
  - Graceful degradation при недоступности

---

## 9. 💳 Платежи

- [ ] /api/payments/create:
  - Сумма от клиента без пересчёта 🔴
  - Нет проверки принадлежности booking_id 🔴
- [ ] /api/payments/webhook:
  - Нет верификации подписи Stripe 🔴
  - YooKassa secret не используется 🔴
  - Нет идемпотентности
  - service_booking не обновляется

---

## 10. 💬 Чат

- [ ] /api/chat/ — auth, rate limit, валидация
- [ ] /api/chat/conversations — утечка чужих?
- [ ] /api/chat/admin-conversations — admin-only ✅
- [ ] /api/chat/unread — подсчёт
- [ ] ChatWidget.tsx — UI

---

## 11. 📅 Сервисы и Бронирование

- [ ] /api/service-bookings/ — Нет проверки пересечения слотов 🔴
- [ ] /api/calendar/ — доступность
- [ ] Race condition бронирований (нет транзакции) 🔴
- [ ] /api/bookings/ — totalPrice от клиента 🔴
- [ ] Нет возврата средств при отмене 🔴
- [ ] Нет политики отмены (блокировка за X часов)

---

## 12. 👥 Партнёры и Провайдеры

- [ ] Роли и доступ для partner/provider
- [ ] /api/partners/payout/ — валидация суммы, авторизация
- [ ] Race condition при списании баланса

---

## 13. 🔐 Middleware и Auth

- [ ] PROTECTED/ADMIN_ONLY полные?
- [ ] Cookie HttpOnly/Secure/SameSite ✅
- [ ] JWT HS256, 7d ✅
- [ ] /api/auth/users — admin-only ✅
- [ ] Hardcoded JWT fallback в forgot-password 🟡

---

## 14. 📊 Дополнительные функции

- [ ] /api/favorites/ — user-scoped ✅
- [ ] /api/compare/ — валидация
- [ ] /api/ratings + /api/reviews — Нет проверки "было ли бронирование" 🟡
- [ ] /api/upload — auth, whitelist, лимиты ✅. DELETE без проверки ownership 🟡
- [ ] /api/promocodes/validate — нет auth, можно брутфорсить 🟡
- [ ] /api/hosts/[id]/notes — admin-only ✅
- [ ] geo.ts — Nominatim, кэш 10мин ✅. Нет User-Agent 🟡
- [ ] viewHistory.ts — localStorage ✅

---

## 15. 🐳 Инфраструктура и Docker

- [ ] .dockerignore MISSING 🔴 — секреты в образе
- [ ] ENV через volume ✅
- [ ] Нет HEALTHCHECK 🟡
- [ ] Логи — stdout/stderr, без ротации
- [ ] Нет тегов образов

---

## 16. 🗺️ Карты

- [ ] OpenStreetMap TileLayer — бесплатно, нет утечки ключей ✅
- [ ] Map.tsx, RouteMap.tsx, ServiceMap.tsx
- [ ] AddressAutocomplete.tsx — нет debouncing 🟡
- [ ] Нет fallback при ошибке тайлов

---

## 17. 🧪 Тестирование

- [ ] Unit/E2E — НЕТ 🟢 (ранний этап)
- [ ] CI/CD — НЕТ 🟢
- [ ] npm run lint — есть ✅
- [ ] Pre-commit hooks — нет

---

## 18. 📄 Юридические страницы

- [ ] /privacy, /terms, /rules, /requisites — переведены на 10 языков?
- [ ] GDPR — consent, удаление, право на забвение
- [ ] Cookie consent баннер

---

## 19. ⚙️ Конфигурация Next.js

- [ ] allowedOrigins — только localhost:3000 🔴
- [ ] Security headers НЕ настроены 🔴:
  - X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- [ ] poweredByHeader НЕ отключён 🔴
- [ ] images.remotePatterns — 3 домена, минимальны

---

## 20. 💰 Финансовая целостность и Транзакции

- [ ] Идемпотентность вебхуков (защита от двойного списания)
- [ ] Атомарность брони (Database Transactions + Row Locking)
- [ ] Расчёт суммы ТОЛЬКО на бэкенде
- [ ] Логика возвратов при отмене
- Результаты аудита:
  - 🔴 Сумма от клиента без пересчёта
  - 🔴 Webhook без верификации подписи Stripe/YooKassa
  - 🔴 Race condition — нет транзакции при бронировании
  - 🔴 totalPrice от клиента (можно $0)
  - 🔴 Нет возврата средств при отмене — платёж остаётся "completed"

---

## 21. 📅 Сложная логика Календаря

- [ ] Учёт часовых поясов (UTC → Local)
- [ ] Пересечение слотов с буферным временем
- [ ] Политика отмены (блокировка за X часов)
- [ ] Автоматическое освобождение слота
- Результаты аудита:
  - 🔴 Нет проверки пересечения слотов услуг (двойное бронирование)
  - 🟡 Нет буферного времени между бронями
  - 🟡 Нет блокировки отмены за X часов
  - 🟡 Нет учёта часовых поясов
  - ✅ Освобождение слотов при отмене брони работает
  - ✅ Цена услуги считается на сервере

---

## 22. 📱 PWA Deep Dive

- [ ] Нативные инпуты date/time на iOS/Android
- [ ] Виртуальная клавиатура не перекрывает кнопки
- [ ] Standalone mode без элементов браузера
- [ ] Сохранение сессии после закрытия PWA
- [ ] Свайпы для навигации
- Результаты аудита:
  - 🔴 SW кэширует ВСЕ GET включая API
  - 🔴 Нет whitelist/blacklist в SW
  - 🟡 Нет maskable icon в manifest
  - 🟡 Нет обработки обновлений SW
  - 🟡 Нет VisualViewport API
  - 🟡 Нет Persistent Storage для PWA-сессии
  - ✅ date/time инпуты корректны
  - ✅ Свайп в Lightbox есть

---

## 23. 🤖 Anti-Abuse & Content Moderation

- [ ] AI-модерация отзывов/описаний
- [ ] NSFW проверка изображений
- [ ] Rate Limiting на публичных GET
- [ ] CAPTCHA на формах регистрации
- Результаты аудита:
  - 🔴 Нет AI-модерации отзывов
  - 🔴 Нет NSFW проверки фото
  - 🔴 /api/ratings без rate limit
  - 🟡 Нет CAPTCHA
  - 🟡 Нет защиты от скрапинга

---

## 24. 🏗 Инфраструктура и Окружения

- [ ] Разделение Staging/Production env
- [ ] Скрипт seed_db для тестовых данных
- [ ] CI/CD pipeline (Lint → Test → Build → Staging → Approve → Prod)
- [ ] Health Check эндпоинт /api/health
- Результаты аудита:
  - 🟡 Нет разделения Staging/Production (один .env.local)
  - 🟡 Нет seed-скриптов
  - 🟡 Нет CI/CD
  - 🟡 Нет /api/health
  - 🟡 Нет HEALTHCHECK в Dockerfile
  - ✅ Логи через stdout/stderr (приемлемо)

---

## 25. 📜 Юридическая и Налоговая готовность (ИП Саргсян)

- [ ] Генерация PDF-чеков/актов после оплаты
- [ ] Согласия на обработку ПД (чекбоксы в формах)
- [ ] Privacy-текст соответствует реальным данным
- Результаты аудита:
  - 🔴 Нет генерации PDF-чеков/актов — нет документов для налоговой
  - 🔴 Нет чекбоксов согласия на обработку ПД — нарушение 152-ФЗ
  - 🔴 Нет функции удаления аккаунта — нарушение 152-ФЗ/GDPR
  - 🟡 Privacy-страница только на русском
  - 🟡 В privacy не упомянуты phone и guestCountry
  - ✅ Собираемые данные соответствуют privacy (name, email, password, phone)

---

## 📊 ИТОГОВАЯ СВОДКА

| Уровень        | Кол-во |
|----------------|--------|
| 🔴 Критические | 31     |
| 🟡 Средние     | 48     |
| 🟢 Норма/ОК    | 13     |
| ВСЕГО          | 92     |

---

## 🎯 ТОП-10 ПРИОРИТЕТ

1. 💰 Webhook без верификации — кто угодно подтверждает платёж
2. 💰 Сумма от клиента — можно оплатить $0
3. 💰 Нет возврата средств при отмене
4. 📅 Race condition бронирований — двойное бронирование
5. 📅 Race condition услуг — двойной слот
6. 📜 Нет согласия на обработку ПД — 152-ФЗ
7. 📜 Нет удаления аккаунта — 152-ФЗ/GDPR
8. 📜 Нет PDF-чеков/актов — налоговая
9. 🐳 .dockerignore MISSING — секреты в образе
10. 🔒 Security headers + poweredByHeader — утечка инфы

---

## 📋 Ручное тестирование (AI не может)

1. Субъективный UX — "Удобно? Красиво?"
2. Оплата + обрыв связи
3. Юридические нюансы
4. Фишинг админ-панели
5. Нагрузка 10 000 юзеров (k6/Locust)
