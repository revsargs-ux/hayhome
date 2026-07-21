# Промт: Система тестирования HayHome

Разработать систему автотестов для **HayHome** — платформы поиска и бронирования хостов (гостеприимство/проживание).

**Стек:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
**БД:** Supabase (таблицы с префиксом `hayhome_*`)
**Деплой:** Docker + Traefik, прод на hay-home.com
**Роли:** `guest` (гость), `host` (хозяин), `admin`, `provider` (поставщик услуг), `partner` (партнёр-реферал)
**Аутентификация:** JWT (jose), пароли bcrypt, кука `hayhome_auth` (httpOnly, 7 дней)

Два уровня тестов:

---

## Уровень 1: Модульные тесты API (через Next.js API)

Папка: `tests/api/`

**Что тестировать:**

| API | Методы | Что проверять |
|-----|--------|--------------|
| `/api/auth/login` | POST | Успешный вход (guest/host/admin/provider), неверный email, неверный пароль |
| `/api/auth/register` | POST | Валидация полей (name/email/password), дубликат email, роль guest по умолчанию, невозможность зарегистрироваться как admin |
| `/api/auth/me` | GET | Возврат профиля по токену, 401 без токена |
| `/api/hosts` | GET/POST | Публичный список (только active), создание хоста, фильтры по city/region |
| `/api/hosts/[id]` | GET/PUT/DELETE | Получение одного хоста, обновление (auth host/admin), удаление (admin only) |
| `/api/bookings` | GET/POST | Создание бронирования (auth required), список своих броней, admin видит все |
| `/api/reviews` | GET/POST | Публичный список отзывов, создание (auth required, min 10 символов, рейтинг 1-5) |
| `/api/requests` | GET/POST | Публичный список открытых заявок, создание (auth required), фильтры category/region |
| `/api/favorites` | GET/POST/DELETE | Добавление/удаление из избранного (auth), список своих избранных |
| `/api/chat` | GET/POST | Получение истории чата (?with=userId или ?bookingId), отправка сообщения |
| `/api/services` | GET/POST | Публичный список услуг, фильтры category/region/provider |
| `/api/partners` | GET/POST | Работа с партнёрской программой (payout, referrals) |
| `/api/calendar` | GET | Календарь доступности хоста |
| `/api/promocodes` | GET/POST | Промокоды |
| `/api/health` | GET | Healthcheck |

**Подход:**
- Использовать `node:test` + `assert` (или `vitest`)
- Тестировать через HTTP-запросы к Next.js API (fetch к `http://localhost:3000/api/...`)
- Тестовые данные — в реальной Supabase (seed-данные)
- Проверять авторизацию: какой эндпоинт требует какую роль
- Статус-коды: 200/201 (успех), 400 (валидация), 401 (нет auth), 403 (нет прав), 409 (конфликт), 500

---

## Уровень 2: E2E тесты (Playwright)

**Структура папок:**

```
tests/
  fixtures/
    auth.ts         — логин через API (POST /api/auth/login), запись токена в куку
    mobile.ts       — browser context с эмуляцией мобильного Chromium (390×844)
    host-fixtures.ts — тестовые данные хостов/услуг
  helpers/
    api.ts          — fetch-обёртки к /api/*
    ui.ts           — ожидания, скриншоты, общие утилиты
    i18n.ts         — переключение языков (ru/en/hy/fr/de/es)
  guest/
    homepage.spec.ts    — @critical — главная, поиск хостов, фильтры
    hosts.spec.ts       — @critical — просмотр хоста, карточка, отзывы
    booking.spec.ts     — @critical — бронирование (выбор дат, форма, подтверждение)
    auth.spec.ts        — @login — регистрация, вход, выход
    reviews.spec.ts     — отзывы (создание, просмотр)
    profile.spec.ts     — профиль гостя
  host/
    dashboard.spec.ts   — @critical — дашборд хоста, управление анкетой
    bookings.spec.ts    — @host — управление бронированиями
    calendar.spec.ts    — @host — календарь доступности
  admin/
    dashboard.spec.ts   — @critical — панель администратора
    hosts.spec.ts       — управление хостами (approve/suspend)
    reviews.spec.ts     — модерация отзывов
    partners.spec.ts    — управление партнёрами
  provider/
    services.spec.ts    — @critical — управление услугами
    bookings.spec.ts    — бронирования услуг
  partner/
    dashboard.spec.ts   — @critical — партнёрский дашборд (рефералы, выплаты)
  common/
    i18n.spec.ts        — @i18n — переключение всех 6 языков на всех страницах
    pwa.spec.ts         — @pwa — PWA манифест, service worker, screenshots
  smoke/
    all-logins.spec.ts  — @smoke @critical — вход всех ролей за 1 прогон
    critical.spec.ts    — @smoke @critical — основные сценарии (поиск → хост → бронь)
```

