# iManage — Frontend

React 19 + TypeScript + Vite + Tailwind v4 SPA for iManage.

No react-query, no axios, no zustand, no form library, no headless UI. Data
fetching is always `useState` + `useEffect` + try/catch/finally.

## Commands

```bash
npm run dev      # vite dev server (default http://localhost:5173)
npm run build    # tsc -b && vite build  ← the typecheck gate, always run it
npm run lint     # eslint .
npm run preview  # serve the built dist/
```

## Environment (`.env`)

- `VITE_API_URL` — backend origin. Never put Cloudinary secrets in a `VITE_`
  variable; those are server-only.

## Folder map

| Folder | Contents |
|---|---|
| `public/` | Static assets served verbatim |
| `scripts/` | Reserved for build helpers (currently empty) |
| `src/api/` | One fetch wrapper per domain |
| `src/assets/` | Bundled images |
| `src/auth/` | `fetchWithAuth` — the single HTTP primitive |
| `src/components/` | UI components, PascalCase folders |
| `src/interface/` | TypeScript types + shared constants |
| `src/layout/` | Authenticated app shell |
| `src/pages/` | Route components |
| `src/utils/` | Theme bootstrap, media URL resolution, escape-key hook |

`App.tsx` holds the route table. Theme bootstraps at module scope in
`main.tsx`, before React mounts — do not move it into an effect.

## Conventions — the checklist for any change

- Components are `export default function Name()` with a `type XProps = { ... }`
  directly above. Never arrows, never `React.FC`, never `memo`.
- `verbatimModuleSyntax: true` ⇒ type imports must be `import type { X }`.
- Tailwind v4 only, tokens from `@theme` in `src/index.css`
  (`bg-primary`, `text-primary-dark`, `bg-lightgray`, `text-darkgray`).
- House button idiom: `hover:-translate-y-0.5 active:translate-y-0`.
- Toasts via `import toast from "react-hot-toast"`; icons via `lucide-react`.
- `strict` is off in `tsconfig.app.json` — don't rely on strict-null behavior,
  and don't "fix" it as a drive-by.
- All dialogs go through `components/SharedComponents/Modal.tsx` (it portals to
  `document.body` — a glass dialog rendered inline breaks `position: fixed`).

## Design system — glassmorphism

The UI is a glass surface over a static aurora backdrop, all defined in
`src/index.css` (`glass`, `glass-strong`, `glass-subtle`, `glass-input`,
`aurora-bg` …). The backdrop is **static** — the only animations allowed are
`spin` and `shimmer`. Two themes (Midnight default, Daylight opt-in) driven by
`src/utils/theme.ts` and overridden per theme in the `.light .glass` block.
