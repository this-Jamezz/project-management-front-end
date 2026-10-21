# utils/

Framework-free helpers. No React imports except the hook below.

## Files

- **`theme.ts`** — Midnight (dark aurora, default) / Daylight (`.light` on
  `<html>`) theme switch, persisted in `localStorage.imanage-theme`.
  `bootstrapTheme()` runs **at module scope in `../main.tsx`, before React
  mounts** — that is what prevents the flash of the wrong theme. Do not move it
  into an effect. Setting the theme calls `applyTheme`, which toggles
  `documentElement.classList.light` and sets `colorScheme`.

- **`media.ts`** — `resolveMediaUrl(path?)`: absolute URLs (Cloudinary) pass
  through untouched; relative paths get `VITE_API_URL` prefixed. Photo URLs are
  absolute Cloudinary links, so always render through this — never build a URL
  by concatenation.

- **`useEscapeToClose.ts`** — one `keydown` listener: Escape closes the dialog
  and focus returns to the pre-dialog element. Never fires while `isBusy`, so a
  submit in flight cannot be abandoned. Used by `SharedComponents/Modal.tsx`.

## Adding a helper to utils/

- Pure function or single-purpose hook, `export function`.
- No styling, no toast, no server calls — those live in components and `api/`.
- Anything env-dependent reads `import.meta.env.VITE_API_URL` like `media.ts`.
