# auth/

`fetchWIthAuth.ts` — **the single HTTP primitive.** Every backend call goes
through it; no component calls `fetch` directly.

## What it does

- Reads `VITE_API_URL` and the `localStorage.token` for the user.
- Adds `Content-Type: application/json` and `Authorization: Bearer <token>`.
- Tolerates an HTML/empty error body (`response.json().catch(() => ({}))`) so a
  proxy error page doesn't surface as a confusing `SyntaxError`.
- **401 with a token present** clears localStorage and redirects to `/`
  (expired session). A plain "not logged in" 401 is handled by `PrivateRoute`
  instead — that distinction matters; keep it.
- Throws `Error` with the server's message (`message` or `error` — the backend
  middleware uses `error`, controllers use `message`, so it reads both) or a
  generic fallback.

## Conventions

- `api/` wrappers take an `endpoint` (`/api/...`) — no host, no envelope
  unwrapping inside this file.
- Keep the redirect-on-401 behavior; it is the safety net for token revocation.

## The filename has a typo

`fetchWIthAuth.ts` (capital "I" in "WIth") is imported in half the API files.
If you ever rename it, the rename must be repo-wide in one commit — otherwise
Half the imports break. Same story as the other historical typos.
