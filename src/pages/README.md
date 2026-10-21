# pages/

Route-level components, mounted by `../App.tsx`. Landing page lives in
`UserPage/` too (`LandingPage.tsx`).

## Routes

| Path | Component | Guard |
|---|---|---|
| `/` | `LandingPage.tsx` — marketing page | `PublicRoute` |
| `/login` | `AuthPage initialMode="login"` | `PublicRoute` |
| `/register` | `AuthPage initialMode="signup"` | `PublicRoute` |
| `/board` | `BoardPage.tsx` — Kanban | `PrivateRoute` + `Layout` |
| `/inbox` | `InboxPage.tsx` — notifications | `PrivateRoute` + `Layout` |
| `/task` | `TaskPage.tsx` — assigned/created/all + filters | `PrivateRoute` + `Layout` |
| `/settings` | `SettingsPage.tsx` — appearance, account, session | `PrivateRoute` + `Layout` |
| `*` | `NotFoundPage.tsx` | — |

`AuthPage` mediates between `Login.tsx` / `Signup.tsx`
(`components/UserComponents/LandingPageComponent/`). Registration does **not**
sign the user in — `Signup` calls `onRegistered(email)`, which flips `AuthPage`
to the login tab with the email prefilled.

## Rules for a new page

- One component per file, `export default function`.
- Fetching: `useState` + `useEffect` + `try/catch/finally`, toast on error.
- Wrap in `PrivateRoute` + `Layout` in `App.tsx`; the page just renders content.
- Loading state via `components/Skeleton/*` or a `<Loading />` overlay; never
  leave a page skeleton-less on first paint.
- All dialogs inside pages go through `components/SharedComponents/Modal.tsx`.
