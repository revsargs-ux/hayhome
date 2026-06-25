# API & Integrations Audit Report

**Проект:** HayHome  
**Дата аудита:** 2026-06-25  
**Аудитор:** Арарат (CTO Agent)

---

## CRITICAL (Security / Data loss)

| Endpoint | Issue | Severity |
|----------|-------|----------|
| `PATCH /api/hosts/[id]` | **Нет авторизации.** Любой неаутентифицированный пользователь может изменить любого host (имя, цену, фото, статус). Нет проверки `getAuthUser()` или роли. | 🔴 CRITICAL |
| `PATCH /api/hosts/[id]` | **Нет валидации входных данных.** В `updateHost(id, updates)` передаётся весь body напрямую — можно перезаписать `id`, `status`, `verified`, `rating`. | 🔴 CRITICAL |
| `POST /api/bookings` (commission block) | **Стирание баланса партнёра.** При начислении комиссии сначала ставится `balance: 0, total_earned: 0`, затем читается обратно и добавляется комиссия. Если между записью и чтением произойдёт конкурентная запись (race condition) или чтение вернёт 0 — партнёр потеряет весь накопленный баланс. | 🔴 CRITICAL |
| `POST /api/payments/webhook` | **Stripe webhook не проверяет подпись.** В коде написано "simplified — in production use Stripe SDK", но проверка `STRIPE_WEBHOOK_SECRET` только проверяет наличие env var, а не саму подпись. Любой может отправить фейковый `checkout.session.completed` event и подтвердить бронирование. | 🔴 CRITICAL |
| `POST /api/payments/webhook` | **YooKassa webhook не проверяет подпись/IP.** Обрабатывается любой JSON с `event === "payment.succeeded"`. Нет верификации источника. | 🔴 CRITICAL |
| `POST /api/promocodes/validate` | **Нет авторизации и rate limiting.** Бот может брутфорсить промокоды без ограничений. Можно перебрать все возможные коды и найти активные. | 🔴 CRITICAL |
| `/api/hosts` (GET, `?all=true`) | **Утечка данных.** Параметр `all=true` возвращает ВСЕ хосты включая `pending` и `suspended` БЕЗ авторизации. Злоумышленник видит заявки, которые ещё не одобрены. | 🟠 HIGH |
| All API routes | **Fallback JWT secret.** `process.env.JWT_SECRET \|\| "hayhome-secret-key-2024"` — если env var не задана, используется захардкоженный секрет. Можно подделать любой JWT. | 🟠 HIGH |
| Login route | **Поддержка plaintext паролей.** `if (user.password === password)` — позволяет вход без bcrypt. Если в БД есть plaintext пароли (от старых данных), атакующий может использовать timing-атаку чтобы отличить bcrypt от plaintext. | 🟠 HIGH |
| `POST /api/compare` | **Нет авторизации и rate limiting.** Хотя эндпоинт только читает данные, отсутствие rate limit делает его уязвимым к DoS (каждый запрос делает 3 запроса к БД). | 🟡 MEDIUM |

---

## MEDIUM (Broken / incomplete)

