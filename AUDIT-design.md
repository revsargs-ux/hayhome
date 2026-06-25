# Design & UX Audit Report

## CRITICAL (Broken UI / literal code showing)

| Page | Issue | Details |
|------|-------|---------|
| — | Нет критических багов с `{variable}` | Ранее обнаруженный `{host.rating}` — исправлен. Все шаблонные переменные интерполируются через JSX. |

## MEDIUM (Wrong colors / responsive issues)

### Color Violations (blue/purple вместо warm scheme)

| File | Found Color | Expected | Component |
|------|-------------|----------|-----------|
| `src/app/hosts/[id]/page.tsx:386` | `bg-blue-50 text-blue-800 border-blue-100` | `bg-amber-50 text-amber-800 border-amber-100` (теги языков) |
| `src/app/hosts/[id]/page.tsx:551` | `bg-purple-50 border-purple-200` | `bg-amber-50 border-amber-200` (иконка опыта) |
| `src/app/admin/page.tsx:188` | `text-blue-600` | `text-amber-600` (статистика) |
| `src/app/admin/page.tsx:290,690` | `bg-blue-500 hover:bg-blue-600` | `bg-amber-500 hover:bg-amber-600` (кнопки) |
| `src/app/admin/page.tsx:388` | `bg-purple-100 text-purple-700` / `bg-blue-100 text-blue-700` | `bg-amber-100 text-amber-700` / `bg-red-100 text-red-700` (роли) |
| `src/app/admin/page.tsx:734,841` | `bg-blue-100 text-blue-700` | `bg-green-100 text-green-700` (статусы confirmed/completed) |
| `src/app/dashboard/page.tsx:205` | `text-purple-700 bg-purple-50` | `text-amber-700 bg-amber-50` (ссылка на админку) |
| `src/app/dashboard/page.tsx:222` | `text-blue-500` | `text-amber-500` (стат confirmed) |
| `src/app/dashboard/page.tsx:223` | `text-purple-500` | `text-red-500` (стат bookings) |
| `src/app/dashboard/page.tsx:315` | `bg-blue-100 text-blue-700` | `bg-green-100 text-green-700` (confirmed) |
| `src/app/dashboard/page.tsx:729` | `text-blue-600` | `text-amber-600` (геолокация) |
| `src/app/compare/page.tsx:173,307` | `bg-blue-50 text-blue-700` | `bg-amber-50 text-amber-700` (языки) |
| `src/app/book/[id]/page.tsx:332,428` | `bg-blue-50 border-blue-200 text-blue-700` | `bg-amber-50 border-amber-200 text-amber-700` (info boxes) |
| `src/app/become-host/page.tsx:220-252` | `border-purple-300 bg-purple-50 text-purple-600 text-purple-700` (AI block) | `border-amber-300 bg-amber-50 text-amber-600 text-amber-700` |
| `src/app/partner/dashboard/page.tsx:126` | `text-blue-600` | `text-amber-600` (иконка) |
| `src/app/partner/dashboard/page.tsx:500` | `bg-blue-100 text-blue-700` | `bg-green-100 text-green-700` (completed) |
| `src/components/NavigatorLinks.tsx:20` | `bg-blue-50 text-blue-700 border-blue-200` | `bg-amber-50 text-amber-700 border-amber-200` |
| `src/components/HostCard.tsx:143` | `bg-blue-50 text-blue-700` | `bg-amber-50 text-amber-700` (языки) |

**Итого: ~30 occurrences** в 11 файлах. Градиенты CTA — корректны (`#D4001A → #F2A900`), events page gradient корректный.

### Responsive Design

| Page | Issue | Details |
|------|-------|---------|
| `src/app/admin/page.tsx` | Таблицы не адаптивны | Нет `overflow-x-auto` на таблице, горизонтальный скролл на мобильных |
| `src/app/hosts/[id]/page.tsx` | Галерея фото | Grid 4 колонки без адаптации для мобильных (нет `grid-cols-2 sm:grid-cols-4`) |
| `src/app/book/[id]/page.tsx` | Форма бронирования | Нужно проверить двухколоночный лэйаут на мобильных |

