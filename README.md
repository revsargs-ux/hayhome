# 🏔️ HayHome — Armenian Hospitality Platform

Платформа для бронирования проживания в армянских семьях. Опыт настоящего гостеприимства через сердце семьи.

**Веб-сайт:** [hay-home.com](https://hay-home.com)

---

## 📋 Содержание

1. [О проекте](#о-проекте)
2. [Технологический стек](#технологический-стек)
3. [Быстрый старт](#быстрый-старт)
4. [Структура проекта](#структура-проекта)
5. [Переменные окружения](#переменные-окружения)
6. [Деплой](#деплой)
7. [API эндпоинты](#api-эндпоинты)
8. [Безопасность](#безопасность)
9. [Тестирование](#тестирование)
10. [i18n — 10 языков](#i18n)
11. [База данных](#база-данных)
12. [Интеграции](#интеграции)

---

## О проекте

HayHome — маркетплейс проживания в армянских семьях. Гости бронируют проживание, заказывают услуги (экскурсии, ужины, мастер-классы), общаются с принимающими семьями через чат.

### Возможности
- 🔍 Поиск и сравнение семей
- 📅 Бронирование с календарём доступности
- 💳 Оплата (Stripe, YooKassa)
- 💬 Чат между гостями и семьями
- ⭐ Отзывы и рейтинги
- 🌍 10 языков (ru, en, hy, fr, de, es, it, ar, zh, fa)
- 📱 PWA — установка на телефон
- 🤖 AI-улучшение текста описаний
- 👥 Партнёрская программа (реферальные комиссии)
- 🛎️ Провайдеры услуг (экскурсии, транспорт)

---

## Технологический стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 16.2.9, React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Next.js API Routes (serverless) |
| База данных | Supabase (PostgreSQL) |
| Storage | Supabase Storage (фото, видео) |
| Auth | JWT (jose), HttpOnly cookies, OAuth ×6 |
| Платежи | Stripe, YooKassa |
| Email | Nodemailer + Gmail SMTP |
| AI | ZAI glm-5.2 (api.z.ai) |
| Карты | OpenStreetMap / Nominatim |
| Деплой | Docker + Traefik reverse proxy |
| SSL | Let's Encrypt |
| Тесты | Playwright (E2E) |

---

## Быстрый старт

```bash
# Установка
git clone https://github.com/revsargs-ux/hayhome.git
cd hayhome
npm install

# Переменные окружения
cp .env.example .env.local
# Отредактируйте .env.local — заполните реальные значения

# Запуск в dev режиме
npm run dev

# Сборка
npm run build && npm start

# Тесты
npm run test:e2e          # Playwright E2E
npm run test:e2e:headed   # С открытым браузером
npm run lint              # ESLint
```

---

## Структура проекта

```
hayhome/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Главная страница
│   │   ├── layout.tsx          # Root layout (metadata, providers)
│   │   ├── not-found.tsx       # 404 страница
│   │   ├── global-error.tsx    # Error boundary
│   │   ├── hosts/              # Страницы семей
│   │   │   ├── page.tsx        # Список семей
│   │   │   ├── [id]/page.tsx   # Карточка семьи
│   │   │   └── loading.tsx     # Skeleton loader
│   │   ├── services/           # Услуги
│   │   ├── booking/            # Бронирование
│   │   ├── login/              # Авторизация
│   │   ├── register/           # Регистрация
│   │   ├── dashboard/          # Личный кабинет
│   │   ├── admin/              # Админ-панель
│   │   ├── partner/            # Партнёрская программа
│   │   ├── provider/           # Провайдеры услуг
│   │   ├── privacy/            # Политика конфиденциальности
│   │   ├── terms/              # Условия использования
│   │   ├── api/                # API Routes (48 эндпоинтов)
│   │   │   ├── auth/           # Авторизация, OAuth
│   │   │   ├── bookings/       # Бронирования
│   │   │   ├── payments/       # Платежи, webhooks, чеки
│   │   │   ├── chat/           # Чат
│   │   │   ├── reviews/        # Отзывы
│   │   │   ├── hosts/          # Семьи
│   │   │   ├── services/       # Услуги
│   │   │   ├── partners/       # Партнёры
│   │   │   ├── upload/         # Загрузка файлов
│   │   │   ├── ai/             # AI эндпоинты
│   │   │   ├── health/         # Health check
│   │   │   └── admin/          # Admin-only endpoints
│   │   └── sitemap.ts          # Динамический sitemap
│   ├── components/              # React компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HostCard.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── SocialLogin.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── Lightbox.tsx
│   │   ├── Map.tsx / RouteMap.tsx / ServiceMap.tsx
│   │   ├── AddressAutocomplete.tsx
│   │   ├── CookieBanner.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   ├── contexts/                # React Contexts
│   │   ├── AuthContext.tsx     # Авторизация
│   │   ├── LanguageContext.tsx # Язык
│   │   └── LightboxContext.tsx # Галерея
│   ├── lib/                     # Утилиты
│   │   ├── auth.ts             # JWT (sign, verify, cookies)
│   │   ├── supabase.ts         # Supabase клиент (lazy)
│   │   ├── data.ts             # CRUD функции
│   │   ├── types.ts            # TypeScript типы
│   │   ├── translations.ts     # 10 языков
│   │   ├── privacyTexts.ts     # Privacy на 10 языках
│   │   ├── email.ts            # Email отправка
│   │   ├── geo.ts              # Геокодирование (Nominatim)
│   │   ├── rateLimit.ts        # Rate limiting
│   │   └── errorTracker.ts     # Error tracking
│   └── middleware.ts            # Защита роутов
├── public/                      # Статика
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker v2
│   ├── icon-192.png / icon-512.png
│   └── icon-192-maskable.png / icon-512-maskable.png
├── tests/                       # Playwright E2E тесты
│   ├── homepage.spec.ts
│   ├── auth.spec.ts
│   ├── security.spec.ts
│   ├── edge-cases.spec.ts
│   └── performance.spec.ts
├── Dockerfile                   # Multi-stage Docker build
├── .dockerignore
├── .env.example                 # Шаблон переменных
├── playwright.config.ts         # Dev config
├── playwright.prod.config.ts    # Production config
└── supabase-rpc.sql             # SQL: RPC функции
```

---

## Переменные окружения

См. `.env.example` для полного списка.

### Критичные:
- `JWT_SECRET` — секрет для JWT (обязателен)
- `NEXT_PUBLIC_SUPABASE_URL` — URL Supabase проекта
- `SUPABASE_SERVICE_ROLE_KEY` — сервисный ключ Supabase

### Платежи:
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `YOOKASSA_CLIENT_ID`, `YOOKASSA_SECRET_KEY`, `YOOKASSA_WEBHOOK_SECRET`

### Email:
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`

### AI:
- `ZAI_API_KEY` (или `AI_API_KEY`), `AI_BASE_URL`, `AI_MODEL`

### OAuth (опционально):
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET`
- `VK_CLIENT_ID` / `VK_CLIENT_SECRET`
- `YANDEX_CLIENT_ID` / `YANDEX_CLIENT_SECRET`
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_BOT_NAME`
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`

---

## Деплой

### Docker (production)

```bash
# Сборка
docker build -t hayhome .

# Запуск
docker rm -f hayhome
docker run -d --name hayhome --restart unless-stopped \
  --network n8n_default \
  -v $(pwd)/.env.local:/app/.env.local:ro \
  -l traefik.enable=true \
  -l "traefik.http.routers.hayhome.rule=Host(\`hay-home.com\`)" \
  -l traefik.http.routers.hayhome.entrypoints=websecure \
  -l traefik.http.routers.hayhome.tls=true \
  -l traefik.http.routers.hayhome.tls.certresolver=mytlschallenge \
  -l traefik.http.services.hayhome.loadbalancer.server.port=3000 \
  hayhome
```

### Health check
```bash
curl https://hay-home.com/api/health
# → {"status":"healthy","checks":{"supabase":"ok","env":"ok"}}
```

### Логи
```bash
docker logs hayhome --tail 50 -f
```

---

## API эндпоинты

### Auth
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| POST | `/api/auth/register` | Регистрация | — |
| POST | `/api/auth/login` | Вход | — |
| POST | `/api/auth/logout` | Выход | ✅ |
| GET | `/api/auth/me` | Текущий юзер | ✅ |
| POST | `/api/auth/forgot-password` | Сброс пароля | — |
| POST | `/api/auth/reset-password` | Новый пароль | — |
| GET | `/api/auth/providers` | OAuth провайдеры | — |
| GET | `/api/auth/users` | Список юзеров | Admin |
| DELETE | `/api/auth/delete-account` | Удаление аккаунта | ✅ |
| GET/POST | `/api/auth/{google,apple,vk,yandex,telegram,facebook}` | OAuth | — |

### Бронирование
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| GET | `/api/bookings` | Мои брони | ✅ |
| POST | `/api/bookings` | Создать бронь | ✅ |
| PATCH | `/api/bookings/[id]` | Изменить статус | ✅ |
| GET | `/api/calendar` | Календарь | — |
| POST | `/api/service-bookings` | Бронь услуги | ✅/— |

### Платежи
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| POST | `/api/payments/create` | Создать платёж | ✅ |
| POST | `/api/payments/webhook` | Webhook (Stripe/YooKassa) | — |
| GET | `/api/payments/receipt` | PDF-чек | ✅ |

### Контент
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| GET/POST | `/api/hosts` | Семьи | —/✅ |
| GET | `/api/hosts/[id]` | Карточка семьи | — |
| GET | `/api/services` | Услуги | — |
| GET/POST | `/api/reviews` | Отзывы | —/✅ |
| GET | `/api/ratings` | Рейтинги | — |
| GET/POST | `/api/favorites` | Избранное | ✅ |
| GET | `/api/compare` | Сравнение | — |

### Коммуникация
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| GET/POST | `/api/chat` | Сообщения | ✅ |
| GET | `/api/chat/conversations` | Диалоги | ✅ |
| GET | `/api/chat/admin-conversations` | Все диалоги | Admin |
| GET | `/api/chat/unread` | Непрочитанные | ✅ |

### Прочее
| Метод | Путь | Описание | Auth |
|-------|------|----------|------|
| POST | `/api/upload` | Загрузка файлов | ✅ |
| DELETE | `/api/upload` | Удаление файла | Admin |
| POST | `/api/ai/improve-text` | AI улучшение | ✅ |
| POST | `/api/promocodes/validate` | Промокод | — |
| GET | `/api/health` | Health check | — |
| GET | `/api/admin/errors` | Логи ошибок | Admin |

---

## Безопасность

### Реализовано:
- ✅ JWT HS256, 7 дней, HttpOnly/Secure/SameSite cookies
- ✅ Middleware защита роутов (admin, partner, provider, dashboard)
- ✅ Server-side расчёт сумм (не доверяем клиенту)
- ✅ Stripe HMAC верификация подписи webhook
- ✅ YooKassa secret verification
- ✅ Идемпотентность вебhookов (защита от двойного списания)
- ✅ Возврат средств при отмене (Stripe refund + YooKassa cancel)
- ✅ Проверка пересечения слотов (double-booking prevention)
- ✅ Политика отмены (блокировка за 24ч до check-in)
- ✅ Rate limiting на всех эндпоинтах
- ✅ Consent checkbox (152-ФЗ)
- ✅ Удаление аккаунта (GDPR)
- ✅ Security headers (X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- ✅ poweredByHeader отключён
- ✅ .dockerignore (секреты не попадают в образ)
- ✅ Upload: MIME whitelist, size limit, random filenames
- ✅ Reviews: проверка реального бронирования
- ✅ Promocodes: anti-bruteforce rate limit

---

## Тестирование

### E2E тесты (Playwright) — 39 тестов

```bash
# Запуск на проде
npm run test:e2e

# С визуальным интерфейсом
npm run test:e2e:ui

# На production URL
npx playwright test --config=playwright.prod.config.ts
```

### Покрытие:
- **Homepage** (4): навигация, лого, ссылки, переключение языков
- **Auth** (4): login, register, consent checkbox, password toggle
- **Security** (11): middleware редиректы, API auth проверки
- **Pages** (5): hosts, privacy, terms, rules, health
- **Edge Cases** (10): 404, XSS, длинные URL, concurrent requests, sitemap, manifest, robots
- **Performance** (5): load time, console errors, broken images, CSS, API response

### Производительность:
- Homepage load: ~100-250ms
- /api/health: ~180ms
- 0 console errors
- 0 broken images

---

## i18n

10 языков: 🇷🇺 Русский, 🇺🇸 English, 🇦🇲 Հայերեն, 🇫🇷 Français, 🇩🇪 Deutsch, 🇪🇸 Español, 🇮🇹 Italiano, 🇸🇦 العربية (RTL), 🇨🇳 中文, 🇮🇷 فارسی (RTL)

Переводы:
- `src/lib/translations.ts` — основной интерфейс
- `src/lib/privacyTexts.ts` — политика конфиденциальности
- RTL поддержка для арабского и персидского

---

## База данных

**Supabase:** `fopcwaffkdolqwuzjkzy.supabase.co`
**Проект:** rabochie-v0

### Таблицы:
- `hayhome_users` — пользователи
- `hayhome_hosts` — семьи (хосты)
- `hayhome_bookings` — бронирования
- `hayhome_service_bookings` — бронирование услуг
- `hayhome_services` — услуги
- `hayhome_reviews` — отзывы
- `hayhome_calendar` — календарь доступности
- `hayhome_messages` — сообщения чата
- `hayhome_payments` — платежи
- `hayhome_favorites` — избранное
- `hayhome_partners` — партнёры
- `hayhome_payouts` — выплаты партнёрам
- `hayhome_referrals` — рефералы
- `hayhome_promocodes` — промокоды
- `hayhome_errors` — лог ошибок

### RPC функции:
- `deduct_partner_balance(partner_id TEXT, amount NUMERIC)` — атомарное списание
- `credit_partner_balance(partner_id TEXT, amount NUMERIC)` — возврат средств

---

## Интеграции

### OAuth провайдеры:
Google, Apple, VK, Yandex, Telegram, Facebook

### Платёжные системы:
- **Stripe** — международные карты (Checkout Sessions)
- **YooKassa** — российские карты, СБП

### Карты:
- OpenStreetMap / Nominatim (бесплатно, без API ключей)
- AddressAutocomplete с debouncing 300ms

### Email:
- Gmail SMTP (8 типов уведомлений)

### AI:
- ZAI glm-5.2 — улучшение текста описаний

---

## Юридическое

- **ИП Саргсян** — оператор платформы
- Privacy Policy на 10 языках
- Согласие на обработку ПД (152-ФЗ)
- PDF-чеки после оплаты
- Удаление аккаунта (GDPR / 152-ФЗ)
- Cookie баннер

---

## Мониторинг

- `/api/health` — health check endpoint
- `hayhome_errors` — таблица ошибок в Supabase
- `/api/admin/errors` — admin dashboard для просмотра
- `logError()` + `withErrorLogging()` — автоматическое логирование

---

*Последнее обновление: 29 июня 2026 г.*
*Владелец: Ревик Саргсян (@RevikSargsyan)*