**Тестовые хуки (hooks):**
- `test.beforeEach` — логин через API (POST `/api/auth/login`), установка куки `hayhome_auth`, навигация
- Логин через API, не через GUI — экономия ~5 секунд на тест
- GUI-логин тестируется отдельно в `guest/auth.spec.ts`
- Для тестов без авторизации — отдельный `describe` без хука

**Фикстуры (fixtures):**
- `authPage` — page с уже установленной кукой `hayhome_auth` и refresh
- `mobileContext` — browser context с эмуляцией iPhone 13 (390×844)
- `guestFixtures` / `hostFixtures` — тестовые сущности (создание/cleanup)

**Разбиение на шаги (test.step):**

Обязательно для длинных цепочек:

```typescript
test('бронирование хоста', async ({ authPage }) => {
  await test.step('выбрать хост из списка', ...)
  await test.step('заполнить форму бронирования', ...)
  await test.step('проверить что бронь в дашборде', ...)
  await test.step('отменить бронь (cleanup)', ...)
})
```

**Аннотации:**

```typescript
test.skip(browserName === 'webkit', 'beforeinstallprompt не поддерживается')
test.skip(browserName === 'firefox', 'display-mode: standalone не поддерживается')
test.skip(!isMobile, 'PWA тест только для мобильных')
test.fixme('Telegram WebView отображение', ...) // не реализовано

test('тест с issue', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/revsargs-ux/hayhome/issues/N'
  }
}, async () => { ... })
```

**Теги (tags):**

| Тег | Что включает | Команда запуска |
|-----|-------------|-----------------|
| @critical | Smoke — логин всех ролей, поиск хоста, бронирование | `--grep @critical` |
| @smoke | Быстрая проверка (2-3 минуты) | `--grep @smoke` |
| @pwa | Все PWA-тесты | `--grep @pwa --project=mobile-chromium` |
| @login | Аутентификация | `--grep @login` |
| @booking | Бронирования | `--grep @booking` |
| @i18n | Мультиязычность (6 языков) | `--grep @i18n` |
| @host | Сценарии хоста | `--grep @host` |
| @admin | Админ-панель | `--grep @admin` |

---

## Роли и тестовые данные

| Роль | Email | Действия |
|------|-------|---------|
| guest | guest@test.com | Поиск, просмотр хостов, бронирование, отзывы |
| host | host@test.com | Управление анкетой, календарь, брони |
| admin | admin@test.com | Всё — модерация хостов, отзывов, партнёров |
| provider | provider@test.com | Управление услугами, брони услуг |
| partner | partner@test.com | Рефералы, выплаты |

---

## Конфигурация Playwright

Уже есть базовый `playwright.config.ts` — нужно расширить:
- Добавить `projects: ['chromium', 'mobile-chromium']`
- Mobile: эмуляция iPhone 13 (viewport 390×844, deviceScaleFactor 3)
- Prod baseURL: `https://hay-home.com`
- Dev baseURL: `http://localhost:3000`
- `--project=chromium` для десктопных тестов
- `--project=mobile-chromium` для PWA/мобильных тестов

---

## Критерии готовности

1. Все тесты проходят (`npx playwright test` — 0 failures)
2. `npx tsc --noEmit` — 0 ошибок
3. Тесты идемпотентны (cleanup после себя)
4. Запуск `--grep @smoke` занимает < 3 минут
5. Запуск `--grep @critical` занимает < 10 минут
6. Тесты = живая документация
