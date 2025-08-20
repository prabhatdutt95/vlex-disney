# Disney Character Explorer 🏰✨

Explore Disney characters using **Lit (Web Components) + TypeScript + Vite**. Search by name, filter by films/TV shows/video games, mark favorites, and share the exact search via URL query params. Includes accessibility, structured data, and Core Web Vitals optimizations.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Production Build](#production-build)
- [Project Structure](#project-structure)
- [Architecture & Data Flow](#architecture--data-flow)
- [Components](#components)
- [Services](#services)
- [SEO & Structured Data](#seo--structured-data)
- [Core Web Vitals](#core-web-vitals)
- [Accessibility](#accessibility)
- [Sharable URLs](#sharable-urls)
- [Edge Cases & Error Handling](#edge-cases--error-handling)
- [Known Limitations & Next Steps](#known-limitations--next-steps)
- [License](#license)

---

## Features

### Search & Filter

- Search by **name** (case-insensitive contains).
- Filter by **Films**, **TV Shows**, **Video Games** (derived from the characters API).
- Filter options are computed from the dataset (no hardcoded lists).

### Favorites

- Heart button on each card toggles favorite state.
- Favorites persisted in **localStorage**.
- Favorite state reflected across grid and in dialogs.

### Sharable URLs

- Current filters are synced to the URL as query params: `?name=&film=&tvShow=&videoGame=`.
- **Deep-linking**: loading the app with query params restores the same search state.
- Back/forward navigation updates results accordingly (`popstate` support).

### SEO

- Dynamic `<title>` and `<meta name="description">`.
- **JSON-LD structured data** for WebPage (on list) and Person (on character detail).
- Canonical URL tag.

### Core Web Vitals

- `loading="lazy"` images, fixed dimensions to prevent CLS.
- Small, tree-shaken bundles via Vite + Lit.
- Debounced input and efficient filtering.

### Accessibility

- Keyboard navigation: Enter/Space to toggle favorite; Escape to close dialog.
- Focus trap inside modal dialog; returns focus to opener.
- ARIA: roles, `aria-label`, `aria-modal`, `aria-pressed` on favorite button.

---

## Quick Start

```bash
npm install
npm run dev
```

Dev server: [http://localhost:5173](http://localhost:5173)

> Requires Node 18+ recommended.

---

## Production Build

```bash
npm run build
npm run preview
```

Preview server: [http://localhost:4173](http://localhost:4173)

Alternatively, serve the `dist/` folder with any static server (e.g., `serve -s dist`).

---

## Project Structure

```
src/
├─ components/
│  ├─ disney-search.ts      # Search + filter UI, emits `filters-changed`
│  ├─ disney-card.ts        # Character card, dialog + favorite toggle
│  ├─ disney-loading.ts     # Loading spinner/placeholder
│  └─ disney-error.ts       # Error state component
│
├─ services/
│  ├─ disney-api.ts         # Fetch characters from disneyapi.dev
│  └─ favorites-service.ts  # localStorage favorites (get/toggle)
│
├─ interfaces/
│  └─ DisneyCharacter.ts    # Strong typing for character shape
│
├─ disney-app.ts            # Root: data load, filters, URL sync, favorites
├─ seo-utils.ts             # setMeta + setStructuredData helpers
└─ index.html               # App shell
```

---

## Architecture & Data Flow

**One source of truth** lives in `<disney-app>`:

- On load, `disney-app`:

  1. fetches characters via `disney-api.ts`;
  2. computes unique lists (films, tvShows, videoGames);
  3. restores filters from URL; applies filtering; renders grid.

- `<disney-search>` receives `.films/.tvShows/.videoGames` + `.activeFilters` and emits `filters-changed` with `{ name, film, tvShow, videoGame }`.

- `<disney-app>` listens to `filters-changed` → updates internal `activeFilters`, applies filters, and writes the query string (via `history.replaceState`). It also handles `popstate` to re-apply filters when the user navigates.

- `<disney-card>` emits `toggle-favorite` (with `{ character }`) → `disney-app` updates `favorites-service` using `{ _id }`.

- For SEO, `<disney-card>` can emit `character-selected` on open and `character-closed` on close, or call `SEOUtils` directly. In this project we **centralize in `disney-app`** by handling those events and delegating to `seo-utils.ts`.

**Events**

- `filters-changed` (bubbles): `{ name, film, tvShow, videoGame }`
- `toggle-favorite` (bubbles): `{ id: string }`
- `character-selected` (bubbles): `{ character: DisneyCharacter }`
- `character-closed` (bubbles): `{}`

---

## Components

### `<disney-app>`

- Loads data, manages filter state/favorites, syncs URL, updates SEO via `seo-utils.ts`.

### `<disney-search>`

- Controlled inputs bound to active filters. Emits `filters-changed` on change.

### `<disney-card>`

- Displays name + image; hover interaction; click opens accessible modal dialog.
- Heart button toggles favorite; `aria-pressed` reflects state.
- Emits `character-selected` on open, `character-closed` on close for SEO meta updates.

### `<disney-loading>` / `<disney-error>`

- Dedicated states shown while fetching or on API failure.

---

## Services

### `disney-api.ts`

- `fetchCharacters(): Promise<DisneyCharacter[]>` — wraps the Disney API ([https://disneyapi.dev/](https://disneyapi.dev/)). Includes basic error handling and minimal caching (if implemented).

### `favorites-service.ts`

- `getFavorites(): string[]`
- `toggleFavorite(id: string): void`
- Uses `localStorage` key: `disney:favorites` (configurable).

### `seo-utils.ts`

Utility to set base meta + JSON-LD dynamically.

```ts
export class SEOUtils {
  static setMeta(
    title: string,
    description: string,
    url = window.location.href
  ) {
    document.title = title;
    let desc = document.querySelector("meta[name='description']");
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    (desc as HTMLMetaElement).content = description;

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    (canonical as HTMLLinkElement).href = url;
  }

  static setStructuredData(schema: object) {
    const existing = document.querySelector("script[data-app-structured]");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.appStructured = "true";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }
}
```

**Usage examples**

- On **list/search view** (e.g., after filters change):

```ts
SEOUtils.setMeta(
  "Disney Character Search",
  `Browse Disney characters filtered by film: ${filters.film || "All"}.`,
  window.location.href
);
SEOUtils.setStructuredData({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Disney Character Search",
  description: `Results for film=${filters.film || "All"}, tvShow=${
    filters.tvShow || "All"
  }`,
  url: window.location.href,
});
```

- On **character dialog open**:

```ts
SEOUtils.setMeta(
  `${char.name} | Disney Characters`,
  `${char.name} appears in ${char.films?.join(", ") || "various works"}.`,
  `${window.location.origin}/characters/${encodeURIComponent(char.name)}`
);
SEOUtils.setStructuredData({
  "@context": "https://schema.org",
  "@type": "Person",
  name: char.name,
  description: `Known from: ${
    [
      ...(char.films || []),
      ...(char.tvShows || []),
      ...(char.videoGames || []),
    ].join(", ") || "N/A"
  }`,
  url: `${window.location.origin}/characters/${encodeURIComponent(char.name)}`,
  image: char.imageUrl,
});
```

---

## Core Web Vitals

**Cumulative Layout Shift (CLS)**

- Card and image containers have fixed heights to prevent reflow on load.

**Interaction to Next Paint (INP)**

- Inputs update state efficiently; filter computation is O(n) on the loaded page.

---

## Accessibility

- **Keyboard**: `Tab` to navigate; `Enter`/`Space` activates favorite button; `Escape` closes dialog.
- **Dialog**: Focus trap inside modal; returns focus to the card after closing; `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
- **Images**: `alt` uses the character name; avoid empty or incorrect alts.
- **Buttons**: Favorite button uses `aria-pressed` to reflect toggled state; proper `aria-label`.

---

## Sharable URLs

- Query params reflect active filters:

  - `name` — text search
  - `film` — selected film
  - `tvShow` — selected TV show
  - `videoGame` — selected video game

- `history.replaceState` updates the URL without reload on each filter change.
- `window.onpopstate` (or `addEventListener('popstate', ...)`) restores filters when navigating back/forward.

---

## Edge Cases & Error Handling

- **Network/API error**: Show `<disney-error>` with retry guidance.
- **Empty results**: Render a friendly message like “No characters match these filters.”
- **Broken images**: Fallback text/placeholder area when `imageUrl` is missing.
- **Favorites**: Defensive code if localStorage is unavailable (private mode).

---

## License

MIT © Prabhat Dutt
