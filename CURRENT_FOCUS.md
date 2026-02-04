# Current Focus — Homescreen (As-Built)

This document describes the **implemented** homescreen so someone else can understand and replicate it. Follow TECH_STACK.md and ENGINEERING_RULES.md for folder structure and conventions.

---

## What Was Built

- **Header only** (no top utility strip; no hero image).
- **Tab navigation** (Hotels active, Flights/Holidays disabled) with category icons and a pill-shaped active indicator.
- **Search form widget** embedded in the header: Where | When | Who, plus a circular purple Search button.
- **Popovers** for Where (suggestions), When (date range calendar), Who (rooms + guests).

---

## 1. Header Section

**File:** `src/features/home/scenes/HomeLanding/components/HomeHeader.tsx`

### 1.1 No Top Strip

- There is **no** top utility strip (phone, promo text, register). The page starts with the main header.

### 1.2 Header Container

- One `<header>` with:
  - Background: `bg-neutral-50/90` (very light grey)
  - Bottom padding: `pb-6`
  - Border: `border-b border-border`, `shadow-sm`
- Content width: `max-w-7xl mx-auto`, horizontal padding `px-4 sm:px-6`.

### 1.3 Logo

- Text: from `content.app.name` (e.g. "Staya" or "STAYA" — see `src/lib/content.ts`).
- Style: **extra bold** (`font-extrabold` or `font-black`), **italic**, **tighter letter spacing** (`tracking-tighter`).
- Links to `/`.

### 1.4 Product Category Tabs (Navigation)

- **Not** capsule-based; **no** outer border around the tab group.
- **Layout:** Horizontal row, icon **left** of label, spacing between tabs (e.g. `gap-3.5`).

**Tabs:**

| Tab     | State    | Icon source              | Notes                    |
|--------|----------|---------------------------|--------------------------|
| Hotels | Active   | `assets.icons.hotel`      | Pill indicator, primary  |
| Flights| Disabled | `assets.icons.flight`     | `opacity-80`             |
| Holidays | Disabled | `assets.icons.holidays` | `opacity-80`             |

**Active indicator:**

- **Shape:** Capsule (pill) — full-width bar with `rounded-full`, not a sharp rectangle.
- **Implementation:** CSS `after:` on the active tab button: `after:absolute after:bottom-0 after:left-0 after:right-0 after:block after:h-1 after:rounded-full after:bg-primary after:content-['']`.
- **Width:** Full width of the tab (`after:left-0 after:right-0`), so the pill spans the whole tab content.

**Icons:**

- From **public:** `public/icons/hotel_icon.png`, `flight_icon.png`, `holidays_icon.png`.
- Use **assets getter:** `src/lib/assets.ts` → `assets.icons.hotel`, `.flight`, `.holidays`.
- Render with Next.js `Image`; size e.g. 35px; `object-contain`; inactive tabs use `opacity-80`.

**Right side of nav row:**

- “More” menu button (Lucide `Menu`), ghost, rounded-full.
- Call/Support button (Lucide `PhoneCall`), ghost, rounded-full.
- Labels from `content.nav.moreMenuAria`, `content.nav.callSupportAria`.

### 1.5 Spacing Between Tabs and Search Widget

- Margin above the search widget row: e.g. `mt-5` so there is clear space between the tab row and the form.

---

## 2. Search Form Widget

**File:** `src/features/home/scenes/HomeLanding/components/HeroWidget.tsx`

### 2.1 Container

- **Max width:** `max-w-[50vw]`, centered (`mx-auto`).
- **Shape:** Rounded corners — e.g. `rounded-[2rem]` (max radius).
- **Border:** Single outer border; **no** border on individual fields.
- **Fields separated by** vertical dividers (`w-px bg-border`) **between** fields only; dividers do **not** touch the outer border; no divider to the right of the Guest (Who) field.

### 2.2 Visible Fields (First View)

Three fields in one row (stack on small screens):

1. **Where** — Search destination (text input + suggestion list).
2. **When** — Date range (check-in → check-out).
3. **Who** — Guests (rooms, adults, children).

Then the **Search** button.

### 2.3 Where (Search Destination)

- **Behaviour:**
  - User can **type** in the field.
  - User can **select** only from the dropdown list (no free-form “submit” of typed text).
  - On **dismiss** of the popover without selecting, **default to the first suggestion** (e.g. `content.hero.whereSuggestions[0]`).
- **UI:**
  - Text **input** (controlled, value from state).
  - **No** focus ring / active border on the field (no `focus-within:ring-*` or input focus ring).
