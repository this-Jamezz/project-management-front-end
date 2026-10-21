# layout/

`Layout.tsx` — the authenticated app shell. Everything under `/board`, `/inbox`,
`/task` and `/settings` renders inside it via `App.tsx`'s nested route.

## What it owns

- Page backdrop (`aurora-bg`) and overall frame — `h-dvh`, never `h-screen`
  (on mobile, `100vh` grows past the visible viewport and pushes the fixed
  bottom nav under the URL bar).
- `Docker` — the fixed bottom nav rail (mobile) / left rail.
- `Header` — top bar: workspace/project switcher, search entry, profile menu.
- `<main>` — the `<Outlet />` scroll area. Bottom padding (`pb-28`) clears the
  fixed bottom nav on mobile so pages don't carry their own.

## Props

Workspaces and projects flow **down from `App.tsx`** (single owner of the
active workspace/project state). This layout is purely presentational glue —
it doesn't fetch for itself; it receives `getWorkspace` to call when the
switcher mutates.