## LOW (Minor UX improvements)

| Page | Issue | Details |
|------|-------|---------|
| `src/components/Map.tsx:206` | `<img>` без `alt` | Нужно добавить `alt` к маркерам на карте |
| `src/components/ServiceMap.tsx:90` | `<img>` без `alt` | Маркеры сервисов без alt |
| `src/components/Lightbox.tsx:102` | `<Image>` без `alt` | Fullscreen фото без описания |
| `src/app/provider/register/page.tsx:292` | `<img alt="">` | Пустой alt, лучше описать загруженное фото |
| `src/app/layout.tsx:105` | `<img alt="">` | Логотип без описания |
| `src/app/dashboard/page.tsx:461,933` | `<img>` вместо `<Image>` | Используется нативный img — нет оптимизации Next.js |
| Buttons | Нет aria-label | Большинство кнопок не имеют aria-label (только фаворит и лайтбокс имеют) |
| Forms | Нет `<label>` для некоторых inputs | Поля поиска с placeholder, но без связанных `<label>` элементов |
| Keyboard | Нет `focus-visible` стилей | Не обнаружены явные `focus-visible` или `focus:ring` классы |
| Empty states | Отсутствуют | Нет текстов для «нет бронирований», «нет хостов» и т.д. (кроме loading states) |
| Error states | Минимальные | API ошибки обрабатываются, но UI не показывает дружественное сообщение |

## Image Audit

| Image Source | Exists? | Used In |
|-------------|---------|---------|
| `/public/hero-bg.jpg` | ✅ 74KB | Главная страница |
| `/public/icon-192.png` | ✅ | PWA manifest |
| `/public/icon-512.png` | ✅ | PWA manifest |
| `/public/manifest.json` | ✅ | PWA |
| `/public/sw.js` | ✅ | Service Worker |
| `/public/robots.txt` | ✅ | SEO |
| Unsplash (about page) | ⚠️ External CDN | `photo-1574362848149`, `photo-1414235077428` — зависит от доступа |
| Host photos (Supabase) | ⚠️ Runtime | Зависят от доступности Supabase storage |
| Profile avatars | ⚠️ Runtime | Нет fallback-аватара при отсутствии фото |

## Empty State Audit

| Page | Empty State? | What Shows? |
|------|-------------|-------------|
| Hosts listing | Частично (skeleton) | Skeleton loading, но нет «ничего не найдено» при пустом фильтре |
| Dashboard bookings | ❌ Нет | Пустой div если нет бронирований |
| Messages/Chat | ✅ Есть | ChatWidget показывает empty state |
| Services book | ✅ Есть | Показывает empty state при 0 сервисах |
| Compare | ❌ Нет | Нет сообщения «добавьте хостов для сравнения» |

## PWA Status

| Component | Status | Details |
|-----------|--------|---------|
| manifest.json | ✅ OK | Имя, иконки, theme_color #D4001A |
| Service Worker | ✅ OK | `sw.js` + `ServiceWorkerRegister` компонент |
| Offline capability | ⚠️ Basic | SW зарегистрирован, но нужно проверить кеширование стратегии |
| Apple Web App | ✅ OK | `appleWebApp` в metadata |

## SEO Status

| Component | Status | Details |
|-----------|--------|---------|
| Root metadata | ✅ OK | title, description, OG, Twitter Card |
| Per-page metadata | ❌ Отсутствует | Только корневой layout имеет OG tags, внутренние страницы не переопределяют metadata |
| JSON-LD | ❌ Нет | Структурированных данных (Organization, LocalBusiness) не обнаружено |
| Alt text | ⚠️ Частично | Большинство images имеют alt, но несколько пропущено |

## Font Status

- Next.js по умолчанию подгружает системные шрифты (нет явного `@font-face` или Google Fonts import в layout)
- Рекомендация: добавить `next/font/google` с Inter для консистентности