| Endpoint | Issue |
|----------|-------|
| `POST /api/auth/forgot-password` | Мёртвый код: переменная `resetLink` формируется с ошибкой (склеивает Supabase URL и домен), но не используется — используется `correctLink`. Не критично, но код мусорный. |
| `POST /api/partners/payout/[id]` (reject) | **Некорректный возврат баланса.** При отказе от выплаты баланс возвращается через `payout.partner?.balance`, но в SELECT используется join `hayhome_partners(name, email, user_id)` — поля `balance` НЕТ в select. Возврат всегда `(0) + payout.amount` — партнёр теряет предыдущий баланс. |
| 8 таблиц отсутствуют в schema | В коде используются таблицы: `hayhome_services`, `hayhome_service_bookings`, `hayhome_messages`, `hayhome_favorites`, `hayhome_calendar`, `hayhome_payments`, `hayhome_promocodes`, `hayhome_host_history` — **ни одной нет в `supabase-schema.sql`**. Они могут существовать в проде (созданы вручную), но схема неполная. |
| `hayhome_users.role` CHECK constraint | В схеме: `CHECK (role IN ('guest', 'host', 'admin'))`. Но в коде регистрируется роль `provider` (`/api/auth/register`, `/api/services`). **Insert провалится** если БА реально применит этот constraint. |
| `POST /api/hosts` env var | Использует `process.env.SUPABASE_URL!` вместо `NEXT_PUBLIC_SUPABASE_URL` или `process.env.SUPABASE_URL`. В lib/supabase.ts используется `NEXT_PUBLIC_SUPABASE_URL`. Если `SUPABASE_URL` не задан — краш при логировании history. |
| `POST /api/bookings/[id]/PATCH` | Нет проверки что host-пользователь является владельцем ЭТОГО бронирования. Любой пользователь с ролью `host` может менять статус любого бронирования. |
| `DELETE /api/bookings/[id]` | **Метод отсутствует.** В ТЗ указан DELETE, но в route.ts его нет. Только PATCH. |
| `DELETE /api/hosts/[id]` | **Метод отсутствует.** В ТЗ указан DELETE, но в route.ts его нет. Только GET и PATCH. |
| `/api/hosts` (GET, `?all=true`) | `getHosts()` фильтрует только `active` на уровне Supabase запроса. Параметр `all=true` возвращает fallback JSON (из `hosts.json`), а не pending-хосты из БД. Логика сломана. |
| `POST /api/service-bookings` (standalone) | **Не требует авторизации** для standalone-режима. Любой может создать service booking с произвольными `guest_name` и `guest_phone`. |

---

## LOW (Performance / best practice)

| Endpoint | Issue |
|----------|-------|
| `GET /api/chat/conversations` | Загружает ВСЕ сообщения пользователя (до 500) и группирует в JS. При большом объёме — медленно. Лучше использовать SQL `DISTINCT ON` или материализованные view. |
| `GET /api/chat/admin-conversations` | Загружает 1000 сообщений и группирует в JS. То же — нужен SQL-level aggregation. |
| Rate limiter | In-memory rate limiter не работает в serverless/многоинстанс деплое. При перезапуске контейнера лимиты сбрасываются. |
| `POST /api/bookings` | Inline IIFE для partner commission блокирует event loop на 3+ round-trip к Supabase. Нужно вынести в фоновую задачу/очередь. |
| `POST /api/ai/improve-text` | Нет rate limiting на маршрут (нет вызова `rateLimit()`). Хотя в лимитере он зарегистрирован — функция не вызывается в коде маршрута. |
| `POST /api/ai/improve-text` | Нет авторизации. Любой неаутентифицированный пользователь может использовать AI API, тратя токены. |
| `GET /api/compare` | Нет кэширования. Каждый запрос пересчитывает все хосты. |
| `GET /api/ratings` | Нет авторизации на запись (только GET доступен, но нет POST для создания рейтинга — механизм обновления `rating` на хосте неочевиден). |
| Upload route | Файлы пишутся в `public/uploads/` внутри Docker контейнера. При пересборке контейнера все загруженные файлы теряются. Нужен volume mount или S3. |
| `GET /api/providers` | Нет rate limiting. Можно дёргать и собирать email/имена всех providers. |
| Supabase RLS | Включена RLS на все таблицы, но service_role обходит RLS. Все API routes используют service_role key — RLS фактически не работает для API. |

---

## Auth Issues

