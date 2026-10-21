# assets/

Images bundled by Vite (imported from code so they get hashed URLs).

| File | Used? |
|---|---|
| `iManageCover.png` | yes — social/marketing cover on the landing page |
| `hero.png` | no (dead) — leftover from the old hero Section |
| `react.svg` | no (dead) — Vite scaffold origin |
| `vite.svg` | no (dead) — Vite scaffold origin |

Prefer `public/` for anything referenced by URL from HTML/config, and this
folder for anything imported in TSX. Icons do **not** belong here — use
`lucide-react` with `size={15}`-style JSX sizing.