- **Popover:**
  - Use **PopoverAnchor** (not PopoverTrigger) so opening is controlled by focus/click and does not toggle-close when typing.
  - Anchor wraps the input container; open on input focus (and e.g. container click that focuses input via ref).
  - List of suggestions from `content.hero.whereSuggestions`; on item click: set value and close popover.
  - On close (e.g. outside click): set value to first suggestion if none selected.
- **Copy:** Placeholder and list content from `content.hero` (e.g. `wherePlaceholder`, `whereSuggestions`).

### 2.4 When (Date Range)

- **Trigger:** Button showing selected range or placeholder (e.g. “Add dates”).
- **Popover:** Calendar with **two months**, **range** selection (check-in to check-out).
- **Rules:**
  - **No past dates** (disable dates before today).
  - **Default range:** e.g. today → today + 1 night (configurable; see `DATE_PICKER_CONFIG` in HeroWidget).
  - **Min nights:** e.g. 1 (user can book one night).
  - Selected range uses **primary** (purple) accent.
- **Calendar component:** e.g. `src/components/ui/calendar.tsx` (react-day-picker, range mode, `numberOfMonths={2}`). Ensure nav arrows do **not** overlap the grid (e.g. caption padding / grid margins).

### 2.5 Who (Guests / Rooms)

- **Trigger:** Button showing guest count (e.g. “1 Guest”, “3 Guests”).
- **Popover:**
  - **Rooms:** “Add room” and per-room **Adults** and **Children** with +/- controls.
  - Copy from `content.hero`: `roomLabel`, `addRoom`, `adultsLabel`, `childrenLabel`, etc.
- **No** vertical divider (no right border) between the Who field and the Search button.

### 2.6 Search Button

- **Shape:** Circular (`rounded-full`), fixed size (e.g. `h-12 w-12`).
- **Color:** Primary (purple): `bg-primary text-primary-foreground`.
- Icon: Lucide `Search`.
- Label: `content.hero.searchButton`; use `aria-label` for accessibility.

---

## 3. Content and Assets (No Hardcoding)

- **Strings and list data:** All in `src/lib/content.ts` (e.g. `content.app.name`, `content.nav.*`, `content.hero.*`). No hardcoded copy in components.
- **Icons (nav tabs):** Paths from `src/lib/assets.ts` → `assets.icons.hotel`, `.flight`, `.holidays` (pointing to `public/icons/*.png`).
- **Images (if any):** Use `content.images.*` or `assets` so localisation/CDN can be added later.

---

## 4. UI Primitives and Styling

- **Design:** Clean, spacious, soft shadows, rounded corners; primary accent = purple (Staya).
- **Typography:** e.g. DM Sans (or as in `layout.tsx`); logo as above (extra bold, italic, tight tracking).
- **Components:** Use existing UI building blocks (Button, Input, Popover, Calendar) from `src/components/ui/`. Button supports `asChild` (e.g. with Radix Slot) for the logo/tab links.
- **Icons:** Lucide React for everything except nav category icons, which use PNGs from `public/icons/` via `assets`.

---

## 5. Behaviour Summary

- **No** top utility strip.
- **Tabs:** Only Hotels active; Flights/Holidays disabled. Active tab has a **full-width pill** bar in primary, not a sharp rectangle.
- **Where:** Type + select from list only; on dismiss, default to first suggestion; no focus ring.
- **When:** Two-month range calendar; no past dates; default range and min nights configurable; primary for selected range.
- **Who:** Rooms with adults/children; no divider to the right of the field.
- **Search:** Circular, purple; no real submit yet (e.g. offline toast only if needed).
- **Layout:** Header (logo + tabs + search widget) only; body below can stay minimal/empty.

---

## 6. Files to Touch for Replication

| Purpose              | File(s) |
|----------------------|--------|
| Header + logo + tabs | `src/features/home/scenes/HomeLanding/components/HomeHeader.tsx` |
| Search form + popovers | `src/features/home/scenes/HomeLanding/components/HeroWidget.tsx` |
| Copy / strings       | `src/lib/content.ts` |
| Icon/image paths     | `src/lib/assets.ts` |
| Calendar UI          | `src/components/ui/calendar.tsx` |
| Popover              | `src/components/ui/popover.tsx` |
| Button               | `src/components/ui/button.tsx` |

Scene entry: `HomeLandingScene.tsx` composes `HomeHeader` (which includes `HeroWidget`).

---

## 7. Out of Scope (Current Phase)

- No real search/booking/API/auth.
- No hero background image.
- No top utility strip.
- Flights/Holidays are UI-only (disabled).

This phase is **visual structure and interaction patterns** for the header and search widget only.
