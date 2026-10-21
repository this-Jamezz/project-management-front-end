# public/

Static assets served verbatim from the site root by Vite.

| File | Used? | Notes |
|---|---|---|
| `iManageLogo.png` | yes | Logo image |
| `favicon.svg` | no (dead) | Not wired into `index.html` |
| `icons.svg` | no (dead) | Leftover sprite, scheduled for removal |

Reference anything here from the site root (`/iManageLogo.png`), never from
`src/` — bundler-processed images belong in `src/assets/` instead.
