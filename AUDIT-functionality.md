# Functionality Audit Report — Buttons, Links, Modals

**Project:** HayHome (hay-home.com)  
**Date:** 2026-06-25  
**Auditor:** Арарат (automated subagent)

---

## CRITICAL (Broken links / 404s / Missing functions / Bugs)

| # | Page | Element | Action Expected | Issue |
|---|------|---------|----------------|-------|
| 1 | /book/[id] | Success screen "My bookings" link | Link text should be dynamic | **BUG: Ternary expression is raw JSX text, not rendered.** `lang === "ru" ? "Мои бронирования" : ...` appears as literal text in the browser instead of being evaluated. The expression is not wrapped in `{}`. |
| 2 | /compare | "Add to compare" (HostCard) → /compare | Compare page | **Works, but compare page URL needs `?ids=` params.** HostCard uses localStorage key `hayhome_compare` to store IDs. The `/compare` page reads from `?ids=` URL params, **NOT from localStorage**. Compare button adds to localStorage but compare page reads URL params — **mismatch!** Users clicking compare on HostCard will see empty compare page. |
| 3 | Footer | Social links (Instagram, Facebook, Telegram, YouTube) | Open social profiles | All `href="#"` — **dead placeholder links, do nothing.** |
| 4 | Footer | `mailto:info@hayhome.am` | Open email client | **Potential inconsistency:** Privacy/Terms/Rules pages use `mailto:hayhome.arm@gmail.com` but Footer uses `mailto:info@hayhome.am`. Two different email addresses used across the site. |

## MEDIUM (Button exists but function incomplete / wrong / UX issues)

| # | Page | Element | Issue |
|---|------|--------|-------|
| 5 | /hosts/[id] | Review media upload buttons (Add Photo, Add Audio, Add Video) | All three buttons trigger the **same** hidden file input with `accept="image/*,audio/*,video/*"`. No way to distinguish which media type the user intended. |
| 6 | /hosts/[id] | "Must be guest" message shown to logged-in users | `canReview` is hardcoded to `true` for all logged-in users (demo mode), but the "must be guest" message (`mustBeGuest`) is still rendered when `canReview === false` — which can never happen. Dead code / misleading UX path. |
| 7 | /hosts/[id] | "Write message" (ChatWidget) | Only shown if `user && host.user_id`. If `host.user_id` is undefined/null (some hosts may not have it), the chat button won't appear even for logged-in users. |
| 8 | /hosts | "Value" sort option | Fetches `/api/ratings` for value ranks. If the API fails silently, all hosts get rank 999 and sort order is arbitrary. No user feedback. |
| 9 | /hosts | Search input in hero (homepage) | Uses `window.location.href` for Enter key instead of Next.js `router.push`. Causes full page reload. |
| 10 | /partner/register | Success state | After registration, shows ref link and "Go to Dashboard" button. But no actual auth/login happens — user is not logged in. Clicking dashboard will redirect to login. |
| 11 | /partner/dashboard | Requires auth check | Redirects to `/login` if no user, then to `/dashboard` if user exists (regardless of partner status). Any logged-in user can see partner dashboard. |
| 12 | /provider/register | After submit | Calls `router.push("/provider/dashboard")` but doesn't verify the user became a provider. May show empty dashboard. |
| 13 | /payment/success & /payment/cancel | Links | Both pages link to `/dashboard` and `/hosts`. No booking reference or payment details shown beyond static text. |
| 14 | /book/[id] | Payment method selection | "On site" and "Transfer" options are UI-only. The `paymentMethod` state is **never sent to the API** in `handleSubmit`. The booking API receives no payment method info. |

## LOW (UX issues / minor)

