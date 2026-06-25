# I18N Audit Report

> Generated: 2026-06-25
> Project: HayHome (hay-home.com)
> Languages checked: ru, en, hy, fr, de, es, it, ar, zh, fa (10)
> Translation files: translations.ts, ui.ts, aboutTexts.ts, i18n-utils.ts

## CRITICAL (Armenian transliteration / broken Armenian text)

| # | File | Key/Location | Found | Expected |
|---|------|-------------|-------|----------|
| 1 | `i18n-utils.ts` | `AMENITY_NAMES["Отдельная комната"].hy` | `"Առանձin սենյակ"` | `"Առանձին սենյակ"` (Latin "in" instead of Armenian "ին") |

**Only 1 critical issue found.** All other Armenian strings across all files use proper Armenian script (Հայարանի).

---

## MEDIUM (Inline ternaries with lang === — NOT using tr()/u(), fragile)

These are hardcoded multi-language ternaries that bypass the translation system. They duplicate translations already in `translations.ts`/`ui.ts` and are error-prone when adding new languages.

### /src/app/book/[id]/page.tsx — 25 inline lang ternaries

| Line | String (ru) | Should use key from |
|------|-----------|-------------------|
| 200 | "Выберите корректные даты" | New key in ui.ts |
| 223 | "Выбранные даты недоступны." | New key in ui.ts |
| 225 | "Ошибка отправки." | New key in ui.ts |
| 272 | "Для бронирования нужно войти" | New key in ui.ts |
| 275 | "Создайте аккаунт или войдите" | New key in ui.ts |
| 309 | "Мои бронирования" | New key in ui.ts |
| 333 | "Восстановлены данные предыдущего бронирования" | New key in ui.ts |
| 430 | "Ваш город:" | `ui(lang).yourCity` exists! |
| 445 | "Способ оплаты" | New key in ui.ts |
| 460 | "Переводом" | New key in ui.ts |
| 465 | "Реквизиты для перевода будут отправлены вам в сообщении." | New key in ui.ts |
| 474 | "Отправка..." | `ui(lang).submitting` or `ui(lang).loadingText` exists! |
| 552 | monthNames (inline ternary for months) | `ui(lang).months` exists! |
| 615 | "Свободно" | `t.hosts.available` exists! |
| 616 | "Занято" | `t.hosts.booked` exists! |
| 617 | "Выбрано" | New key in ui.ts |
| 702 | "🎯 Улучшите ваш визит" | `ui(lang).additionalServices` nearby but different wording |
| 703 | "Добавить услуги" | New key in ui.ts |
| 704 | "Дополнительно" | New key in ui.ts |
| 705 | "Нет услуг в этой категории" | New key in ui.ts |
| 706 | "Добавить" | `ui(lang).addService` exists! |
| 707 | "Время дня" | `ui(lang).timeOfDay` exists! |
| 708 | "🌅 Утро" | `ui(lang).morning` exists! |
| 709 | "🌙 Вечер" | `ui(lang).evening` exists! |
| 710 | "🕐 Другое" | `ui(lang).customTime` exists! |

### /src/app/login/page.tsx — 1 inline ternary (10-language chain)

| Line | String (ru) | Issue |
|------|-----------|-------|
| 70 | "Забыли пароль?" | Full 10-lang chain instead of tr() call |

### /src/app/services/book/[id]/page.tsx — 1 inline ternary

| Line | String (ru) | Issue |
|------|-----------|-------|
| 363 | "Способ оплаты" | Full 10-lang chain |

### /src/app/payment/cancel/page.tsx — 3 inline ternaries

| Line | String (ru) | Issue |
|------|-----------|-------|
| 23 | "Платёж не был завершён..." | Full 10-lang chain |
| 29 | "Повторить оплату" | Full 10-lang chain |
| 33 | "К семьям" | Full 10-lang chain |

### /src/app/payment/success/page.tsx — 3 inline ternaries

