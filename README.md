# Li Zhi Player

A mobile-first web app focused on Li Zhi's music catalog. Built with Vite, React, Tailwind CSS, and equipped with an installable Progressive Web App (PWA) experience.

## Getting started

```bash
pnpm install
pnpm run dev
```

## Production build

```bash
pnpm run build
pnpm run preview
```

## PWA capabilities

- `vite-plugin-pwa@1.1.0` registers an auto-updating service worker so new releases activate quickly.
- The existing site icon now ships in 192px and 512px sizes with standalone display mode and the `#121212` brand theme.
- Runtime caching:
  - `CacheFirst` for audio streams and artwork so music and cover art stay available offline once cached.
  - `StaleWhileRevalidate` for JS and CSS bundles to keep static assets fresh while still responding instantly.
- Media playback keeps working without network after an initial sync, while new builds download silently in the background.

## Offline audio cache

- Finished tracks are fetched once more after playback and stored as blobs inside IndexedDB (`lizhi-player-audio-cache`).
- Playback checks IndexedDB first and reuses cached `blob:` URLs, so network is skipped when an entry already exists.
- The cache stores the 30 most recently completed songs and evicts older records automatically to stay within quota limits.
- Any failure (quota prompts, CORS, private browsing) falls back to streaming so playback never blocks.

To test the install flow locally, run `pnpm run build && pnpm run preview`, open the preview URL in Chrome, then pick **Install Li Zhi Player** from the omnibox install menu.
