# CLAUDE_VERIFY.md — Верификация утверждений о фиксе UI/UX аудита

**Дата проверки:** 2026-07-14  
**Проверил:** Арарат (сабагент)  
**Метод:** Чтение реального кода, без правок

---

## 🔴 Критичные

### 1. `?lang=` параметр работает

**Файл:** `src/contexts/LanguageContext.tsx`

❌ **НЕТ** — `LanguageContext.tsx` **не читает** `?lang=` параметр из URL.

В коде нет ни `useSearchParams`, ни `URLSearchParams`, ни `window.location.search`. 

Логика инициализации:
```tsx
const [lang, setLangState] = useState<LangCode>("hy");
useEffect(() => {
  const saved = localStorage.getItem("hayhome_lang") as LangCode | null;
  if (saved && t[saved]) setLangState(saved);
}, []);
```

Приоритет: **hardcoded "hy" → localStorage**. URL param полностью игнорируется.

В `layout.tsx` есть `alternates.languages` с `?lang=ru` и т.д. (для SEO), но переключения языка по реальному URL-параметру **нет**.

---

### 2. `<html lang="hy">` больше не хардкод

**Файл:** `src/contexts/LanguageContext.tsx` + `src/app/layout.tsx`

❌ **НЕТ** — оба файла не обновляют `document.documentElement.lang`.

- В `LanguageContext.tsx` **нет** `document.documentElement.lang = ...` нигде
- В `setLang()` обновляется только `dir` (RTL/LTR): `document.documentElement.setAttribute("dir", ...)`
- В `layout.tsx` остался **хардкод**: `<html lang="hy" className={...}>`

Язык `<html>` всегда `"hy"` независимо от выбранного языка.

---

### 3. YouTube `href="#"` заменён на реальную ссылку

**Файл:** `src/components/Footer.tsx`

❌ **НЕТ** — YouTube ссылка осталась как `href="#"`.

```tsx
{ label: "YouTube", href: "#", icon: "▶️" },
```

Остальные соцсети имеют реальные ссылки (Instagram, Facebook, Telegram), а YouTube — нет.

---

### 4. SSR для /hosts — серверный компонент

**Файл:** `src/app/hosts/page.tsx`

❌ **НЕТ** — страница осталась **клиентским компонентом**.

Первая строка файла: `"use client";`

Данные загружаются через `fetch("/api/hosts")` в `useEffect` — это CSR (client-side rendering), а не SSR. Без JavaScript страница покажет только loading-скелетон.

---

## 🟡 Важные

### 5. Конфликт шрифтов исправлен

**Файл:** `src/app/globals.css`

❌ **НЕТ** — конфликт **не исправлен**.

`globals.css` строка 12:
```css
body {
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
}
```

Хардкод `'Segoe UI', Arial` остался. При этом в `layout.tsx` body имеет inline-стиль `fontFamily: 'var(--font-inter), system-ui, sans-serif'` — inline стиль побеждает CSS, но конфликт правил **как был, так и есть**. `globals.css` не использует `var(--font-inter)`.

---

### 6. Шрифты для арабского/китайского (Noto Sans Arabic, Noto Sans SC)

**Файлы:** `src/app/layout.tsx`, `src/app/globals.css`

❌ **НЕТ** — не добавлены.

- В `layout.tsx` импортирован **только** `Inter`: `import { Inter } from "next/font/google"`
- Нет импортов `Noto_Sans_Arabic` или `Noto_Sans_SC`
- В `globals.css` нет правил `:lang(ar)`, `:lang(fa)`, `:lang(zh)`

---

### 7. `prefers-reduced-motion`

**Файл:** `src/app/globals.css`

❌ **НЕТ** — блок `@media (prefers-reduced-motion: reduce)` отсутствует.

В CSS есть анимации (`fadeUp`, `pulse-dot`, `card-hover`), но ни одна не отключается для пользователей с `prefers-reduced-motion`.

---

### 8. Tap targets 44px в MobileBottomBar

**Файл:** `src/components/MobileBottomBar.tsx`

❌ **НЕТ** — размеры недостаточны.

Текущий класс ссылок: `py-2` (8px вертикальный padding).  
Нет `min-h-[44px]`. Нет `py-3` или `py-2.5`.

Иконка `text-lg` + текст `text-[10px]` + `py-2` = общая высота примерно ~32-36px, что меньше рекомендуемых 44px.

---

### 9. `aria-label` на кнопках

**Файлы:** `src/components/`

⚠️ **ЧАСТИЧНО** — aria-label есть на **некоторых** компонентах, но не на тех, что заявлены.

Найдено:
- ✅ `FavoriteButton.tsx` — aria-label на кнопке избранного
- ✅ `StarRating.tsx` — aria-label на рейтинге
- ✅ `Header.tsx` — aria-label на кнопке меню
- ✅ `ChatWidget.tsx` — aria-label на кнопке чата
- ✅ `Lightbox.tsx` — aria-label на кнопках close/prev/next

❌ НЕТ на:
- Кнопках фильтров в `/hosts/page.tsx` (кнопка "Фильтры", переключатель list/map)
- Range input для звёзд (minStars) — нет aria-label
- Select для региона — нет aria-label
- Кнопках смены языка (если есть)

---

### 10. `rel=canonical` в metadata

**Файл:** `src/app/layout.tsx`

❌ **НЕТ** — canonical отсутствует.

В `metadata` есть `alternates.languages` с hreflang-ссылками, но **нет** `alternates.canonical`.

Нужно: `alternates: { canonical: 'https://hay-home.com', languages: {...} }`

---

## 📊 ИТОГ

| # | Утверждение | Статус |
|---|------------|--------|
| 1 | `?lang=` параметр работает | ❌ НЕТ |
| 2 | `<html lang>` динамический | ❌ НЕТ |
| 3 | YouTube ссылка исправлена | ❌ НЕТ |
| 4 | SSR для /hosts | ❌ НЕТ |
| 5 | Конфликт шрифтов | ❌ НЕТ |
| 6 | Шрифты ar/zh | ❌ НЕТ |
| 7 | prefers-reduced-motion | ❌ НЕТ |
| 8 | Tap targets 44px | ❌ НЕТ |
| 9 | aria-label | ⚠️ ЧАСТИЧНО |
| 10 | canonical | ❌ НЕТ |

### Результат: 0 из 10 полностью исправлены. 1 частично.

**Ни одно из критических утверждений Клода не подтвердилось.**  
Код остался в исходном состоянии — изменения не внесены.

---

*Проверка выполнена 2026-07-14 Араратом (сабагент). Только чтение, без правок кода.*
