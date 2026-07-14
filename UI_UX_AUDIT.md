# UI/UX Аудит HayHome — 14 июля 2026

> Полный аудит по 8 критериям  
> Метод: web_fetch всех страниц + анализ исходного кода  
> Аудитор: Арарат (CTO Agent)

---

## 01. Typography — Типографика

### ✅ Хорошо
- Шрифт Inter загружается через `next/font/google` с `subsets: ["latin", "cyrillic"]` — поддержка кириллицы и латиницы
- CSS-переменная `--font-inter` используется консистентно
-Fallback на `system-ui, sans-serif` прописан
- Иерархия заголовков на главной: H1 (hero) → H2 (секции) → H3 (карточки) — корректная
- Размеры адаптивные: `text-3xl md:text-6xl` для H1, `text-4xl` для H2, `text-xl` для H3
- `font-extrabold`, `font-bold`, `font-medium` используются последовательно

### ❌ Проблемы
- **globals.css: `font-family: 'Segoe UI', Arial`** — конфликт с Inter. Body CSS перезаписывает шрифт layout.tsx. Шрифт Inter может не применяться
- **?lang=ar / ?lang=fa:** Шрифт Inter не содержит арабских глифов. Нет отдельного арабского шрифта (например, Noto Sans Arabic). Арабский текст будет рендериться через fallback system-ui
- **?lang=zh:** Inter не содержит китайских иероглифов. Нужен Noto Sans SC или类似
- **Страница /hosts:** Весь контент рендерится через `"use client"` + fetch — поисковики видят пустую страницу. Текст недоступен для SSR
- **Страница /hosts/1:** Аналогично — client-side only, SSR возвращает только Header + Footer
- **Страницы /login, /register:** То же самое — `<main>` содержит только `<template id="B:0">` (React suspense), реальный контент недоступен без JS
- **Страница /services:** Аналогично — client-side rendering, пустой main для краулеров
- **become-host:** Текст `Введите BIC или название банка` — русский текст в армянской версии формы (смешивание языков)

### 📝 Рекомендации
1. **Убрать `font-family` из `globals.css`** — пусть работает Inter из layout.tsx
2. **Подключить Noto Sans Arabic** для `lang=ar|fa` и **Noto Sans SC** для `lang=zh`
3. **Добавить SSR/SSG** для публичных страниц (/hosts, /hosts/[id], /services, /about) — как минимум `generateStaticParams` или Server Components
4. **Исправить смешивание языков** в форме become-host

---

## 02. Color — Цвет

### ✅ Хорошо
- Единая палитра: Armenian Red `#D4001A`, Armenian Orange `#F2A900`, Armenian Blue `#0033A0`, Warm Cream `#FDF6EC`
- CSS-переменные определены в `:root` (`--armenian-red`, `--armenian-orange`, и т.д.)
- Градиент `linear-gradient(135deg, #D4001A, #F2A900)` используется консистентно для CTA-кнопок
- Hover-эффекты: `hover:scale-105`, `hover:shadow-xl`, `card-hover` класс
- Footer: тёмный контраст `bg-gray-950` — отличает от основного контента

### ❌ Проблемы
- **Контраст:** Текст `text-white/70` на градиентном фоне героя (rgba(196,93,62,0.85)) — может не проходить WCAG AA (4.5:1)
- **Контраст:** `placeholder-white/40` на input в hero — очень бледный (0.4 opacity)
- **Контраст:** Footer ссылки `text-gray-400` на `bg-gray-950` — еле читаемо
- **Footer ссылки** не подчёркнуты, цвет `text-gray-400 hover:text-white` — недостаточно отличаются от обычного текста
- **Кнопка "YouTube" в футере:** `href="#"` — ведёт никуда, мёртвая ссылка
- **Цвет активного состояния** nav-link не определён — пользователь не видит текущую страницу в навигации

### 📝 Рекомендации
1. Увеличить opacity текстов на градиентах: `text-white/85` вместо `/70`
2. Placeholder: `placeholder-white/60` минимум
3. Footer ссылки: `text-gray-300` + underline на hover
4. Убрать или скрыть кнопку YouTube пока нет канала
5. Добавить `active` состояние для nav-link (текущая страница)

---

## 03. Hierarchy — Иерархия

### ✅ Хорошо
- Hero секция: приветствие → H1 → подзаголовок → CTA → поиск — отличная иерархия
- Карточки хостов: фото → название → рейтинг/город → описание → бейдж — логичный порядок
- Страница /about: mission → story → values → stats → voice → security — структурировано
- Страница /become-host: пошаговый wizard (шаги 1-4) с прогресс-баром
- CTA-кнопки выделены градиентом и размером