| Page/Route | Issue |
|------------|-------|
| `PATCH /api/hosts/[id]` | **完全没有** авторизации. Любой может редактировать любые данные хоста. |
| `POST /api/ai/improve-text` | Нет авторизации. AI API доступен всем. |
| `POST /api/promocodes/validate` | Нет авторизации + нет rate limit = брутфорс промокодов. |
| `POST /api/service-bookings` (standalone) | Не требует auth в standalone-режиме. |
| `PATCH /api/hosts/[id]` | Нет проверки владельца — любой host может менять чужие объявления. |
| `PATCH /api/bookings/[id]` | Роль `host` может менять ЛЮБОЕ бронирование, не только своё. |
| `POST /api/payments/webhook` | Нет верификации signature для Stripe и YooKassa — фейковые webhook'и подтверждают платежи. |
| `GET /api/hosts?all=true` | Раскрывает pending/suspended хосты без auth. |
| `GET /api/providers` | Раскрывает имена всех providers без auth. |
| Middleware | Защищает только `/dashboard` и `/admin`. API routes не защищены на уровне middleware — защита только на уровне каждого route handler. |
| OAuth callbacks | Telegram OAuth: state не проверяется (особый режим), что допускает CSRF при перехвате `tg_auth_result`. |
| Login | Поддержка plaintext паролей создаёт timing oracle. |

---

## Database Issues

| Table/Column | Issue |
|--------------|-------|
| `hayhome_users.role` | CHECK constraint не включает `provider`. Код регистрирует `provider` — **insert упадёт** если constraint активен. |
| `hayhome_services` | **Таблица отсутствует в schema.sql.** Код активно использует (GET/POST/PATCH/DELETE). |
| `hayhome_service_bookings` | **Таблица отсутствует в schema.sql.** Код активно использует (GET/POST/PATCH). |
| `hayhome_messages` | **Таблица отсутствует в schema.sql.** Весь чат на ней построен. |
| `hayhome_favorites` | **Таблица отсутствует в schema.sql.** |
| `hayhome_calendar` | **Таблица отсутствует в schema.sql.** Бронирование и блокировка дат. |
| `hayhome_payments` | **Таблица отсутствует в schema.sql.** Stripe/YooKassa платежи. |
| `hayhome_promocodes` | **Таблица отсутствует в schema.sql.** CRUD + validate. |
| `hayhome_host_history` | **Таблица отсутствует в schema.sql.** История действий админа. |
| `hayhome_hosts` | Нет колонки `admin_notes` в schema (используется в `/api/hosts/[id]/notes`). |
| `hayhome_hosts` | Нет колонки `user_id` в schema (используется в conversations для связи host→user). |
| `hayhome_users` | Нет колонки `provider` в CHECK на `role`. Нет колонок `referred_by_code`/`referred_by` (хотя есть ALTER TABLE в конце schema). |
| `hayhome_partners` | Колонки `name` и `email` используются в коде (`partner.name`, `partner.email`), но **отсутствуют в schema**. В select используется join, который их тоже не вернёт. |
| `hayhome_referrals` | Колонка `type` имеет CHECK `IN ('guest', 'host', 'experience')`, но код нигде не создаёт записи с полем `type` — insert упадёт (NOT NULL, no default). |
| `hayhome_payouts` | В коде используется status `confirmed`, но в CHECK constraint допустим только `completed` (не `confirmed`). **Insert/update упадёт.** |
| `hayhome_bookings` | Колонки `commission_partner` и `partner_id` добавлены через ALTER, но в основной CREATE TABLE их нет. При пересоздании БД с нуля — будут, но порядок странный. |

---

## Summary

| Категория | Кол-во |
|-----------|--------|
| 🔴 CRITICAL | 6 |
| 🟠 HIGH | 4 |
| 🟡 MEDIUM | 9 |
| 🟢 LOW | 11 |
| **Всего** | **30** |

### Топ-3 приоритета:

1. **Закрыть `PATCH /api/hosts/[id]` авторизацией** — сейчас любой может менять любые данные хостов
2. **Проверять подпись Stripe/YooKassa webhook'ов** — иначе можно бесплатно подтверждать бронирования
3. **Обновить `supabase-schema.sql`** — 8 таблиц используются в коде, но не описаны в схеме. При восстановлении БД проект полностью сломается.

### Топ-3 быстрых фикса:

1. Добавить `getAuthUser()` в `PATCH /api/hosts/[id]`
2. Убрать поддержку plaintext паролей в login
3. Добавить `rateLimit()` в `/api/promocodes/validate` и `/api/ai/improve-text`