| Line | String (ru) | Issue |
|------|-----------|-------|
| 23 | "Ваше бронирование подтверждено и оплачено." | Full 10-lang chain |
| 27 | "ID платежа" | Only 3 languages (ru/hy/en) — **missing 7!** |
| 36 | "Найти ещё семьи" | Full 10-lang chain |

### /src/app/events/page.tsx — 1 usage

| Line | String | Issue |
|------|--------|-------|
| 149 | `const isRu = lang === "ru"` | Used for conditionals — should use lang directly |

### /src/app/provider/register/page.tsx — 1 inline ternary

| Line | String (ru) | Issue |
|------|-----------|-------|
| 171 | "На главную" | Full 10-lang chain, `t.legal.back` exists! |

### /src/components/NavigatorLinks.tsx — 1 inline ternary

| Line | String (ru) | Issue |
|------|-----------|-------|
| 13 | "Открыть в навигаторе:" | Full 10-lang chain |

**Total medium issues: 36 inline ternaries across 8 files**

---

## LOW (Minor inconsistencies, patterns to improve)

| # | Page/File | Detail |
|---|-----------|--------|
| 1 | `forgot-password/page.tsx` | Uses local `T` object with 10-language keys instead of centralized `ui.ts`. Functional but not DRY — should move to `ui.ts`. |
| 2 | `reset-password/page.tsx` | Likely same pattern as forgot-password (local T object). |
| 3 | `admin/page.tsx:96` | Uses `const a = (ru, en) => lang === "ru" ? ru : en` — only 2-language fallback, not all 10. |
| 4 | `dashboard/calendar/page.tsx:151,288` | Uses `lang === "ru"` for month names and conditionals. `ui(lang).months` exists and should be used. |
| 5 | `book/[id]/page.tsx:474` | Mixes `t("submit")` (from tr system) with inline ternary for "Отправка..." in same line. |
| 6 | `i18n-utils.ts` | `Wi-Fi` used as Armenian translation for "Wi-Fi" — correct (universal term), but "Отдельная комната" hy has Latin "in" (see CRITICAL). |
| 7 | `aboutTexts.ts` | Has separate structure from `translations.ts` about section — two parallel about translation systems exist (translations.ts `about` key AND aboutTexts.ts). Potential for drift. |
| 8 | All pages | `getLocalizedField()` in i18n-utils.ts only falls back from ru for host descriptions. If `lang === "ru"`, returns base. For all others: `i18n[lang][field] ?? i18n.en[field] ?? base`. This means non-Russian users always see Russian base if no localized field exists. |

---

## Summary

| Metric | Count |
|--------|-------|
| Total pages checked | 30 (pages + components) |
| Total source files checked | 4 (translations.ts, ui.ts, aboutTexts.ts, i18n-utils.ts) |
| **Issues found** | **38** |
| Critical (Armenian transliteration) | **1** |
| Medium (Inline ternaries bypassing tr/u) | **36** |
| Low (Minor inconsistencies) | **8** (counted separately from Medium) |
| Missing translation keys (in translations/ui) | **0** — all 10 languages have equal key counts |
| Empty values | **0** detected |

### Recommendations

1. **Fix CRITICAL immediately:** `i18n-utils.ts` line `"Առանձin սենյակ"` → `"Առանձին սենյակ"`
2. **Refactor inline ternaries in `/book/[id]`** — highest concentration (25). Many keys already exist in `ui.ts` (months, yourCity, addService, timeOfDay, morning, evening, customTime). Move the rest to new `ui.ts` keys.
3. **Refactor payment pages** — move strings to `ui.ts`.
4. **Consolidate about translations** — `translations.ts` has `about` key AND `aboutTexts.ts` has a parallel structure. Decide on one source of truth.
5. **Fix `payment/success/page.tsx:27`** — "ID платежа" only has 3 languages, missing 7.