### ❌ Проблемы
- **Страница /compare:** Отображает только Footer при SSR — контент скрыт в CSR, иерархия недоступна
- **Страницы /login, /register:** Пустой `<main>` при SSR — нет fallback контента
- **Навигация:** 7 пунктов в header + сравнение — может быть перегружено для десктопа. Пункты "✨ Услуги", "💭 Опыт", "🎉 События" — слишком много emoji в навигации
- **Мобильная навигация:** Bottom bar имеет "Заявки" (/requests) — но эта страница требует аутентификации и ведёт к profile, неочевидно для нового пользователя

### 📝 Рекомендации
1. Сократить количество emoji в nav или убрать совсем
2. Добавить breadcrumb на /hosts/[id] → /hosts
3. Определить active state для текущей страницы в навигации
4. На мобильном: "Заявки" → показывать только после авторизации

---

## 04. Imagery — Изображения / Визуал

### ✅ Хорошо
- Hero: качественное фото из Unsplash (Армения)
- `next/image` используется для оптимизации (WebP, lazy load, responsive)
- `alt` тексты на всех изображениях — familyName для карточек хостов
- Lightbox компонент для просмотра фото
- Логотип: круглая "H" с градиентом — читается, запоминается

### ❌ Проблемы
- **Hero фото:** Внешний URL Unsplash (`images.unsplash.com`) — если Unsplash недоступен, hero будет пустой
- **Карточки хостов:** `coverPhoto` из Supabase — если БД недоступна, показывает `bg-gray-200` заглушку
- **Нет fallback-изображения** для хостов без фото (просто серый фон `bg-gray-200`)
- **Страница /hosts/1:** При SSR возвращает только Header/Footer — нет noindex для краулеров, но нет и контента
- **Рекомендации:** Те же — нет отзыва о качестве изображений из-за CSR

### 📝 Рекомендации
1. Локально сохранить hero-фото вместо Unsplash URL
2. Создать дефолтный placeholder для хостов без фото (с логотипом HayHome)
3. Добавить `loading="lazy"` для всех ниже-экранных изображений
4. Для `/og-image.png` — проверить реальное существование файла

---

## 05. Motion — Движение / Анимация

### ✅ Хорошо
- Hover-эффекты на карточках: `card-hover` (translateY + shadow)
- Кнопки: `hover:scale-105`, `active:scale-95` — тактильная обратная связь
- Skeleton-лоадеры на /hosts и /hosts/[id] — `animate-pulse`
- Переходы: `transition-all duration-200` — консистентно
- Mobile menu: плавное открытие/закрытие
- Language switcher dropdown: плавное появление
- Image hover: `group-hover:scale-105 transition duration-300` — лёгкий zoom

### ❌ Проблемы
- **Нет transition между страницами** — при навигации происходит резкая смена
- **Нет глобального лоадера** — при медленном интернете страницы /hosts, /services долго пустые
- **Отсутствует `prefers-reduced-motion`** — пользователи с ограничениями по анимации не могут её отключить
- **ChatWidget** — неизвестно, есть ли анимация появления

### 📝 Рекомендации
1. Добавить `@media (prefers-reduced-motion: reduce)` в globals.css
2. Добавить top-loading-bar или page transition
3. Добавить skeleton-лоадеры для /services и /events страниц

---

## 06. Mobile — Мобильная версия

### ✅ Хорошо
- Viewport meta корректный: `width=device-width, initialScale=1, maximumScale=5`
- Mobile bottom bar: 5 вкладок с emoji-иконками
- Mobile menu: hamburger → полноэкранное меню
- Адаптивные сетки: `grid md:grid-cols-2 lg:grid-cols-3`
- CTA кнопки: `w-full sm:w-auto` — на мобилке занимают всю ширину
- Footer: `grid-cols-2 md:grid-cols-4` — адаптивный
- LanguageSwitcher: адаптируется (скрывает label на мобилке `hidden sm:inline`)

### ❌ Проблемы
- **Tap targets в MobileBottomBar:** `py-2` + `text-[10px]` — общая высота ~36px, меньше рекомендованных 44px
- **Нет `min-h-[44px]`** на кнопках bottom bar
- **Горизонтальный скролл:** Секции с `overflow-x-auto` (recently viewed) могут создавать горизонтальный скролл на 375px
- **Hero:** `min-height: 520px` + контент может переполнять маленькие экраны
- **Поиск в hero:** Input на мобилке может быть слишком узким
- **Страница /become-host:** Многошаговая форма — нужен тест на мобилке, шаги могут быть тесными
- **`maximumScale=5`** — позволяет зум, но некоторые элементы могут ломаться