| # | Page | Detail |
|---|------|--------|
| 15 | /hosts/[id] | Host photo upload for owner: the `ref={setHostPhotoInput}` pattern works but the input is always mounted (just hidden), not lazily created. Minor. |
| 16 | /book/[id] | Draft auto-save to localStorage works but has no UI indicator or way to clear it manually. |
| 17 | /dashboard | "No bookings" empty state links to /hosts — works fine. |
| 18 | /admin | No explicit route guard — relies on client-side `role === "admin"` check. API should also verify. |
| 19 | /become-host | AI improve text buttons call `/api/ai/improve-text` — works but no loading spinner visible to user (only `disabled` state). |
| 20 | /events | Event modal closes on backdrop click and X button — works correctly. |
| 21 | Language switcher | Works via context. All `useLang()` hooks properly use language from context. |

## Modals Audit

| Page | Modal Trigger | Opens? | Content OK? | Close works? |
|------|-------------|--------|-------------|---------------|
| /events | Click event card | ✅ | ✅ Event details | ✅ Backdrop click, X button |
| /hosts/[id] | ChatWidget (via "Write message") | ✅ | ✅ Chat interface | ✅ Close button |
| /book/[id] | Auth required overlay | ✅ (conditional) | ✅ Login/Register links | ❌ No close — must login or use back button |
| /book/[id] | Success overlay | ✅ (conditional) | ⚠️ Broken text (see #1) | ❌ No close — must click a link |
| /dashboard/calendar | Date popup | ✅ | ✅ Date details | ✅ Backdrop click, X button |
| /hosts, homepage | Lightbox (click image) | ✅ | ✅ Image gallery | ✅ Close via LightboxContext |
| /header | User dropdown menu | ✅ | ✅ Profile/admin/logout links | ✅ Click outside or select item |

## Forms Audit

| Page | Fields | Validation | Submit Action | API Exists? |
|------|--------|-----------|---------------|-------------|
| /login | email, password | Required fields | POST /api/auth/login → redirect | ✅ |
| /register | name, email, password, confirmPassword | Required, password match | POST /api/auth/register → redirect | ✅ |
| /forgot-password | email | Required | POST /api/auth/forgot-password | ✅ |
| /reset-password | password, confirmPassword | Required, password match | POST /api/auth/reset-password | ✅ |
| /book/[id] | name, email, phone, country, checkIn, checkOut, guests, message, time, paymentMethod | Required fields, date validation | POST /api/bookings | ✅ |
| /services/book/[id] | guests, timeOfDay, date, paymentMethod | Required | POST /api/service-bookings | ✅ |
| /become-host | Multi-step: name, description, longDescription, amenities, experiences, languages, photos | Required per step | POST /api/hosts | ✅ |
| /partner/register | name, email, agree to terms | Required | POST /api/partners | ✅ |
| /provider/register | name, description, category, photos | Required | POST /api/providers → redirect | ✅ |

## API Endpoints Audit

| Endpoint | Route exists? | Referenced by |
|----------|--------------|---------------|
| /api/auth/login | ✅ | /login |
| /api/auth/register | ✅ | /register |
| /api/auth/logout | ✅ | Header |
| /api/auth/me | ✅ | AuthContext |
| /api/auth/forgot-password | ✅ | /forgot-password |
| /api/auth/reset-password | ✅ | /reset-password |
| /api/hosts | ✅ | Homepage, /hosts |
| /api/hosts/[id] | ✅ | /hosts/[id], /book/[id] |
| /api/hosts/[id]/notes | ✅ | /admin |
| /api/bookings | ✅ | /book/[id], /dashboard, /admin |
| /api/bookings/[id] | ✅ | /dashboard, /admin |
| /api/reviews | ✅ | /hosts/[id], Homepage |
| /api/services | ✅ | /services |
| /api/service-bookings | ✅ | /services/book/[id] |
| /api/partners | ✅ | /partner/register |
| /api/partners/payout | ✅ | /partner/dashboard |
| /api/chat (conversations) | ✅ | ChatWidget, /admin, /dashboard |
| /api/chat/unread | ✅ | ChatWidget |
| /api/chat/conversations | ✅ | ChatWidget |
| /api/favorites | ✅ | FavoriteButton |
| /api/upload | ✅ | /hosts/[id], /become-host, /provider/register, /admin |
| /api/providers | ✅ | /provider/register |
| /api/payments/create | ✅ | (not directly referenced in pages — used via webhook) |
| /api/payments/webhook | ✅ | External payment provider callback |
| /api/promocodes | ✅ | /book/[id] |
| /api/ai/improve-text | ✅ | /become-host |
| /api/compare | ✅ | /compare |
| /api/ratings | ✅ | /hosts |
| /api/calendar | ✅ | /book/[id] |

## Recursive Link Map (Page → Links → Pages)

| Source Page | Link/Button | Target Page | Target Exists? |
|-------------|-------------|-------------|-----------------|
| **Homepage (/)** | "Найти семью" | /hosts | ✅ |
| **Homepage** | "Стать хостом" | /become-host | ✅ |
| **Homepage** | "🤝 Партнёрская программа" | /partner | ✅ |
| **Homepage** | Host cards (×10) | /hosts/[id] | ✅ |
| **Homepage** | "Все семьи" | /hosts | ✅ |
| **Homepage** | "Стать хостом" (CTA) | /become-host | ✅ |
| **Homepage** | Recently viewed | /hosts/[id] | ✅ |
| **Header** | Logo | / | ✅ |
| **Header** | Семьи | /hosts | ✅ |
| **Header** | Стать хостом | /become-host | ✅ |
| **Header** | О нас | /about | ✅ |
| **Header** | Услуги | /services | ✅ |
| **Header** | События | /events | ✅ |
| **Header** | Сравнить | /compare | ✅ (but see issue #2) |
| **Header** | Dropdown → Мой профиль | /dashboard | ✅ |
| **Header** | Dropdown → Партнёрство | /partner | ✅ |
| **Header** | Dropdown → Панель провайдера | /provider/dashboard | ✅ |
| **Header** | Dropdown → Админ | /admin | ✅ |
| **Header** | Dropdown → Выйти | (logout function) | ✅ |
| **Header** | Login button | /login | ✅ |
| **Header** | Register button | /register | ✅ |
| **Footer** | Семьи | /hosts | ✅ |
| **Footer** | Стать хостом | /become-host | ✅ |
| **Footer** | О нас | /about | ✅ |
| **Footer** | Партнёрство | /partner | ✅ |
| **Footer** | Найти семью | /hosts | ✅ |
| **Footer** | Принять гостей | /become-host | ✅ |
| **Footer** | Регистрация | /register | ✅ |
| **Footer** | Войти | /login | ✅ |
| **Footer** | Условия | /terms | ✅ |
| **Footer** | Конфиденциальность | /privacy | ✅ |
| **Footer** | Правила | /rules | ✅ |
| **Footer** | Social links | href="#" | ❌ Dead |
| **Footer** | info@hayhome.am | mailto: | ⚠️ Inconsistent email |
| **HostCard** | Card → | /hosts/[id] | ✅ |
| **HostCard** | Compare button | /compare (via localStorage) | ⚠️ See issue #2 |
| **HostCard** | Favorite button | /api/favorites (POST/DELETE) | ✅ |
| **/hosts** | Reset filters | (clears state) | ✅ |
| **/hosts** | List/Map toggle | (switches view) | ✅ |
| **/hosts/[id]** | ← Back to list | /hosts | ✅ |
| **/hosts/[id]** | "Забронировать" | /book/[id] | ✅ |
| **/hosts/[id]** | Write message | ChatWidget (inline) | ✅ |
| **/hosts/[id]** | Favorite button | FavoriteButton component | ✅ |
| **/hosts/[id]** | Submit review | POST /api/reviews | ✅ |
| **/book/[id]** | ← Back to profile | /hosts/[id] | ✅ |
| **/book/[id]** | Login required → Login | /login?redirect=/book/[id] | ✅ |
| **/book/[id]** | Login required → Register | /register?redirect=/book/[id] | ✅ |
| **/book/[id]** | Success → Dashboard | /dashboard | ✅ (text bug) |
| **/book/[id]** | Success → Find more | /hosts | ✅ |
| **/services** | Service → Book | /services/book/[id] | ✅ |
| **/services/book/[id]** | ← Back | /services | ✅ |
| **/services/book/[id]** | Success → /services | /services | ✅ |
| **/become-host** | ← Home | / | ✅ |
| **/login** | ← Logo → Home | / | ✅ |
| **/login** | Forgot password | /forgot-password | ✅ |
| **/login** | Register | /register | ✅ |
| **/login** | Become host | /become-host | ✅ |
| **/register** | ← Logo → Home | / | ✅ |
| **/register** | Login | /login | ✅ |
| **/register** | Become host | /become-host | ✅ |
| **/forgot-password** | ← Logo → Home | / | ✅ |
| **/forgot-password** | Login | /login | ✅ |
| **/reset-password** | ← Logo → Home | / | ✅ |
| **/reset-password** | Login | /login | ✅ |
| **/compare** | ← Back | /hosts | ✅ |
| **/compare** | Host name → Profile | /hosts/[id] | ✅ |
| **/compare** | Book button | /book/[id] | ✅ |
| **/dashboard** | Admin button | /admin | ✅ |
| **/dashboard** | Invite link copy | (clipboard) | ✅ |
| **/dashboard** | Partner register CTA | /partner/register | ✅ |
| **/dashboard** | Booking → host profile | /hosts/[id] | ✅ |
| **/dashboard** | Booking → reviews | /hosts/[id]#reviews | ⚠️ Anchor only, no scroll handler |
| **/dashboard** | Become host CTA | /become-host | ✅ |
| **/dashboard** | Full calendar | /dashboard/calendar | ✅ |
| **/partner** | Register CTA | /partner/register | ✅ |
| **/partner/register** | Login | /login | ✅ |
| **/partner/register** | Dashboard | /partner/dashboard | ✅ |
| **/partner/dashboard** | Login | /login | ✅ |
| **/partner/dashboard** | Register | /partner/register | ✅ |
| **/provider/register** | ← Home | / | ✅ |
| **/provider/register** | After submit → Dashboard | /provider/dashboard | ✅ |
| **/provider/dashboard** | My profile | /dashboard | ✅ |
| **/payment/success** | Dashboard | /dashboard | ✅ |
| **/payment/success** | Find hosts | /hosts | ✅ |
| **/payment/cancel** | Dashboard | /dashboard | ✅ |
| **/payment/cancel** | Find hosts | /hosts | ✅ |
| **/privacy** | ← Home | / | ✅ |
| **/terms** | ← Home | / | ✅ |
| **/rules** | ← Home | / | ✅ |
| **/about** | Find families | /hosts | ✅ |
| **/about** | Become host | /become-host | ✅ |

## Summary

### Critical: 4 issues
1. **Broken JSX** in /book/[id] success screen — ternary not wrapped in `{}`
2. **Compare feature broken** — HostCard saves to localStorage, /compare reads URL params
3. **Dead social links** — all `href="#"` in Footer
4. **Email inconsistency** — `info@hayhome.am` vs `hayhome.arm@gmail.com`

### Medium: 10 issues
- Review media upload buttons all trigger same input
- canReview hardcoded true, dead code path
- ChatWidget conditional on host.user_id
- Value sort fails silently
- Homepage search causes full reload
- Partner/provider registration flow doesn't auto-login
- Payment method not sent to API
- No route guards on admin/partner/provider pages (server-side)

### Low: 7 issues
- Minor UX improvements noted

### All API endpoints exist and are properly referenced (chat uses /api/chat/ instead of /api/messages/).
### All page routes exist — no 404s from link targets.
