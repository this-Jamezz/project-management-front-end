# src/

Source root. `main.tsx` bootstraps the theme **at module scope** (before React
mounts, so there is no flash), then mounts `App.tsx`, the route table.

## Layout of this folder

```
api/          fetch wrappers — one file per domain
assets/       bundler-processed images
auth/         fetchWithAuth — the single HTTP primitive
components/   UI components, PascalCase folders
interface/    TypeScript types + shared constants
layout/       authenticated app shell (Layout.tsx)
pages/        route components
utils/        theme.ts, media.ts, useEscapeToClose.ts
```

## Component rules (strict)

- `export default function Name() { ... }` — named function declaration.
  Never arrow, never `React.FC`, never `memo`.
- `type XProps = { ... }` immediately above the component.
- `verbatimModuleSyntax: true` ⇒ type imports are `import type { X } from "..."`.
- Indentation is mixed 2- and 4-space across the repo — match the file you edit.
- Styling: Tailwind v4 only, tokens from `index.css` (`@theme` + the `glass*`
  `@utility` classes). `@apply` works only on registered utilities, so those
  glass classes are declared with `@utility`, not plain classes.

## Data flow

`component → src/api/<domain>.ts → fetchWithAuth → back_end`

One `useState` + `useEffect` + try/catch/finally per fetch. Toast on success
and error. Auth token lives in `localStorage.token`; a rejected token is
cleared and the user redirected by `fetchWithAuth`.

## The root files

- `App.tsx` — routes; `PublicRoute` wraps `/`, `/login`, `/register`;
  `PrivateRoute` + `Layout` wrap `/board`, `/inbox`, `/task`, `/settings`;
  `*` → `NotFoundPage`.
- `index.css` — the design system: aurora backdrop, every `glass*` surface,
  per-theme `.light` overrides, the only two animations (`spin`, `shimmer`).
- `vite-env.d.ts` — Vite's client types.