### 📝 Рекомендации
1. Увеличить tap target в bottom bar: `py-3` вместо `py-2` + `min-h-[44px]`
2. Проверить `overflow-x` секции recently viewed на 375px
3. Добавить `scrollbar-hide` для горизонтальных скролл-секций (уже используется в одном месте, распространить)
4. Hero: `min-height: 480px` на мобилке + `py-8` вместо `py-12`

---

## 07. The Invisible Stuff — Невидимые элементы

### ✅ Хорошо
- **Metadata:** title, description, keywords, openGraph, twitter card — всё заполнено
- **OpenGraph:** Изображение, locale, alternateLocale (10 языков) — отлично
- **JSON-LD:** LocalBusiness, Organization, WebSite (с SearchAction) — структурированные данные
- **Manifest:** `/manifest.json` подключён — PWA-ready
- **Apple Web App:** configured (capable, statusBarStyle, title)
- **Viewport:** themeColor `#D4001A` —.branding в браузере
- **Иконки:** `/icon-192.png`, `/icon-512.png` — PWA icons
- **Service Worker:** `ServiceWorkerRegister` компонент подключён
- **CookieBanner:** есть
- **Alternates languages:** 10 `hreflang` вариантов в metadata

### ❌ Проблемы
- **`<html lang="hy">` — ХАРДКОД!** Язык HTML всегда армянский, независимо от выбранного языка. Должен меняться динамически
- **Нет `aria-label` на большинстве кнопок-иконок:**
  - Mobile menu toggle: `aria-label` есть ✅
  - FavoriteButton: нет `aria-label` ❌
  - Compare toggle: нет `aria-label` ❌
  - Lightbox close: нет `aria-label` ❌
  - ChatWidget toggle: неизвестно
- **Нет `nofollow` на внешних ссылках** в Footer (Instagram, Facebook, Telegram)
- **SSR пустой:** Страницы /hosts, /hosts/[id], /services, /compare, /login, /register, /events — поисковики получают пустой main
- **Meta description одинаковый** для всех страниц — `forceDynamic` + `revalidate: 0`, но нет per-page metadata
- **Captcha:** Cloudflare Turnstile — хорошая защита, но может блокировать accessibility tools
- **Нет `<link rel="canonical">`** — дубли страниц с ?lang= параметрами

### 📝 Рекомендации
1. **КРИТИЧНО:** Менять `document.documentElement.lang` при смене языка (как уже делается для `dir`)
2. Добавить `aria-label` на все кнопки-иконки
3. Добавить `rel="nofollow noopener noreferrer"` на соцссылки в Footer
4. Добавить `rel="canonical"` для предотвращения дублей
5. Добавить per-page metadata (generateMetadata) для /hosts, /about, /services
6. Рассмотреть SSR для публичных страниц

---

## 08. Рекурсивность — Все элементы/buttons/pages работают

### ✅ Хорошо
- **Все основные страницы возвращают 200:** /, /hosts, /hosts/1, /become-host, /login, /register, /about, /compare, /services, /rules, /terms, /requisites, /privacy, /partner, /events, /requests/new
- **404 страница:** Красивая, с CTA "На главную"
- **Все ссылки в Footer** ведут на существующие страницы (проверены: /about, /partner, /hosts, /become-host, /register, /login, /terms, /privacy, /rules, /requisites)
- **Формы:** Login и Register валидируются (CAPTCHA после 2 попыток, email/password проверка)
- **Языковой переключатель** работает (client-side через localStorage + context)
- **RTL support** реализован: `document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr")` при смене языка

### ❌ Проблемы
- **КРИТИЧНО — `?lang=` параметр НЕ работает!** Проверка `?lang=ru` и `?lang=en` — контент остаётся на армянском. Причина: `LanguageContext` читает язык только из `localStorage`, а не из URL. Пользователь, перешедший по ссылке `?lang=en`, увидит армянский
- **YouTube ссылка в Footer:** `href="#"` — мёртвая ссылка, ведёт на ту же страницу
- **Страницы из навигации Header:**
  - `/requests/new` ✅ существует, но почти пустая
  - `/events` ✅ существует, контент есть
  - `/services` ✅ существует, но почти пустая при SSR
- **Мобильная навигация `/requests`** — ведёт на /requests, но без авторизации страница может быть пустой
- **Ссылки `hreflang` в metadata** указывают на `/?lang=xx`, но этот параметр не работает (см. выше) — поисковики получат одинаковый контент

### 📝 Рекомендации
1. **КРИТИЧНО:** Читать `?lang=` из URL в `LanguageContext` (useSearchParams) и инициализировать язык из URL
2. **КРИТИЧНО:** Убрать `href="#"` из YouTube-ссылки или скрыть кнопку
3. Добавить redirect/ fallback для `/requests` при отсутствии авторизации
4. Проверить все кнопки в /become-host wizard на работоспособность валидации

---

## 📊 Сводная таблица

| # | Критерий | Оценка | Статус |
|---|----------|--------|--------|
| 01 | Typography | 6/10 | ⚠️ Конфликт шрифтов, нет арабского/китайского, смешивание языков |
| 02 | Color | 7/10 | ⚠️ Несколько проблем контраста, мёртвая ссылка YouTube |
| 03 | Hierarchy | 7/10 | ⚠️ Перегруженная навигация, нет breadcrumb |
| 04 | Imagery | 6/10 | ⚠️ Внешние зависимости, нет placeholder |
| 05 | Motion | 7/10 | ⚠️ Нет prefers-reduced-motion, нет page transitions |
| 06 | Mobile | 7/10 | ⚠️ Tap targets < 44px, потенциальный overflow |
| 07 | Invisible | 4/10 | 🔴 Хардкод lang, мало aria-label, нет canonical, SSR пустой |
| 08 | Рекурсивность | 6/10 | 🔴 ?lang= не работает, YouTube мёртвый |

**Общая оценка: 50/80 (62.5%)**

---

## 🚨 Приоритеты исправления

### 🔴 КРИТИЧНО (P0) — Fix immediately

1. **`?lang=` параметр не работает** — LanguageContext игнорирует URL
   - Файл: `src/contexts/LanguageContext.tsx`
   - Решение: читать `useSearchParams().get('lang')` в `useEffect`

2. **`<html lang="hy">` хардкод** — не меняется при смене языка
   - Файл: `src/app/layout.tsx`
   - Решение: `document.documentElement.lang = lang` в LanguageContext

3. **YouTube `href="#"`** — мёртвая ссылка в Footer
   - Файл: `src/components/Footer.tsx` строка 41
   - Решение: убрать или заменить на реальный URL

4. **SSR пустой для публичных страниц** — SEO катастрофа
   - Страницы: /hosts, /hosts/[id], /services, /compare, /events
   - Решение: Server Components или `generateStaticParams`

### 🟡 ВАЖНО (P1) — Fix soon

5. **Конфликт шрифтов** globals.css vs layout.tsx
6. **Нет арабского/китайского шрифта** — добавить Noto Sans Arabic/SC
7. **Контраст текстов** на градиентах — увеличить opacity
8. **Tap targets < 44px** в MobileBottomBar
9. **aria-labels** на кнопках-иконках (FavoriteButton, Compare, Lightbox)
10. **`rel="canonical"`** — добавить для предотвращения дублей
11. **`prefers-reduced-motion`** — добавить media query

### 🟢 ЖЕЛАТЕЛЬНО (P2) — Backlog

12. Breadcrumb на /hosts/[id]
13. Active state в навигации
14. Placeholder-изображение для хостов без фото
15. Локальное хранение hero-фото
16. Per-page metadata (generateMetadata)
17. Сократить emoji в навигации
18. `nofollow` на внешние ссылки

---

## 🔍 Технические детали аудита

### Метод проверки
- **web_fetch:** 16 URL проверены (12 основных + 4 дополнительных)
- **Анализ кода:** 15+ исходных файлов изучены
- **HTML-структура:** Проверен SSR-вывод через `curl`
- **Мультиязычность:** Проверены `?lang=ru` и `?lang=en` — **не работают**

### Страницы с пустым SSR (SEO-критично)
```
/hosts         → <main> пустой (client-side fetch)
/hosts/[id]    → <main> пустой (client-side fetch)
/services      → <main> пустой (client-side fetch)
/compare       → <main> пустой (client-side fetch)
/login         → <main> пустой (React Suspense)
/register      → <main> пустой (React Suspense)
/events        → частично пустой
/requests/new  → минимальный контент
```

### Что работает хорошо
- ✅ Все 10 языков переведены в translations.ts
- ✅ RTL support для арабского и фарси
- ✅ Структура метаданных (OG, Twitter, JSON-LD)
- ✅ PWA-ready (manifest, service worker, icons)
- ✅ Мобильная навигация (bottom bar)
- ✅ Skeleton-лоадеры для /hosts
- ✅ Cookie banner
- ✅ Аутентификация (login/register/social login)

---

*Аудит завершён. Дата: 14 июля 2026, 16:00 UTC*
*Аудитор: Арарат — CTO Agent HayHome*
